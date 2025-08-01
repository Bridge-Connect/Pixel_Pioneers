import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function LearningPathLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>;
}
