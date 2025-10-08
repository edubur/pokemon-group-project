"use server";

import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/shared/lib/session/session";
import { prisma } from "@/shared/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ProfilePictureFormState } from "./types";

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { z } from "zod";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ProfilePictureSchema = z.object({
  profilePicture: z
    .any()
    .refine((file) => file?.size > 0, "No file selected.")
    .refine(
      (file) => file?.size <= MAX_SIZE,
      "File is too large. Maximum allowed size is 2MB."
    )
    .refine(
      (file) => ALLOWED_TYPES.includes(file?.type),
      "Invalid file type. Only JPG, PNG, and WEBP are allowed."
    ),
});

// Update Profile Picture
export async function updateProfilePictureAction(
  previousState: ProfilePictureFormState,
  formData: FormData
): Promise<ProfilePictureFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: "You must be logged in." };
  }

  const validatedFields = ProfilePictureSchema.safeParse({
    profilePicture: formData.get("profilePicture"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.flatten().fieldErrors.profilePicture?.[0] ??
        "Validation failed.",
    };
  }

  const { profilePicture } = validatedFields.data;

  const arrayBuffer = await profilePicture.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile_pictures",
              transformation: [{ width: 400, height: 400, crop: "fill" }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );

    // Update user avatar in database
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        avatarUrl: result.secure_url,
      },
    });

    // Revalidate game page
    revalidatePath("/gamehub");
    return {
      success: true,
      message: "Upload successful!",
      url: result.secure_url,
    };
  } catch {
    return { success: false, message: "Failed to upload image." };
  }
}

// Clear Profile Picture
export async function clearProfilePictureAction(): Promise<ProfilePictureFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: "You must be logged in." };
  }

  try {
    // Remove avatar from database
    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl: null },
    });

    // Revalidate game page
    revalidatePath("/gamehub");

    return { success: true, message: "Picture cleared." };
  } catch {
    return { success: false, message: "Failed to clear picture." };
  }
}
