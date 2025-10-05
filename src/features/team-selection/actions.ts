"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/lib/session/session";
import { prisma } from "@/shared/lib/prisma/prisma";

// Save Team
export async function saveTeamAction(pokemonIds: number[]) {
  // Get current user session
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to save a team.");
  }

  // Max Team size 6
  if (pokemonIds.length > 6) {
    throw new Error("Team cannot have more than 6 Pokémon.");
  }

  try {
    // Update user roster in database
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        roster: pokemonIds,
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
