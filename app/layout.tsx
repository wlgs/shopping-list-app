import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./lib/navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./lib/theme-provider";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Shopping app",
    description: "Shopping app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" enableSystem defaultTheme="system">
                    <Navbar />
                    <div className="mt-[58px]">{children}</div>
                    <Toaster richColors position="bottom-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}
