"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";
import { SubmitButton } from "../../../shared/components/ui/SubmitButton";
import type { RegisterFormState } from "../types";
import Link from "next/link";

export default function RegisterForm() {
  const initialState: RegisterFormState = {};
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <form
        action={formAction}
        className="relative z-40 w-full max-w-md p-8 space-y-4 bg-gray-900/60 backdrop-blur-md rounded-xl border border-yellow-500/20 shadow-xl"
        noValidate
      >
        {/* Form heading */}
        <h2 className="text-2xl font-bold text-center text-yellow-400 drop-shadow-lg">
          Create an Account!
        </h2>

        {/* Global error message if action fails */}
        {state?.message && !state.errors && (
          <div className="alert alert-error">{state.message}</div>
        )}

        {/* Username input field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-amber-200/80">Username</span>
          </label>
          <input
            type="text"
            name="username"
            required
            className="input input-bordered w-full border-yellow-400/40 focus:border-yellow-400 focus:ring-yellow-400"
          />
          {/* Username error message */}
          {state.errors?.username && (
            <span className="text-error text-xs mt-1">
              {state.errors.username[0]}
            </span>
          )}
        </div>

        {/* Email input field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-amber-200/80">Email</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="input input-bordered w-full border-yellow-400/40 focus:border-yellow-400 focus:ring-yellow-400"
          />
          {/* E-Mail error message */}
          {state.errors?.email && (
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
            autoComplete="new-password"
            className="input input-bordered w-full border-yellow-400/40 focus:border-yellow-400 focus:ring-yellow-400"
          />
          {/* Password error message */}
          {state.errors?.password && (
            <span className="text-error text-xs mt-1">
              {state.errors.password[0]}
            </span>
          )}
        </div>

        {/* Submit button */}
        <SubmitButton label="Sign Up" loadingLabel="Signing Up..." />

        {/* Link to login page */}
        <div className="text-center text-sm text-amber-200/80">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
