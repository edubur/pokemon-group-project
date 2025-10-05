"use server";

import { getSession } from "@/shared/lib/session/session";
import { prisma } from "@/shared/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function submitScoreAction(newScore: number) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to submit a score.");
  }

  // Finds users existing score
  const existingEntry = await prisma.leaderboardEntry.findUnique({
    where: { userId: session.userId },
  });

  // Checks if new score is a personal best
  if (!existingEntry || newScore > existingEntry.score) {
    // If it is update or insert a new one
    await prisma.leaderboardEntry.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        score: newScore,
      },
      update: {
        score: newScore,
      },
    });

    revalidatePath("/gamehub");
    return { success: true, message: "New high score saved!" };
  }

  // If not a high score does nothing
  return {
    success: false,
    message: "Your score was not higher than your personal best.",
  };
}
