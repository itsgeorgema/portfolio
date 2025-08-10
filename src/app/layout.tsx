import type { Metadata } from "next";
import { Oxanium, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { nardoGrayColors } from "@/styles/colors";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "George's Portfolio",
  description: "George's personal portfoliowebsite",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    title: "George's Portfolio",
    description: "George's personal portfolio website",
    url: "",
    siteName: "George's Portfolio",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "portfolio",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body
        className={`${oxanium.variable} ${orbitron.variable} antialiased flex flex-col h-full`}
        style={{ backgroundColor: nardoGrayColors.primary[500] }}
      >
        <Navbar/>
        <main className="flex-1">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
