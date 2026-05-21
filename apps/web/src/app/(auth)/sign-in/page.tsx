"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  RK,
  RKHeading,
  RKLabel,
  RKInput,
  RKError,
  RKDivider,
  BracketButton,
  GoogleMark,
} from "../_components/rk";

const signInSchema = z.object({
  email: z.string().email("enter a valid email address"),
  password: z.string().min(1, "password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      router.replace("/app");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message ?? "Sign in failed. Please try again.");
      return;
    }

    router.push("/onboarding");
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    });
  };

  return (
    <div>
      <RKHeading
        kicker="auth / sign-in"
        title="Welcome back"
        subtitle="Sign in to your Resitly account."
      />

      <BracketButton type="button" onClick={handleGoogleSignIn}>
        <GoogleMark />
        continue with google
      </BracketButton>

      <RKDivider label="or continue with email" />

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

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <RKLabel htmlFor="password">password</RKLabel>
            <Link
              href="/forgot-password"
              style={{
                fontFamily: RK.mono,
                fontSize: 10,
                letterSpacing: 0.3,
                color: RK.accent,
                textDecoration: "none",
              }}
            >
              forgot?
            </Link>
          </div>
          <RKInput
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && <RKError>{errors.password.message}</RKError>}
        </div>

        {serverError && (
          <div
            style={{
              border: `1px solid ${RK.err}`,
              background: RK.errSoft,
              borderRadius: 3,
              padding: "9px 11px",
              fontFamily: RK.mono,
              fontSize: 11,
              letterSpacing: 0.2,
              color: RK.err,
            }}
          >
            {serverError}
          </div>
        )}

        <BracketButton type="submit" accent disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          {isSubmitting ? "signing in…" : "sign in →"}
        </BracketButton>
      </form>

      <p
        style={{
          marginTop: 18,
          textAlign: "center",
          fontFamily: RK.mono,
          fontSize: 11,
          letterSpacing: 0.2,
          color: RK.ink3,
        }}
      >
        no account?{" "}
        <Link
          href="/sign-up"
          style={{ color: RK.accent, textDecoration: "none" }}
        >
          sign up
        </Link>
      </p>
    </div>
  );
}
