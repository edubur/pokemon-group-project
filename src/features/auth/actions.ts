"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma/prisma";
import { createSession } from "@/shared/lib/session/session";
import comparePassword from "@/shared/lib/password/comparePassword";
import generateSalt from "@/shared/lib/password/saltHelper";
import hashPassword from "@/shared/lib/password/hashPassword";
import type { LoginFormState, RegisterFormState } from "./types";
import { deleteSession } from "@/shared/lib/session/session";

// Schema for login form fields
const loginSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// Login server action
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Parse form fields
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // Return errors if validation failed
  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password: suppliedPassword } = validatedFields.data;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: "Invalid email or password." };
    }

    // Compare supplied password with stored hash
    const isPasswordCorrect = await comparePassword(
      user.password,
      user.salt,
      suppliedPassword
    );

    if (!isPasswordCorrect) {
      return { message: "Invalid email or password." };
    }

    // Create session after successful login
    await createSession(user.id);
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }

  // Redirect user to home page
  redirect("/gamehub");
}

// Schema for validating registration form fields
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// Register server action
export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  // Parse and validate form fields
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // Return validation errors if present
  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, ...rest } = validatedFields.data;

  try {
    // Prevent duplicate accounts
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        message: "An account with this email already exists.",
        errors: { email: ["Email already in use."] },
      };
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Create new user in database
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword as string,
        salt,
        ...rest,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "An unexpected server error occurred." };
  }

  // Redirect to login page after registration
  redirect("/login");
}

// Logs out the current user
export async function logout() {
  try {
    // Delete the user session
    await deleteSession();
  } catch (error) {
    console.error("Logout failed:", error); // Log error if session deletion fails
  }

  // Redirect user to homepage
  redirect("/");
}
