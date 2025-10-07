import Background from "@/shared/components/ui/Background";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Background />
      <main className="relative z-40">{children}</main>
    </>
  );
}
