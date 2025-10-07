export default async function GamehubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="relative z-40">{children}</main>
    </>
  );
}
