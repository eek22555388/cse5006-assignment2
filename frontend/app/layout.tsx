import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./context/ThemeContext";
import { PostsProvider } from "./context/PostsContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSE5006 Assessment 1 — RSS Server Frontend",
  description: "Frontend for an RSS Server feeding into an LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              <ThemeProvider>
                <PostsProvider>
                  <Header />
                  <NavBar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </PostsProvider>
              </ThemeProvider>
            </body>
    </html>
  );
}
