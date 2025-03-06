import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mancala Website | Mancala by Nir Hirschel",
  description: "A 12th Grade project for the Mancala game.",
  icons: {
    icon: { url: "/images/favicon.ico" }  // Absolute path starting with /
  }
}

// Import the Geist Sans and Geist Mono fonts from Google Fonts.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// Define the RootLayout component. This component is used to wrap the entire application.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}