import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORMA — Considered furniture. Everyday living.",
  description: "Furniture for the art of feeling at home. Discover sculptural seating, thoughtful tables, lighting, and objects from Forma Studio.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
