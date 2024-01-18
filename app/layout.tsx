import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
//import './globals.css'
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "Inconnect",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
