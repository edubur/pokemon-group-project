import Navbar from "@/shared/components/navbar/components/NavBar";
import { getSession } from "@/shared/lib/session/session";
import Background from "@/shared/components/ui/Background";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      <Navbar isLoggedIn={!!session} />
      <Background />
      <main className="relative z-40 pt-20">{children}</main>
    </>
  );
}
