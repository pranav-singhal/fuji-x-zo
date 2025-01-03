import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dexter X Zo',
  description: 'An exclusive photo gallery for the founders of zo world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
