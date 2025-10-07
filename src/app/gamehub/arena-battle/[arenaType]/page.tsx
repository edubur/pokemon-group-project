import BattleScene from "@/features/battle/components/BattleUI";


export default function ArenaPage({ params }: { params: { arenaType: string } }) {
  const { arenaType } = params;
  return <BattleScene arenaType={arenaType} mode="ranked" />;
}
