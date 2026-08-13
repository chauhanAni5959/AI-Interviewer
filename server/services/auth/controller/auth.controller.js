import { app } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.models.js";
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

// Logged in controller for Google authentication
export const GoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    // verifying token
    const decoded = await getAuth(app).verifyIdToken(token);
    // checking the user if it exists or not
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.email?.split('@')[0] || "User",
        email: decoded.email,
      });
    }

    // Generate a random session ID for the user and send it back in the response
    const sessionId = crypto.randomUUID();

    // check if the user is already logged in by checking if the session ID exists in Redis
    console.log("User object before storing:", user);

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 1000 * 60 * 60 * 24, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin,
      },
    });
  } catch (error) {
    res.status(500).json("Google Auth Error: " + error.message);
  }
};

// Logged out controller for Google authentication
export const logOut = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
