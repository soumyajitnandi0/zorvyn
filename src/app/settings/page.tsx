"use client"

import { useState } from "react"
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User, ShieldCheck,
  Check, Moon, Sun, Monitor, Smartphone, Settings,
  Landmark, CreditCard, Cpu, Fingerprint, Plus, ExternalLink, Building2,
  Wallet
} from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// ─── Toggle Switch ─────────────────────────────────────────────────
function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-primary" : "bg-white/10"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  )
}

// ─── Settings Row ───────────────────────────────────────────────────
function SettingRow({
  label, description, children, border = true
}: {
  label: string
  description?: string
  children: React.ReactNode
  border?: boolean
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5", border && "border-b border-border/50")}>
      <div className="flex-1 min-w-0 sm:pr-8">
        <p className="text-[14px] font-bold text-foreground tracking-tight">{label}</p>
        {description && <p className="text-sm text-muted-foreground mt-1 leading-snug">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

// ─── Section Card ───────────────────────────────────────────────────
function SettingsCard({ title, icon: Icon, children, badge }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  badge?: React.ReactNode
}) {
  return (
    <div className="rounded-[24px] bg-card border border-border/80 overflow-hidden shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-xl bg-primary/10">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        {badge && <div>{badge}</div>}
      </div>
      <div className="px-4 sm:px-6">{children}</div>
    </div>
  )
}

// ─── Responsive Tab List ────────────────────────────────────────────
const tabs = [
  { value: "profile",     label: "Profile & KYC",   icon: User },
  { value: "banks",       label: "Linked Banks",    icon: Landmark },
  { value: "billing",     label: "Billing & Plans", icon: CreditCard },
  { value: "api",         label: "API & Webhooks",  icon: Cpu },
  { value: "preferences", label: "Preferences",     icon: Settings },
  { value: "security",    label: "Security",        icon: ShieldCheck },
]

function SettingsTabsList() {
  const [isDesktop, setIsDesktop] = useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <TabsList
      style={{ flexDirection: isDesktop ? "column" : "row", height: "auto", width: isDesktop ? "200px" : "100%" }}
      className="bg-card/60 border border-border/50 p-1 shrink-0 gap-0.5 rounded-2xl overflow-x-auto scrollbar-none"
    >
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          style={{ height: "auto", width: isDesktop ? "100%" : "auto", justifyContent: isDesktop ? "flex-start" : "center" }}
          className="flex flex-1 md:flex-none gap-2.5 px-3 py-2.5 rounded-xl data-active:bg-background data-active:text-primary data-active:shadow-sm text-muted-foreground transition-all hover:bg-muted/50 border border-transparent data-active:border-border/60"
        >
          <tab.icon className="h-4 w-4 shrink-0" />
          {isDesktop && <span className="text-sm font-bold tracking-tight">{tab.label}</span>}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export default function SettingsPage() {
  const {
    theme, setTheme,
    profile, setProfile,
    security, setSecurity,
    preferences, setPreferences,
  } = useAppStore()

  // Apply theme to DOM
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (theme === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(sys)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Local profile form state (committed on Save)
  const [entityName, setEntityName] = useState(profile.entityName)
  const [address, setAddress] = useState(profile.registeredAddress)

  // API key reveal state
  const [revealProd, setRevealProd] = useState(false)
  const [revealTest, setRevealTest] = useState(false)

  const handleSaveProfile = () => {
    setProfile({ entityName, registeredAddress: address })
    toast.success("Profile saved")
  }

  const themeOptions = [
    { id: "dark" as const,   label: "Dark",   icon: Moon },
    { id: "light" as const,  label: "Light",  icon: Sun },
    { id: "system" as const, label: "System", icon: Monitor },
  ]

  return (
    <div className="animate-in fade-in duration-700 pb-20 w-full space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter">
            Platform Configuration
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-xs sm:text-sm max-w-xl pl-[44px] sm:pl-[52px]">
          Manage organizational profile, bank integrations, API keys, and compliance.
        </p>
      </div>

      {/* ── TABS / SIDEBAR ── */}
      <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-10 w-full items-start">
        <SettingsTabsList />

        {/* ── TAB CONTENT AREA ── */}
        <div className="flex-1 w-full min-w-0 overflow-hidden">
        
        {/* ── PROFILE & KYC ── */}
        <TabsContent value="profile" className="space-y-6 mt-0">
          <SettingsCard 
            title="Entity Profile" 
            icon={Building2}
            badge={
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest ring-1 ring-emerald-500/30">
                <Check className="h-3 w-3" /> KYC Verified
              </span>
            }
          >
            <div className="py-2 space-y-5">
              <div className="flex items-center gap-4 py-4">
                <div className="relative shrink-0">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-primary/20 bg-muted flex flex-col justify-center items-center">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-50" />
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold truncate">Zorvyn Global LLC</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Entity ID: ZVG-8829-XJ2</p>
                  <Button variant="outline" size="sm" className="mt-2 h-8 rounded-xl text-xs font-semibold">
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Legal Entity Name</Label>
                  <Input value={entityName} onChange={e => setEntityName(e.target.value)} className="h-12 bg-muted/30 border-transparent hover:border-border/60 focus-visible:bg-background rounded-xl px-4 text-base shadow-none transition-all" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Tax ID / EIN</Label>
                  <Input type="password" defaultValue="123456789" className="h-12 bg-muted/30 border-transparent hover:border-border/60 rounded-xl px-4 text-base tracking-widest" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Registered Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} className="h-12 bg-muted/30 border-transparent hover:border-border/60 focus-visible:bg-background rounded-xl px-4 text-base shadow-none" />
              </div>
              <div className="pt-4 pb-2 flex justify-stretch sm:justify-end">
                <Button onClick={handleSaveProfile} className="w-full sm:w-auto h-12 rounded-xl px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                  <Check className="h-5 w-5" /> Save Changes
                </Button>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title="Authorized Representative" icon={User}>
            <div className="py-4 space-y-5">
              <SettingRow label="Primary Administrator" border={false} description="The individual legally responsible for managing this account.">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-sm">Soumyajit Nandi</p>
                    <p className="text-xs text-muted-foreground">soumyajit@zorvyn.io</p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                </div>
              </SettingRow>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* ── LINKED BANKS ── */}
        <TabsContent value="banks" className="space-y-6 mt-0">
          <SettingsCard title="Institution Connections" icon={Landmark}>
            <div className="py-2">
              {[
                { name: "J.P. Morgan Chase", type: "Corporate Checking", account: "•••• 4281", balance: "$452,100.00", status: "Active", refreshed: "Just now" },
                { name: "Silicon Valley Bank", type: "Venture Debt", account: "•••• 9932", balance: "-$125,000.00", status: "Active", refreshed: "2 hrs ago" },
                { name: "Coinbase Prime", type: "Custody Wallet", account: "ETH Reserve", balance: "$85,340.00", status: "Warning", refreshed: "Action Required" },
              ].map((bank, i) => (
                <div key={bank.name} className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5", i < 2 && "border-b border-border/50")}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-[16px] bg-muted flex items-center justify-center border border-border/80">
                      {i === 2 ? <Wallet className="h-6 w-6 text-foreground/70" /> : <Landmark className="h-6 w-6 text-foreground/70" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-bold tracking-tight">{bank.name}</p>
                        {bank.status === "Warning" ? (
                           <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        ) : (
                           <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{bank.type} · {bank.account}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-mono font-bold">{bank.balance}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{bank.refreshed}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/10 p-4 border-t border-border/50 mt-2 flex justify-between items-center -mx-4 sm:-mx-6 -mb-5 px-4 sm:px-6 pb-5 rounded-b-[24px]">
              <p className="text-xs text-muted-foreground font-medium">Secured by Plaid Enterprise</p>
              <Button size="sm" className="rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 gap-2">
                <Plus className="h-4 w-4" /> Link Institution
              </Button>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* ── BILLING & PLANS ── */}
        <TabsContent value="billing" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[24px] bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Building2 className="h-32 w-32" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Current Plan</p>
              <h2 className="text-3xl font-black mb-1">Zorvyn Corporate</h2>
              <p className="text-sm text-foreground/70 mb-6">Unlimited transations, API access & Custom ledgering.</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold tracking-tighter">$499</span>
                <span className="text-muted-foreground pb-1">/ month</span>
              </div>
              <Button className="w-full rounded-xl font-bold h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                Upgrade to Enterprise
              </Button>
            </div>

            <SettingsCard title="Payment Method" icon={CreditCard}>
              <div className="py-4 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="w-12 h-8 bg-foreground rounded flex items-center justify-center text-background text-xs font-black italic">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm tracking-tight">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/28</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl text-sm font-semibold h-10 border-border hover:bg-muted">
                  Update Payment Method
                </Button>
              </div>
            </SettingsCard>
          </div>
        </TabsContent>

        {/* ── API & WEBHOOKS ── */}
        <TabsContent value="api" className="space-y-6 mt-0">
          <SettingsCard title="Developer API Keys" icon={Cpu}>
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-6">Use these keys to authenticate API requests from your backend applications to Zorvyn&apos;s ledger.</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">Production Key</p>
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[9px] uppercase tracking-widest font-bold">Live</span>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground">
                      {revealProd ? "zk_live_9283abcdef1234567890" : "zk_live_9283********************"}
                    </code>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl text-xs h-9" onClick={() => { toast.success("Production key rolled") }}>Roll Key</Button>
                    <Button size="sm" className="flex-1 sm:flex-none rounded-xl text-xs font-bold h-9 bg-foreground text-background" onClick={() => setRevealProd(v => !v)}>
                      {revealProd ? "Hide" : "Reveal"}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">Test Key</p>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-widest font-bold">Sandbox</span>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground">
                      {revealTest ? "zk_test_4110abcdef1234567890" : "zk_test_4110********************"}
                    </code>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl text-xs h-9" onClick={() => { toast.success("Test key rolled") }}>Roll Key</Button>
                    <Button size="sm" className="flex-1 sm:flex-none rounded-xl text-xs font-bold h-9 bg-foreground text-background" onClick={() => setRevealTest(v => !v)}>
                      {revealTest ? "Hide" : "Reveal"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <Button variant="link" className="px-0 text-primary gap-1">
                  View API Documentation <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* ── PREFERENCES ── */}
        <TabsContent value="preferences" className="space-y-6 mt-0">
          <SettingsCard title="Theme & Display" icon={Monitor}>
            <div className="py-4 space-y-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-4">Color Palette</p>
                <div className="grid grid-cols-3 gap-4">
                  {themeOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 relative group",
                        theme === id
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/50 bg-background/50 text-muted-foreground hover:bg-muted/50 hover:border-border hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-8 w-8 transition-transform group-hover:scale-110", theme === id && "scale-110")} />
                      <span className="text-sm font-bold">{label}</span>
                      {theme === id && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title="Operating Configuration" icon={Settings}>
            <div className="py-2">
              <SettingRow label="Base Currency" description="Default tracking currency for cumulative analytics">
                <Select value={preferences.currency} onValueChange={(v) => v && setPreferences({ currency: v })}>
                  <SelectTrigger className="w-[140px] rounded-xl bg-muted/40 border-transparent hover:border-border font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-xl">
                    <SelectItem value="USD" className="rounded-xl">USD ($)</SelectItem>
                    <SelectItem value="EUR" className="rounded-xl">EUR (€)</SelectItem>
                    <SelectItem value="GBP" className="rounded-xl">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Fiscal Year Start" description="Used for YTD tax calculation and summaries" border={false}>
                <Select value={preferences.fiscalYearStart} onValueChange={(v) => v && setPreferences({ fiscalYearStart: v })}>
                  <SelectTrigger className="w-[140px] rounded-xl bg-muted/40 border-transparent hover:border-border font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-xl">
                    <SelectItem value="jan" className="rounded-xl">January 1</SelectItem>
                    <SelectItem value="apr" className="rounded-xl">April 1</SelectItem>
                    <SelectItem value="jul" className="rounded-xl">July 1</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* ── SECURITY ── */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <SettingsCard title="Compliance & Access" icon={ShieldCheck}>
            <div className="py-2">
              <SettingRow label="Require 2FA for Transfers" description="Prompt for authenticator code on transactions over $10,000">
                <Toggle checked={security.twoFactor} onToggle={() => { setSecurity({ twoFactor: !security.twoFactor }); toast(security.twoFactor ? "2FA disabled" : "2FA enabled") }} />
              </SettingRow>
              <SettingRow label="Biometric Recovery" description="Allow FaceID/TouchID strictly for password resets">
                 <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2" onClick={() => toast.success("Biometric setup initiated")}>
                   <Fingerprint className="h-4 w-4" /> Setup
                 </Button>
              </SettingRow>
              <SettingRow label="Audit Log Access" description="Allow external auditors to view read-only logs" border={false}>
                <Toggle checked={security.auditLogAccess} onToggle={() => { setSecurity({ auditLogAccess: !security.auditLogAccess }); toast(security.auditLogAccess ? "Audit access revoked" : "Auditor invites require Enterprise Plan") }} />
              </SettingRow>
            </div>
          </SettingsCard>

          <SettingsCard title="Active Sessions" icon={Smartphone}>
            {[
              { device: "Chrome on macOS", location: "New York, USA", time: "Current session", active: true },
              { device: "Zorvyn iOS App", location: "New York, USA", time: "2 hours ago", active: false },
            ].map((session, i) => (
              <div key={i} className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5", i < 1 && "border-b border-border/50")}>
                <div className="flex items-center gap-4">
                  <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", session.active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/40")} />
                  <div>
                    <p className="text-[14px] font-bold tracking-tight">{session.device}</p>
                    <p className="text-[12px] font-mono text-muted-foreground mt-0.5">{session.location} · {session.time}</p>
                  </div>
                </div>
                {!session.active ? (
                  <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl text-xs font-bold w-full sm:w-auto mt-2 sm:mt-0">
                    Terminate
                  </Button>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20 w-fit">
                    Active
                  </span>
                )}
              </div>
            ))}
          </SettingsCard>
        </TabsContent>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 rounded-[24px] bg-card border border-border/80 text-xs font-semibold text-muted-foreground shadow-sm mt-8 gap-4 text-center sm:text-left">
          <span>Zorvyn FinTech · Enterprise Node v14.0.2</span>
          <span className="flex items-center justify-center gap-1.5 text-foreground/70">
            SOC2 Type II Certified
          </span>
        </div>

        </div>
      </Tabs>
    </div>
  )
}
