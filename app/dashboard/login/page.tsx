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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        <div className="border border-border bg-card p-8 shadow-none md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center border border-border bg-background">
              <Shield className="size-8 text-foreground" />
            </div>
            <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">
              Admin Login
            </h1>
            <p className="text-sm text-muted-foreground">
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
                className="mb-4 border border-destructive/50 bg-background p-3 text-center text-sm text-destructive"
              >
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={loginFormik.handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="editorial-label mb-2 block text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@email.com"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  className={`w-full border-0 border-b bg-transparent py-3.5 pl-8 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none ${
                    loginFormik.touched.email && loginFormik.errors.email
                      ? "border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>
              {loginFormik.touched.email && loginFormik.errors.email && (
                <p className="mt-1.5 text-xs text-destructive">
                  {loginFormik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="editorial-label mb-2 block text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  className={`w-full border-0 border-b bg-transparent py-3.5 pl-8 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none ${
                    loginFormik.touched.password && loginFormik.errors.password
                      ? "border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="mt-1.5 text-xs text-destructive">
                  {loginFormik.errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginFormik.isSubmitting}
              className="editorial-button flex w-full items-center justify-center gap-2 border border-primary bg-primary py-3.5 text-primary-foreground transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginFormik.isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-4"
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
              className="w-full max-w-sm border border-border bg-card p-8 shadow-none"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center border border-border bg-background">
                  <Lock className="size-7 text-foreground" />
                </div>
                <h2 className="mb-1 font-serif text-2xl font-semibold text-foreground">
                  Passkey Verification
                </h2>
                <p className="text-sm text-muted-foreground">
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
                    className="mb-4 border border-destructive/50 bg-background p-3 text-center text-sm text-destructive"
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
                    className={`w-full border-0 border-b bg-transparent px-4 py-3.5 text-center text-lg tracking-[0.3em] text-foreground placeholder:text-muted-foreground placeholder:tracking-normal focus:outline-none ${
                      passkeyFormik.touched.passkey &&
                      passkeyFormik.errors.passkey
                        ? "border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                  />
                  {passkeyFormik.touched.passkey &&
                    passkeyFormik.errors.passkey && (
                      <p className="mt-1.5 text-center text-xs text-destructive">
                        {passkeyFormik.errors.passkey}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={passkeyFormik.isSubmitting}
                  className="editorial-button w-full border border-primary bg-primary py-3.5 text-primary-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
                >
                  Verify & Enter Dashboard
                </button>
              </form>

              <button
                onClick={() => {
                  setShowPasskeyModal(false);
                  useAuthStore.getState().logout();
                }}
                className="mt-3 w-full py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
