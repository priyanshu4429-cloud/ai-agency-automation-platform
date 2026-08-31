import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agency Automation V2 - Automate Your Agency",
  description: "Automatically find local businesses, generate AI-powered websites, and manage your sales pipeline.",
  openGraph: {
    title: "AI Agency Automation V2",
    description: "The future of agency automation is here.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
