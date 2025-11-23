import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GIAS – Global Interoperability & AI Standards Institute',
  description: 'Institutional authority for AI standards, certification, and attestation.',
  keywords: ['AI standards', 'certification', 'attestation', 'governance', 'compliance'],
  openGraph: {
    title: 'GIAS Institute',
    description: 'Global standards for AI interoperability and governance.',
    url: 'https://gias.institute',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-neutral-50 text-slate-800">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
