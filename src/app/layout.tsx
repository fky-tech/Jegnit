import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Jegnit Shapewear | Premium Shapewear for Ethiopian Women",
  description: "Designed for the elegance and strength of Ethiopian women. Experience the perfect blend of comfort, support, and confidence.",
  metadataBase: new URL("https://jegnitshapewear.com"),
  keywords: ["Jegnit", "shapewear", "Ethiopian shapewear", "waist trainer", "bodysuit", "Addis Ababa"],
  openGraph: {
    title: "Jegnit Shapewear | Strength in Womanhood",
    description: "Designed for the elegance and strength of Ethiopian women. Premium shapewear, support, and confidence.",
    url: "https://jegnitshapewear.com",
    siteName: "Jegnit Shapewear",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Jegnit Shapewear Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
