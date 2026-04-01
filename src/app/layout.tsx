import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Zorvyn Finance",
  description: "Modern Premium Finance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground relative`} suppressHydrationWarning>
        {/* Glow ambient background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.25),rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="flex h-screen w-full overflow-hidden p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 lg:gap-6">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden relative rounded-[2rem] border border-black/5 dark:border-white/5 bg-background/50 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] ring-1 ring-white/10 dark:ring-white/5">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10 scroll-smooth">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
