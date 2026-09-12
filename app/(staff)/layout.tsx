export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Staff Portal Navigation placeholder */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
