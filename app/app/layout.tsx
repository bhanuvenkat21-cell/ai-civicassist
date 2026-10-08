import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JanSeva AI",
  description:
    "Find Andhra Pradesh government schemes and services, with document checklists and step-by-step guidance.",
  applicationName: "JanSeva AI",
  appleWebApp: { capable: true, title: "JanSeva AI", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1F3A8A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
