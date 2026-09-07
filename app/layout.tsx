import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Orbit Directory",
  description: "Discover and explore the best AI tools and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}