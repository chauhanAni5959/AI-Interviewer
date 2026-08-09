import { app } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.models.js";
import crypto from "crypto";

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
        name: decoded.name,
        email: decoded.email,
      });
    }

    // Generate a random session ID for the user and send it back in the response
    const sessionId = crypto.randomUUID();
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 1000 * 60 * 60 * 24, // 7 days
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json("Google Auth Error: " + error.message);
  }
};
