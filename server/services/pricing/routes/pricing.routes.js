import "dotenv/config";
import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";
import redis from "../utils/redis.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { getPlan, pricingPlans } from "../config/plans.js";

const pricingRouter = express.Router();
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const paymentConfigurationError = (res) => res.status(503).json({
  success: false,
  message: "Payment service is not configured. Add Razorpay keys to the pricing service .env file.",
});

pricingRouter.get("/plans", (req, res) => {
  res.json({
    success: true,
    plans: pricingPlans.map(({ id, name, coins, displayPrice, description, featured }) => ({
      id,
      name,
      coins,
      displayPrice,
      description,
      featured,
    })),
  });
});

pricingRouter.post("/orders", async (req, res) => {
  try {
    if (!razorpay) return paymentConfigurationError(res);

    const plan = getPlan(req.body?.planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid pricing plan." });
    }

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `coins_${req.user.userId}_${Date.now()}`,
      notes: { planId: plan.id, coins: String(plan.coins), userId: String(req.user.userId) },
    });

    return res.status(201).json({
      success: true,
      order,
      plan: { id: plan.id, name: plan.name, coins: plan.coins, amount: plan.amount },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(502).json({ success: false, message: "Unable to create payment order." });
  }
});

pricingRouter.post("/verify", async (req, res) => {
  try {
    if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) return paymentConfigurationError(res);

    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: "Incomplete payment details." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    const order = await razorpay.orders.fetch(orderId);
    const plan = getPlan(order.notes?.planId);
    if (!plan || String(order.notes?.userId) !== String(req.user.userId) || order.amount !== plan.amount) {
      return res.status(400).json({ success: false, message: "Payment order does not match the selected plan." });
    }

    const existingPayment = await Payment.findOne({ razorpayPaymentId: paymentId });
    if (existingPayment) {
      const user = await User.findById(req.user.userId).select("interviewCoin");
      return res.json({ success: true, alreadyProcessed: true, interviewCoin: user?.interviewCoin ?? 0 });
    }

    const payment = await Payment.create({
      userId: req.user.userId,
      planId: plan.id,
      coins: plan.coins,
      amount: plan.amount,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $inc: { interviewCoin: plan.coins } },
      { returnDocument: "after", runValidators: true },
    );
    if (!user) {
      await Payment.deleteOne({ _id: payment._id });
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const sessionId = req.cookies?.session;
    if (sessionId) {
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({ userId: user._id, name: user.name, email: user.email, interviewCoin: user.interviewCoin }),
        "EX",
        7 * 24 * 60 * 60,
      );
    }

    return res.json({ success: true, interviewCoin: user.interviewCoin, coinsAdded: plan.coins });
  } catch (error) {
    if (error?.code === 11000) {
      const user = await User.findById(req.user.userId).select("interviewCoin");
      return res.json({ success: true, alreadyProcessed: true, interviewCoin: user?.interviewCoin ?? 0 });
    }
    return res.status(500).json({ success: false, message: "Unable to verify payment." });
  }
});

export default pricingRouter;
