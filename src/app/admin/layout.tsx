import AdminHeader from "@/components/adminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
}
