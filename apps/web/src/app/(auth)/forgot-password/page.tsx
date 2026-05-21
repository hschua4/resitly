"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  RK,
  RKHeading,
  RKLabel,
  RKInput,
  RKError,
  BracketButton,
} from "../_components/rk";

const schema = z.object({
  email: z.string().email("enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            margin: "0 auto 16px",
            border: `1px solid ${RK.ok}`,
            background: RK.okSoft,
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            color: RK.ok,
          }}
        >
          <Check className="size-5" />
        </div>
        <h2
          style={{
            fontFamily: RK.sans,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: -0.3,
            color: RK.ink,
            margin: 0,
          }}
        >
          Check your email
        </h2>
        <p
          style={{
            fontFamily: RK.sans,
            fontSize: 13,
            color: RK.ink2,
            lineHeight: 1.55,
            margin: "8px auto 18px",
            maxWidth: 280,
          }}
        >
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link
          href="/sign-in"
          style={{
            fontFamily: RK.sans,
            fontSize: 13,
            fontWeight: 510,
            color: RK.accent,
            textDecoration: "none",
          }}
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <RKHeading
        kicker="auth / reset"
        title="Forgot password"
        subtitle="Enter your email and we'll send a reset link."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <RKLabel htmlFor="email">email address</RKLabel>
          <RKInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <RKError>{errors.email.message}</RKError>}
        </div>

        <BracketButton type="submit" accent disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          {isSubmitting ? "sending…" : "send reset link →"}
        </BracketButton>
      </form>

      <p
        style={{
          marginTop: 20,
          textAlign: "center",
          fontFamily: RK.sans,
          fontSize: 13,
          color: RK.ink3,
        }}
      >
        <Link
          href="/sign-in"
          style={{ color: RK.accent, textDecoration: "none", fontWeight: 510 }}
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
