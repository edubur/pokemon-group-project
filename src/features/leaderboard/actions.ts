"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma/prisma";

// validation schema for the form inputs
const ScoreInput = z.object({
  score: z.coerce.number().int("must be an integer").min(0, ">= 0"),
  userId: z.number(),
});

// server action to create a new leaderboard entry
export async function createScore(_prev: unknown, formData: FormData) {
  try {
    // validate the incoming data
    const parsed = ScoreInput.parse({
      score: formData.get("score"),
      userId: Number(formData.get("userId")),
    });

    // save new entry to database
    await prisma.leaderboardEntry.create({
      data: {
        score: parsed.score,
        user: { connect: { id: parsed.userId } },
      },
    });

    // revalidate the leaderboard page so new entry shows up immediately
    revalidatePath("/leaderboard");

    return { ok: true };
  } catch (err: any) {
    // return an error message for debugging or UI
    return { ok: false, error: err?.message ?? "Unknown error" };
  }
}
