"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma/prisma";
import { getSession } from "@/shared/lib/session/session";

// Submits a new high score to the leaderboard

export async function submitScoreAction(newScore: number) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to submit a score.");
  }

  const existingEntry = await prisma.leaderboardEntry.findUnique({
    where: { userId: session.userId },
  });

  if (!existingEntry || newScore > existingEntry.score) {
    await prisma.leaderboardEntry.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, score: newScore },
      update: { score: newScore },
    });
    revalidatePath("/gamehub");
    return { success: true, message: "New high score saved!" };
  }

  return {
    success: false,
    message: "Your score was not higher than your personal best.",
  };
}

// Updates number of arenas user has completed in current run
export async function updateArenasCompletedAction(arenasCompleted: number) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to update your progress.");
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { arenasCompleted },
    });
    revalidatePath("/gamehub");
    return { success: true };
  } catch (error) {
    console.error("Failed to update arena progress:", error);
    return { success: false, message: "Failed to save progress." };
  }
}

// Resets uses arena progress to 0 used when starting or forfeiting run
export async function resetArenasCompletedAction() {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to reset progress.");
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { arenasCompleted: 0 },
    });
    revalidatePath("/gamehub");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset arena progress:", error);
    return { success: false, message: "Failed to reset progress." };
  }
}
