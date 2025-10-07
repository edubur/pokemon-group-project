export function calculateScore(totalTurns: number, totalHpLost: number): number {
  const baseScore = 100000;
  const turnPenalty = totalTurns * 100;
  const hpPenalty = totalHpLost;

  const finalScore = Math.max(baseScore - turnPenalty - hpPenalty, 0);
  return finalScore;
}
