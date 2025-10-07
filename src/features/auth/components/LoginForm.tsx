"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { SubmitButton } from "../../../shared/components/ui/SubmitButton";
import type { LoginFormState } from "../types";
import Link from "next/link";

export default function LoginForm() {
  const initialState: LoginFormState = {};
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <form
        action={formAction}
        className="relative z-40 w-full max-w-sm p-8 space-y-4 bg-gray-900/60 border border-yellow-500/20 backdrop-blur-md rounded-xl shadow-xl text-amber-200/80"
        noValidate
      >
        {/* Form heading */}
        <h2 className="text-2xl font-bold text-center text-yellow-400 drop-shadow-lg">
          Login
        </h2>

        {/* Global error message on submission fail*/}
        {state?.message && !state.errors && (
          <div className="alert alert-error">{state.message}</div>
        )}

        {/* Email input field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-amber-200/80">Email</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            autoComplete="email"
            className="input input-bordered w-full bg-gray-800/50 text-amber-200/80 border-yellow-400/40 placeholder-amber-400/50 focus:border-yellow-400 focus:ring-yellow-400/40"
          />
          {/* E-Mail error message */}
          {state?.errors?.email && (
            <span className="text-error text-xs mt-1">
              {state.errors.email[0]}
            </span>
          )}
        </div>

        {/* Password input field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-amber-200/80">Password</span>
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            autoComplete="current-password"
            className="input input-bordered w-full bg-gray-800/50 text-amber-200/80 border-yellow-400/40 placeholder-amber-400/50 focus:border-yellow-400 focus:ring-yellow-400/40"
          />
          {/* Password error message */}
          {state?.errors?.password && (
            <span className="text-error text-xs mt-1">
              {state.errors.password[0]}
            </span>
          )}
        </div>

        {/* Submit button */}
        <SubmitButton label="Login" loadingLabel="Logging in..." />

        {/* Link to registration page */}
        <div className="text-center text-sm mt-2">
          <span className="text-amber-200/80">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/register"
            className="text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
