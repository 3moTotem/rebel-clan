import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Rebel Clan Management",
  description: "Manage Rebel Clan members, ranks, and roster.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-[#1A1410]">
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, rgba(139,90,43,1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
