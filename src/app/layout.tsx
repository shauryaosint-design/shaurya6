import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPGI ERP | Maharana Pratap Group of Institutions",
  description: "Next-generation scalable ERP for MPGI colleges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
