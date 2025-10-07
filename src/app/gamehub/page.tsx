import GamePageClient from "@/features/game-logic/components/GamePageComponent";
import {
  getCurrentUser,
  getLeaderboardTop,
  getPersonalBestAndRank,
  getUserTeam,
} from "@/features/game-logic/lib/data";
import { redirect } from "next/navigation";

export default async function GamePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch data
  const [leaderboard, { personalBest, rank }, team] = await Promise.all([
    getLeaderboardTop(),
    getPersonalBestAndRank(user.id),
    getUserTeam(user),
  ]);

  return (
    <GamePageClient
      user={user}
      personalBest={personalBest}
      rank={rank}
      team={team}
      leaderboard={leaderboard}
    />
  );
}
