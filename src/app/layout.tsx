import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeBattler (placeholder name)",
  description: "Battle through Arenas and climb the leaderboard!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
