export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const isFinalEvolution = async (
  pokemonUrl: string
): Promise<boolean> => {
  try {
    const speciesRes = await fetch(pokemonUrl);
    const speciesData = await speciesRes.json();

    if (!speciesData.evolution_chain?.url) return true;

    const evoChainRes = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainRes.json();

    let currentStage = evoChainData.chain;
    while (currentStage.evolves_to.length > 0) {
      currentStage = currentStage.evolves_to[0];
    }

    return speciesData.name === currentStage.species.name;
  } catch (error) {
    console.error("Failed to check evolution status:", error);
    return false;
  }
};

export const idleAnimation = `
  @keyframes idle-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .animate-idle {
    animation: idle-bob 2.5s ease-in-out infinite;
  }
`;

export const faintAnimation = `
  @keyframes faint-fall {
    to { transform: translateY(50px); opacity: 0; }
  }
  .animate-faint {
    animation: faint-fall 1.5s ease-in forwards;
  }
`;

export const actionBoxStyle =
  "bg-gray-900/70 border border-yellow-400/60 rounded-2xl shadow-xl backdrop-blur-md p-4 text-amber-200 h-full flex items-center justify-center";

export const buttonStyle =
  "w-full bg-amber-200/70 text-gray-900/80 text-center py-2 text-xl font-semibold rounded-lg transition transform hover:scale-102 hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50";

export const boxStyle =
  "bg-gray-900/70 border border-yellow-400/80 rounded-2xl shadow-xl backdrop-blur-md p-4 text-amber-200 h-full flex items-center justify-center";
export const moveButtonStyle =
  "w-full border border-yellow-400/80 bg-gray-800/60  text-left p-2 rounded-md transition hover:bg-yellow-400 hover:text-gray-900 focus:bg-yellow-400 focus:text-gray-900";
export const cardStyle =
  "flex items-center gap-2 border border-yellow-400/30 rounded-lg p-2 hover:bg-gray-800/70 disabled:opacity-40 disabled:hover:bg-transparent";
