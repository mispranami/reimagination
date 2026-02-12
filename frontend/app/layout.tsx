import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Riot Nexus',
  description: 'Explore Riot Games data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
