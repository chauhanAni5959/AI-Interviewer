import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaX, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import {
  HiEnvelope,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiShieldCheck,
  HiUser,
} from "react-icons/hi2";

const LoginModel = ({ isOpen = true, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Connect to your Auth Service API
    const payload = isSignUp
      ? { fullName, email, password }
      : { email, password };

    console.log(isSignUp ? "Signing Up:" : "Logging In:", payload);

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      if (onClose) onClose();
    }, 1200);
  };

  const handleGoogleAuth = () => {
    console.log("Initiating Google Auth...");
  };

  const handleGithubAuth = () => {
    console.log("Initiating GitHub Auth...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white p-7"
          >
            {/* Subtle Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close Modal"
            >
              <FaX size={13} />
            </button>

            {/* Modal Header */}
            <div className="mb-5 text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-white/50 mt-1">
                {isSignUp
                  ? "Join now to start AI-powered technical interviews."
                  : "Log in to practice your technical AI interviews."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              {/* Full Name Input (Sign Up Only) */}
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="block text-[11px] font-medium text-white/60 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <HiUser
                      className="absolute left-3.5 text-white/30"
                      size={16}
                    />
                    <input
                      type="text"
                      required={isSignUp}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ankit Singh"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-medium text-white/60 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <HiEnvelope
                    className="absolute left-3.5 text-white/30"
                    size={16}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-medium text-white/60 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <HiLockClosed
                    className="absolute left-3.5 text-white/30"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <HiEyeSlash size={15} />
                    ) : (
                      <HiEye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0A0A0A] px-3 text-[10px] text-white/40 uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/80 transition-colors cursor-pointer"
              >
                <FcGoogle size={14} />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubAuth}
                className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/80 transition-colors cursor-pointer"
              >
                <FaGithub size={14} />
                <span>GitHub</span>
              </button>
            </div>

            {/* Sign In / Sign Up Mode Toggle */}
            <div className="mt-4 text-center">
              <p className="text-xs text-white/50">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-white font-semibold underline underline-offset-2 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>

            {/* Firebase Security Badge */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
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
