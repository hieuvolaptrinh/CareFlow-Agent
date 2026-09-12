export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Patient Header & Navigation placeholder */}
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
