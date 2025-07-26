import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard Home | EduSign",
  description: "Your dashboard for inclusive communication tools.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
}
export const icons = {
  icon: "/favicon.ico",
  themeColor: "#ffffff",
}

export default function DashboardHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
