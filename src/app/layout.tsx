import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatman Legal | Elite Legal Representation",
  description: "Chatman Legal is a premier full-service law firm with over 40 years of excellence. Our attorneys deliver exceptional outcomes in corporate law, litigation, criminal defense, and more.",
  keywords: "law firm, attorney, lawyer, legal services, corporate law, litigation, criminal defense, Chatman Legal",
  openGraph: {
    title: "Chatman Legal | Elite Legal Representation",
    description: "A premier full-service law firm committed to achieving exceptional outcomes for our clients.",
    url: "https://lawyerdemo.chatmaninc.com",
    siteName: "Chatman Legal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
