import type { Metadata } from "next";
import { Smooch_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/store-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const font = Smooch_Sans({
  variable: "--font-smooch_sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tulos",
  description: "Tulos Online Shopping Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
