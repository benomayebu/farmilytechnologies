import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IOSTapFix from "@/components/IOSTapFix";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const siteUrl = "https://farmilytechnologies.com";
const title = "FARMILY — Supply Chain Compliance, Automated";
const description =
  "IoT monitoring, AI exception detection, and audit-ready records — built for food distributors and importers, not enterprise budgets.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "FARMILY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body antialiased">
        <IOSTapFix />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
