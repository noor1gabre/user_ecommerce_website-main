import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Family & Home - Modern Furniture & Home Decor",
  description:
    "Discover carefully curated furniture and home decor that brings comfort, style, and elegance to every corner of your home.",
  keywords: ["furniture", "home decor", "comfort", "style", "elegance", "family", "home", "modern furniture"],
  openGraph: {
    title: "Family & Home - Modern Furniture & Home Decor",
    description:
      "Discover carefully curated furniture and home decor that brings comfort, style, and elegance to every corner of your home.",
    type: "website",
    siteName: "Family & Home",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/family_home_logo.ico",
  },
  verification: {
    google: "iCqiaELFGq5Fc_JR8YrTAFCpckmuVwpvxHSwUCHAY50",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
