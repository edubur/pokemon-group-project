import BattleScene from "@/features/battle/components/BattleUI";

interface ArenaPageProps {
  params: {
    arenaType: string;
  };
}

export default function ArenaPage({ params }: ArenaPageProps) {
  const { arenaType } = params;
  return <BattleScene arenaType={arenaType} mode="ranked" />;
}
