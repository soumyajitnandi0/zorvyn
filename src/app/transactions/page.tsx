"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { ArrowDownRight, ArrowUpRight, ReceiptText } from "lucide-react"

function TransactionStats() {
  const { transactions, preferences } = useAppStore()
  const currency = preferences.currency

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const count = transactions.length

  const stats = [
    {
      label: "Total Transactions",
      value: count.toString(),
      sub: "All time recorded",
      icon: ReceiptText,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Total Inflow",
      value: formatCurrency(income, currency),
      sub: "Across all periods",
      icon: ArrowDownRight,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-500",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Outflow",
      value: formatCurrency(expenses, currency),
      sub: "Across all periods",
      icon: ArrowUpRight,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-500",
      valueColor: "text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative flex items-center gap-4 rounded-2xl bg-card border border-border backdrop-blur-xl px-5 py-4 card-brand-edge overflow-hidden shadow-sm"
        >
          {/* Subtle corner glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

          <div className={`flex shrink-0 items-center justify-center w-11 h-11 rounded-xl ${stat.iconBg} ring-1 ring-inset ring-white/10`}>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">{stat.label}</p>
            <p className={`text-xl font-bold font-mono tracking-tight truncate ${stat.valueColor ?? "text-foreground"}`}>{stat.value}</p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <div className="space-y-10">
      
      {/* ── HERO HEADER ── */}
      <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          Transaction Ledger
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
          All{" "}
          <span className="text-brand-gradient">Transactions</span>
        </h1>
        <div className="w-32 brand-line" />
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mt-1">
          A complete record of every financial movement. Filter, sort, and export your data with precision.
        </p>
      </div>

      {/* ── STATS BAR ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <TransactionStats />
      </div>

      {/* ── TABLE ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <TransactionTable />
      </div>

    </div>
  )
}
