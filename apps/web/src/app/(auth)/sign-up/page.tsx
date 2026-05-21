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

const signUpSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  email: z.string().email("enter a valid email address"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
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
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message ?? "Sign up failed. Please try again.");
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
        kicker="auth / sign-up"
        title="Create your account"
        subtitle="Start processing receipts for free — 20 / month, no card."
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
          <RKLabel htmlFor="name">full name</RKLabel>
          <RKInput
            id="name"
            placeholder="Ahmad Razali"
            invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && <RKError>{errors.name.message}</RKError>}
        </div>

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
          <RKLabel htmlFor="password">password</RKLabel>
          <RKInput
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="min. 8 characters"
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
              borderRadius: 6,
              padding: "10px 12px",
              fontFamily: RK.sans,
              fontSize: 13,
              color: RK.err,
            }}
          >
            {serverError}
          </div>
        )}

        <BracketButton type="submit" accent disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          {isSubmitting ? "creating account…" : "create account →"}
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
        Already have an account?{" "}
        <Link
          href="/sign-in"
          style={{ color: RK.accent, textDecoration: "none" }}
        >
          sign in
        </Link>
      </p>
    </div>
  );
}
