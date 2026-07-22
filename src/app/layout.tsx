import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import "../styles/scrollbar.css";
import StoreProvider from "@/store/store-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import CatalogProvider from "@/store/CatalogProvider";
import localFont from "next/font/local";

const font = localFont({
  src: [
    { path: "../fonts/Cinzel-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Cinzel-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Cinzel-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Cinzel-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Cinzel-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../fonts/Cinzel-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-cinzel",
});

// const font = Cinzel({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

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
      <body
        className={`${font.className} h-full antialiased`}
        suppressHydrationWarning
      >
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
