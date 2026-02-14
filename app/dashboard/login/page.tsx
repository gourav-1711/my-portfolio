"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield, Loader2 } from "lucide-react";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const passkeySchema = Yup.object({
  passkey: Yup.string()
    .required("Passkey is required")
    .min(4, "Passkey must be at least 4 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, verifyPasskey } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [passkeyShake, setPasskeyShake] = useState(false);

  // Login form
  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoginError("");
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();

        if (data.success) {
          login();
          setShowPasskeyModal(true);
        } else {
          setLoginError(data.message || "Invalid credentials");
        }
      } catch {
        setLoginError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Passkey form
  const passkeyFormik = useFormik({
    initialValues: { passkey: "" },
    validationSchema: passkeySchema,
    onSubmit: (values, { setSubmitting }) => {
      setPasskeyError("");
      const validPasskey = process.env.NEXT_PUBLIC_PASSKEY;

      if (values.passkey === validPasskey) {
        verifyPasskey();
        router.push("/dashboard");
      } else {
        setPasskeyError("Invalid passkey. Access denied.");
        setPasskeyShake(true);
        setTimeout(() => setPasskeyShake(false), 600);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Login Error */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
              >
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={loginFormik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@email.com"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
                    loginFormik.touched.email && loginFormik.errors.email
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                />
              </div>
              {loginFormik.touched.email && loginFormik.errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {loginFormik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
                    loginFormik.touched.password && loginFormik.errors.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {loginFormik.errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginFormik.isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginFormik.isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Passkey Modal */}
      <AnimatePresence>
        {showPasskeyModal && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: passkeyShake ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Passkey Verification
                </h2>
                <p className="text-gray-400 text-sm">
                  Enter your admin passkey to continue
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {passkeyError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                  >
                    {passkeyError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Passkey Form */}
              <form onSubmit={passkeyFormik.handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    name="passkey"
                    placeholder="Enter passkey"
                    value={passkeyFormik.values.passkey}
                    onChange={passkeyFormik.handleChange}
                    onBlur={passkeyFormik.handleBlur}
                    autoFocus
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white text-center text-lg tracking-[0.3em] placeholder:text-gray-600 placeholder:tracking-normal focus:outline-none focus:ring-2 transition-all ${
                      passkeyFormik.touched.passkey &&
                      passkeyFormik.errors.passkey
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:ring-orange-500/30 focus:border-orange-500/50"
                    }`}
                  />
                  {passkeyFormik.touched.passkey &&
                    passkeyFormik.errors.passkey && (
                      <p className="mt-1.5 text-xs text-red-400 text-center">
                        {passkeyFormik.errors.passkey}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={passkeyFormik.isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50"
                >
                  Verify & Enter Dashboard
                </button>
              </form>

              <button
                onClick={() => {
                  setShowPasskeyModal(false);
                  useAuthStore.getState().logout();
                }}
                className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
