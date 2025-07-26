import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Communication | EduSign",
  description: "Real-time speech and text chat for inclusive communication.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
}

export default function LiveCommunicationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
