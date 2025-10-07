"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma/prisma";
import { getSession } from "@/shared/lib/session/session";

// Validation schema for the score input
const ScoreInput = z.object({
  score: z.coerce.number().int("must be an integer").min(0, ">= 0"),
});

// Create or update leaderboard entry for the current user
export async function createScore(_prev: unknown, formData: FormData) {
  try {
    // Validate score input
    const parsed = ScoreInput.parse({
      score: formData.get("score"),
    });

    // Get current session (user must be logged in)
    const session = await getSession();
    if (!session?.userId) {
      throw new Error("You must be logged in to submit a score.");
    }

    // Convert session.userId to number for Prisma
    const userId = Number(session.userId);
    if (Number.isNaN(userId)) {
      throw new Error("Invalid userId in session.");
    }

    // Fetch the user's data (username and avatarUrl)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, avatarUrl: true },
    });

    if (!user?.username) {
      throw new Error("User must have a username to submit a score.");
    }

    // Check for existing leaderboard entry
    const existingEntry = await prisma.leaderboardEntry.findUnique({
      where: { userId },
    });

    // If new score is higher, or no entry exists, update/create
    if (!existingEntry || parsed.score > existingEntry.score) {
      await prisma.leaderboardEntry.upsert({
        where: { userId },
        create: {
          userId,
          username: user.username,
          score: parsed.score,
        },
        update: {
          score: parsed.score,
          username: user.username,
        },
      });
    }

    revalidatePath("/leaderboard");
    return { ok: true, message: "Score submitted successfully!" };
  } catch (err: any) {
    console.error("Failed to create score:", err);
    return { ok: false, error: err?.message ?? "Unknown error" };
  }
}

// Fetch leaderboard entries (sorted by score)
export async function getLeaderboard() {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: { score: "desc" },
      select: {
        id: true,
        username: true,
        score: true,
        createdAt: true,
        user: { select: { avatarUrl: true } },
      },
    });


    return entries.map((entry) => ({
      ...entry,
      avatarUrl: entry.user.avatarUrl,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
