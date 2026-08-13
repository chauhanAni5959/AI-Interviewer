import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaX } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { HiShieldCheck } from "react-icons/hi2";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import api from "../utils/axios";

const LoginModel = ({ isOpen, onClose, setUser }) => {
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await api.post("/api/auth/login", { token });
      setUser(response?.data);
      onClose();
    } catch (error) {
      console.log("Error in Login", error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop Overlay with Fade Exit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white p-7"
          >
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer z-20"
              aria-label="Close Modal"
            >
              <FaX size={13} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Get Started
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Sign in with Google to practice your technical AI interviews.
              </p>
            </div>

            {/* Single Google Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm"
            >
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </motion.button>

            {/* Security Badge */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <HiShieldCheck className="text-emerald-400" size={14} />
              <span>Secured by Firebase Authentication</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModel;
