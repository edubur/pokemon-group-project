"use client";

import { useFormStatus } from "react-dom";
import React from "react";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loadingLabel: string;
  className?: string;
}

export function SubmitButton({
  label,
  loadingLabel,
  className = "",
  ...props // Captures rest of props
}: SubmitButtonProps) {
  const { pending } = useFormStatus(); // Tracks if form is submitting

  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn rounded-2xl bg-amber-200/70 text-gray-900 hover:bg-yellow-400 transition-transform ${className}`}
      {...props} // Rest of props
    >
      {pending ? (
        <>
          <span className="loading loading-spinner mr-2"></span>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
