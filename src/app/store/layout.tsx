import { StoreNav } from "@/components/layout/store-nav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <StoreNav />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>
    </div>
  );
}
