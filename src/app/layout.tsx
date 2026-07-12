import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import "../styles/scrollbar.css";
import StoreProvider from "@/store/store-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import CatalogProvider from "@/store/CatalogProvider";

const font = Cinzel({
  weight: ["400", "500", "600", "700", "800", "900"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} h-full antialiased`} suppressHydrationWarning>
        <StoreProvider>
          <CatalogProvider>
            <Navbar />
            <main className="w-[90%] min-h-screen mx-auto py-3">
              {children}
            </main>
            <Toaster />
            <Footer />
          </CatalogProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
