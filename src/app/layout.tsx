import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Zorvyn Finance",
  description: "Ultra-premium Finance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground relative overflow-hidden`} suppressHydrationWarning>
        
        {/* ─── LAYERED AURA BACKGROUND ─── */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          {/* Semantic base — adapts light/dark automatically */}
          <div className="absolute inset-0 bg-background" />
          {/* Indigo orb top-left — subtle in light, stronger in dark */}
          <div className="orb-pulse absolute -top-[25%] -left-[5%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
          {/* Cyan orb top-right */}
          <div className="orb-drift absolute -top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)]" style={{animationDelay: '3s'}} />
          {/* Violet orb bottom-right */}
          <div className="orb-pulse absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)]" style={{animationDelay: '6s'}} />
          {/* Dot grid — visible in dark, very subtle in light */}
          <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 relative z-10 scroll-smooth">
              {children}
            </main>
          </div>
        </div>

        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: { 
              background: 'oklch(0.12 0.006 85)', 
              border: '1px solid oklch(0.72 0.13 85 / 25%)',
              color: 'oklch(0.94 0.01 85)'
            }
          }}
        />
      </body>
    </html>
  );
}
