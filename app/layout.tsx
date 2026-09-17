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
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('forma-theme-v1');if(t!=='light'&&t!=='dark')t='device';var d=t==='dark'||(t==='device'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=t;document.documentElement.dataset.colorScheme=d?'dark':'light'}catch(e){document.documentElement.dataset.theme='device'}})();" }}/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
