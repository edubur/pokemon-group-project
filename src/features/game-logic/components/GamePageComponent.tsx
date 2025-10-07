"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";
import Link from "next/link";
import AvatarUploadModal from "@/features/profile-picture/components/AvatarUpload";
import { Pokemon } from "@/features/team-selection/types";
import { resetArenasCompletedAction } from "@/features/game-logic/actions";
import { LeaderboardEntry } from "../types";
import Navbar from "@/shared/components/navbar/components/NavBar";
import Background from "@/shared/components/ui/Background";

// Displays the main game hub showing profile info, team,
// ranked/unranked modes, and leaderboard
export default function GamePageClient({
  user,
  personalBest,
  team,
  rank,
  leaderboard,
  isLoggedIn,
}: {
  user: User | null;
  personalBest: number;
  team: Pokemon[];
  rank: number | string;
  leaderboard: LeaderboardEntry[];
  isLoggedIn: boolean;
}) {
  // Ref for avatar upload modal
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();

  // Local state for tracking arenas completed in ranked mode
  const [arenasCompleted, setArenasCompleted] = useState(
    user?.arenasCompleted || 0
  );

  // Syncs arenasCompleted whenever user data changes
  useEffect(() => {
    setArenasCompleted(user?.arenasCompleted || 0);
  }, [user?.arenasCompleted]);

  // Starts new Ranked session
  const handlePlayRanked = async () => {
    await resetArenasCompletedAction();

    const arenas = ["fire", "water", "grass", "rock", "electric"];
    const shuffledArenas = arenas.sort(() => 0.5 - Math.random());

    const progress = {
      arenas: shuffledArenas,
      completed: 0,
    };

    sessionStorage.setItem("rankedProgress", JSON.stringify(progress));
    sessionStorage.removeItem("rankedStats");
    setArenasCompleted(0);

    router.push(`/gamehub/arena-battle/${shuffledArenas[0]}`);
  };

  // Handles continue Ranked game
  const handleContinueRanked = () => {
    const progressString = sessionStorage.getItem("rankedProgress");
    if (progressString) {
      const progress = JSON.parse(progressString);
      if (progress.completed < progress.arenas.length) {
        const nextArena = progress.arenas[progress.completed];
        router.push(`/gamehub/arena-battle/${nextArena}`);
        return;
      }
    }
    handlePlayRanked();
  };

  // Default avatar if user has none
  const avatarSrc = user?.avatarUrl || "/default_profile_picture.png";

  // Progress percentage for ranked arenas
  const progressPercentage = (arenasCompleted / 5) * 100;
  // const progressPercentage = (arenasCompleted / 1) * 100; for testing

  return (
    <>
      <Background />
      <Navbar isLoggedIn={isLoggedIn} />
      {/* Main layout */}
      <main className="relative z-40 pt-24 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden text-amber-200/80">
        <div className="relative z-40 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar Profile info + leaderboard */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Player profile card */}
              <div className="card bg-gray-900/60 border border-yellow-500/20 shadow-xl backdrop-blur-sm">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    {/* Avatar clickable to open upload modal */}
                    <div
                      className="avatar online cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => dialogRef.current?.showModal()}
                    >
                      <div className="w-16 rounded-full border border-yellow-400/40">
                        <img src={avatarSrc} alt="Player Avatar" />
                      </div>
                    </div>
                    <div>
                      <h2 className="card-title text-xl text-yellow-400">
                        {user?.username || "Player"}
                      </h2>
                      <span className="text-sm text-amber-200/60">
                        Pokemon Trainer
                      </span>
                    </div>
                  </div>

                  <div className="divider my-2 border-yellow-500/20"></div>

                  {/* Stats Personal Best + Rank */}
                  <div className="stats stats-vertical shadow-inner bg-gray-800/70 border border-yellow-500/10">
                    <div className="stat text-amber-200/80">
                      <div className="stat-title text-yellow-400/80">
                        Personal Best
                      </div>

                      <div className="stat-value text-yellow-400">
                        {personalBest.toLocaleString()}
                      </div>
                    </div>
                    <div className="stat text-amber-200/80">
                      <div className="stat-title text-yellow-400/80">
                        Current Rank
                      </div>

                      <div className="stat-value text-yellow-400">{rank}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard card */}
              <div className="card bg-gray-900/60 border border-yellow-500/20 shadow-xl backdrop-blur-sm">
                <div className="card-body">
                  <h2 className="card-title mb-4 text-yellow-400">
                    Leaderboard Top 5
                  </h2>

                  {leaderboard.length > 0 ? (
                    <div className="space-y-4">
                      {leaderboard.map((entry, idx) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 bg-gray-800/60 rounded-xl p-2 border border-yellow-500/10"
                        >
                          <div className="font-bold text-lg text-yellow-400 w-6">
                            {idx + 1}
                          </div>

                          <div className="avatar">
                            <div className="w-10 rounded-full border border-yellow-500/20 overflow-hidden">
                              <img
                                src={
                                  entry.user.avatarUrl ||
                                  "/default_profile_picture.png"
                                }
                                alt={entry.user.username}
                              />
                            </div>
                          </div>

                          <div className="flex-grow font-semibold text-amber-200/80">
                            {entry.user.username}
                          </div>
                          <div className="text-sm font-medium text-yellow-400/80">
                            {entry.score.toLocaleString()} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-200/70">
                      No leaderboard entries yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right section Ranked/Unranked modes + Team */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Ranked Card */}
              <div className="card bg-gray-900/60 border border-yellow-500/20 shadow-xl backdrop-blur-sm text-center">
                <div className="card-body items-center">
                  <h2 className="card-title text-3xl font-bold text-yellow-400">
                    Ranked
                  </h2>
                  <p className="my-4 text-amber-200/80">
                    Face 5 random arenas and fight for the top leaderboard spot!
                  </p>

                  {/* Progress bar if arenas completed */}
                  {arenasCompleted > 0 && arenasCompleted < 5 && (
                    <div className="w-full max-w-sm my-2">
                      <p className="text-amber-200/90 mb-1">
                        Arenas Cleared: {arenasCompleted} / 5
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions mt-4">
                    <button
                      onClick={
                        arenasCompleted > 0 && arenasCompleted < 1
                          ? handleContinueRanked
                          : handlePlayRanked
                      }
                      className="rounded-2xl bg-amber-200/70 px-6 py-2 text-lg font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400"
                    >
                      {arenasCompleted > 0 && arenasCompleted < 1
                        ? "CONTINUE"
                        : "PLAY"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Unranked Card */}
              <div className="card bg-gray-900/60 border border-yellow-500/20 shadow-xl backdrop-blur-sm text-center">
                <div className="card-body items-center">
                  <h2 className="card-title text-3xl font-bold text-yellow-400">
                    Unranked
                  </h2>
                  <p className="my-4 text-amber-200/80">
                    Face 5 random arenas to test your Team before jumping into
                    ranked!
                  </p>
                  <div className="card-actions">
                    <button className="rounded-2xl bg-amber-200/70 px-6 py-2 text-lg font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400">
                      PLAY
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Card */}
              <div className="card bg-gray-900/60 border border-yellow-500/20 shadow-xl backdrop-blur-sm">
                <div className="card-body items-center">
                  <h2 className="card-title mb-4 text-2xl text-yellow-400">
                    Your Team
                  </h2>
                  <div className="flex flex-row flex-wrap gap-12 justify-center items-center">
                    {team && team.length > 0 ? (
                      team.map((pokemon) => (
                        <div
                          key={pokemon.id}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="avatar">
                            <div className="w-20 rounded-full border border-yellow-400/30">
                              <img src={pokemon.image} alt={pokemon.name} />
                            </div>
                          </div>
                          <div className="text-sm font-bold capitalize text-amber-200/80">
                            {pokemon.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center">
                        <p className="text-sm text-amber-200/60">
                          You have no Pokémon in your team.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="card-actions mt-4">
                    <Link href="/team-selection">
                      <button className="rounded-2xl bg-amber-200/70 px-6 py-2 text-lg font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400">
                        EDIT TEAM
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AvatarUploadModal dialogRef={dialogRef} />
    </>
  );
}
