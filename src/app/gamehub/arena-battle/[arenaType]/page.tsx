import BattleScene from "@/features/battle/components/BattleUI";

interface ArenaPageProps {
  params: {
    arenaType: string;
  };
}

export default async function ArenaPage({ params }: ArenaPageProps) {
  const { arenaType } = await params;

  return <BattleScene arenaType={arenaType} mode="ranked" />;
}
