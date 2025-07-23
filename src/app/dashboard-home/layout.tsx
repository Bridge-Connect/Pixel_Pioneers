import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard Home | Bridge Connect",
  description: "Your dashboard for inclusive communication tools.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
}

export default function DashboardHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
