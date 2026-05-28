"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { useAuthStore } from "@/store/auth-store";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const { error } = await resetPassword(email);

    if (error) {
      setLoading(false);
      setFormError(error);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.div
          key="form"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>

          <h2 className="text-2xl font-semibold tracking-tight mb-1">Reset password</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                {formError}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nurse@school.edu"
                className="h-11"
                required
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-crosshere hover:bg-crosshere/90 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send reset link
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Check your email</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            We&apos;ve sent a password reset link to{" "}
            <strong>{email}</strong>. Please check your inbox and spam folder.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full h-11 bg-crosshere hover:bg-crosshere/90 text-white"
              onClick={() => window.open("mailto:", "_blank")}
            >
              <Mail className="size-4" />
              Open email app
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              Didn&apos;t receive it? Try again
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
