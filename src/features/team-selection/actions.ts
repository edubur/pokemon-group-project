"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/lib/session/session";
import { prisma } from "@/shared/lib/prisma/prisma";

import { z } from "zod";

const TeamSchema = z.object({
  pokemonIds: z.array(z.number()).max(6, "Team cannot have more than 6 Pokémon."),
});

// Save Team
export async function saveTeamAction(pokemonIds: number[]) {
  // Get current user session
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to save a team.");
  }

  const validatedFields = TeamSchema.safeParse({ pokemonIds });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.flatten().fieldErrors.pokemonIds?.[0] ??
        "Validation failed.",
    };
  }

  try {
    // Update user roster in database
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        roster: validatedFields.data.pokemonIds,
      },
    });

    // Revalidate pages that use Team
    revalidatePath("/team-selection");
    revalidatePath("/gamehub");

    return { success: true, message: "Team saved successfully!" };
  } catch (error) {
    // Handle errors
    console.error("Failed to save team:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
