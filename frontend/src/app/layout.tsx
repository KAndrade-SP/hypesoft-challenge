import type { Metadata } from "next"
import localFont from "next/font/local"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"
import { KeycloakProvider } from "@/components/layout/KeycloakProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Hypesoft Dashboard",
  description: "Products and inventory dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KeycloakProvider>
          {children}
          <ToastContainer position="top-center" autoClose={2500} />
        </KeycloakProvider>
      </body>
    </html>
  );
}
