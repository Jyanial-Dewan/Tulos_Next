import type { Metadata } from "next";
import { Prata } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/store-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const font = Prata({
  weight: ["400"],
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
    <html lang="en">
      <body className={`${font.className} h-full antialiased`}>
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
