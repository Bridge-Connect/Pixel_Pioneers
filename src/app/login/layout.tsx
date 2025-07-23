import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Bridge Connect",
  description: "Sign in or create your account to access Bridge Connect.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
