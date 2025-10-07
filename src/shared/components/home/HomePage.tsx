import Link from "next/link";
import PokeballButton from "@/shared/components/ui/PokeballButton";

export default function HomePageComponent() {
  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="relative z-40">
        {/* Hero Section */}
        <div className="hero min-h-screen text-neutral-content">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              {/* Hero Content */}
              <h1 className="mb-8 text-5xl font-bold text-yellow-400 drop-shadow-lg md:text-7xl">
                The Pokemon Arena Awaits
              </h1>

              <p className="mb-2 text-lg text-amber-200/70 md:text-2xl">
                Assemble your ultimate team, challenge formidable arenas, and
                climb <br /> the leaderboard to prove you're the very best.
              </p>

              <p className="mb-15 text-lg text-amber-200/70 md:text-2xl">
                Your journey to become a Pokemon Master starts now.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400/80">
                    Build Your Team
                  </h3>
                  <p className="text-amber-200/70">
                    Select your roster of powerful Pokemon to create the
                    ultimate strategic lineup.
                  </p>
                </div>

                <div className="text-center p-4">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400/80">
                    Conquer Arenas
                  </h3>
                  <p className="text-amber-200/70">
                    Enter Ranked Mode and face challenging arenas, earning
                    points for each victory.
                  </p>
                </div>

                <div className="text-center p-4">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400/80">
                    Climb the Ranks
                  </h3>
                  <p className="text-amber-200/70">
                    Your best score is recorded on the leaderboard. Compete
                    against others for the #1 spot.
                  </p>
                </div>
              </div>

              <div className="mt-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
                {/* Link to register */}
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-4 rounded-2xl bg-amber-200/70 px-6 py-2 text-xl font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400"
                >
                  <PokeballButton size="h-8 w-8" />
                  <span>Get Started</span>
                </Link>

                {/* Link to login */}
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-4 rounded-2xl bg-amber-200/70 px-6 py-2 text-xl font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400"
                >
                  <PokeballButton size="h-8 w-8" />
                  <span>Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
