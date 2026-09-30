import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { VaultProvider } from "@/lib/vault-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PassVault — Secure Password Manager",
  description:
    "A secure, simple web application to store, find, generate, and manage login credentials for websites and apps in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased min-h-screen bg-midnight-950 text-slate-100 selection:bg-electric-600 selection:text-white">
        <VaultProvider>{children}</VaultProvider>
      </body>
    </html>
  );
}
