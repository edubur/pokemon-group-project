export interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  createdAt: string;
  avatarUrl?: string | null;
}

export type SortKey = "place" | "username" | "score" | "date";
