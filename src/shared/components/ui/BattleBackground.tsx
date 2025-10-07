"use client";

interface BattleBackgroundProps {
  arenaType?: string;
}

const themes: {
  [key: string]: {
    from: string;
    to: string;
    platform1: string;
    platform2: string;
  };
} = {
  grass: {
    from: "#6BCB77",
    to: "#D3FAD6",
    platform1: "#4CAF50",
    platform2: "#81C784",
  },
  fire: {
    from: "#FF5733",
    to: "#FFC300",
    platform1: "#C70039",
    platform2: "#900C3F",
  },
  water: {
    from: "#3498DB",
    to: "#AED6F1",
    platform1: "#2E86C1",
    platform2: "#5DADE2",
  },
  stone: {
    from: "#8D6E63",
    to: "#D7CCC8",
    platform1: "#6D4C41",
    platform2: "#A1887F",
  },
  electric: {
    from: "#F1C40F",
    to: "#F9E79F",
    platform1: "#B7950B",
    platform2: "#D4AC0D",
  },
  default: {
    from: "#6BCB77",
    to: "#D3FAD6",
    platform1: "#4CAF50",
    platform2: "#81C784",
  },
};

export default function BattleBackground({
  arenaType = "default",
}: BattleBackgroundProps) {
  const theme = themes[arenaType] || themes.default;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top, ${theme.from}, ${theme.to})`,
        }}
      />
      <div
        className="absolute bottom-[18%] left-[23%] w-[50%] h-[25%] rounded-[50%] opacity-80 blur-[2px]"
        style={{
          backgroundImage: `linear-gradient(to top, ${theme.platform1}, ${theme.platform2})`,
        }}
      />
      <div
        className="absolute top-[18%] right-[3%] w-[40%] h-[18%] rounded-[50%] opacity-70 blur-[2px]"
        style={{
          backgroundImage: `linear-gradient(to top, ${theme.platform2}, ${theme.platform1})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
