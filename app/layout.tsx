import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Navbar"; // Adjust the import path if your Header is saved elsewhere
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinnabloom | Artisan Bakery & Sweet Treats",
  description: "Unroll the magic with fresh, hand-crafted cinnamon rolls and artisan bakery delights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDF6E3] text-[#4A2C2A]">
        {/* Floating Capsule Navbar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}