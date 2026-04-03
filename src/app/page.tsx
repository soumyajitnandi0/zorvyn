"use client"

import { useAppStore } from "@/lib/store"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { BalanceChart } from "@/components/dashboard/BalanceChart"
import { ExpenseChart } from "@/components/dashboard/ExpenseChart"
import { InsightsGrid } from "@/components/dashboard/InsightsGrid"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"

function HeroBalance() {
  const { transactions } = useAppStore()

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const balance = income - expenses
  const isPositive = balance >= 0

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(Math.abs(balance))

  return (
    <div className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section label */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-4">
        Portfolio Overview
      </p>

      {/* Hero balance number */}
      <div className="flex items-end gap-3">
        <span className="text-sm font-medium text-muted-foreground self-start mt-3 font-mono">{isPositive ? "+" : "−"}</span>
        <h1 className="text-brand-gradient text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
          {formatted}
        </h1>
      </div>

      {/* Indigo underline */}
      <div className="mt-5 w-48 brand-line" />

      <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
        Your consolidated net position across all recorded transactions.
      </p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-12">

      {/* ── HERO BALANCE ── */}
      <HeroBalance />

      {/* ── SUMMARY CARDS ── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-5">By The Numbers</p>
        <SummaryCards />
      </section>

      {/* ── ANALYTICS CHARTS ── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-5">Analytics</p>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
          <BalanceChart />
          <ExpenseChart />
        </div>
      </section>

      {/* ── INSIGHTS ── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-5">Insights</p>
        <InsightsGrid />
      </section>

      {/* ── RECENT TRANSACTIONS (List + Filter + Sort + Search + Role-Based) ── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[400ms] fill-mode-both pb-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">Recent Transactions</p>
          <p className="text-xs text-muted-foreground/60">Showing up to 8 most recent · search, filter &amp; sort below</p>
        </div>
        <RecentTransactions />
      </section>

    </div>
  )
}
