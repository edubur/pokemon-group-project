import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Pokemon Group Project",
  description: "WBS Group Project with NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
