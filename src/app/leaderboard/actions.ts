"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma/prisma";

// validation schema for the form inputs
const ScoreInput = z.object({
  username: z.string().trim().min(2, "min. 2 chars").max(24, "max. 24"),
  score: z.coerce.number().int("must be an integer").min(0, ">= 0"),
});

// server action to create a new leaderboard entry
export async function createScore(_prev: unknown, formData: FormData) {
  try {
    // validate the incoming data
    const parsed = ScoreInput.parse({
      username: formData.get("username"),
      score: formData.get("score"),
    });

    // save new entry to database
    await prisma.leaderboardEntry.create({
      data: { username: parsed.username, score: parsed.score },
    });

    // revalidate the leaderboard page so new entry shows up immediately
    revalidatePath("/leaderboard");

    return { ok: true };
  } catch (err: any) {
    // return an error message for debugging or UI
    return { ok: false, error: err?.message ?? "Unknown error" };
  }
}