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

// Update Profile Picture
export async function updateProfilePictureAction(
  previousState: ProfilePictureFormState,
  formData: FormData
): Promise<ProfilePictureFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: "You must be logged in." };
  }

  // Get file from form data
  const file = formData.get("profilePicture") as File;
  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    // Upload to Cloudinary
    const result: unknown = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile_pictures",
            transformation: [{ width: 400, height: 400, crop: "fill" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Update user avatar in database
    if (
      typeof result === "object" &&
      result !== null &&
      "secure_url" in result &&
  typeof (result as { secure_url?: unknown }).secure_url === "string"
    ) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          avatarUrl: (result as { secure_url: string }).secure_url,
        },
      });

      // Revalidate game page
      revalidatePath("/gamehub");
      return {
        success: true,
        message: "Upload successful!",
        url: (result as { secure_url: string }).secure_url,
      };
    } else {
      return {
        success: false,
        message: "Upload failed: No secure_url returned.",
      };
    }
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
