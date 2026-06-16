// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import DynamicFavicon from '@/components/dynamic-favicon'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PSICOMOTRICIDAD Y DEPORTES - UPEA',
  description: 'PSICOMOTRICIDAD Y DEPORTES - Universidad Pública de El Alto',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <DynamicFavicon />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}