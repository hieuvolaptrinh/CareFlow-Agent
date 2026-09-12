export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar Navigation placeholder */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
