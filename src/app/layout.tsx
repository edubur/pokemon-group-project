import type { Metadata } from "next";
import "./globals.css";
import Background from "@/shared/components/ui/Background";

export const metadata: Metadata = {
  title: "Pokemon Battler",
  description: "Battle through Arenas and climb the leaderboard!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <Background />
        <div className="relative z-40">{children}</div>{" "}
      </body>
    </html>
  );
}
