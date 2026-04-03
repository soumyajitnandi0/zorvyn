"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Eye,
} from "lucide-react"
import { toast } from "sonner"

function SortIcon({ field, sortField, sortDir }: { field: "date" | "amount"; sortField: "date" | "amount"; sortDir: "asc" | "desc" }) {
  if (sortField !== field)
    return (
      <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/40 transition-colors group-hover:opacity-100" />
    )
  return sortDir === "desc" ? (
    <ArrowDown className="ml-1.5 h-3 w-3 text-primary" />
  ) : (
    <ArrowUp className="ml-1.5 h-3 w-3 text-primary" />
  )
}

export function RecentTransactions() {
  const { transactions, role, deleteTransaction } = useAppStore()

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).sort(),
    [transactions]
  )

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase())
        const matchesType = filterType === "all" || t.type === filterType
        const matchesCategory =
          filterCategory === "all" || t.category === filterCategory
        return matchesSearch && matchesType && matchesCategory
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
          return sortDir === "asc" ? -diff : diff
        } else {
          const diff = b.amount - a.amount
          return sortDir === "asc" ? -diff : diff
        }
      })
      .slice(0, 8)
  }, [transactions, search, filterType, filterCategory, sortField, sortDir])


  return (
    <div className="flex flex-col gap-4">
      {/* ── HEADER ROW ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ${
              role === "Admin"
                ? "bg-primary/10 text-primary ring-primary/25"
                : "bg-muted text-muted-foreground ring-border"
            }`}
          >
            {role === "Admin" ? (
              <ShieldAlert className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
            {role}
          </div>
          <span className="text-[11px] text-muted-foreground/60">
            {role === "Admin"
              ? "You can add, edit & delete transactions"
              : "Read-only view — switch to Admin to manage"}
          </span>
        </div>

        <Link href="/transactions">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5 rounded-xl"
          >
            View all {transactions.length} transactions
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-card border border-border/80 p-3 shadow-sm relative overflow-hidden">
        {/* Top: Search + Add */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/40 border-transparent hover:border-border focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-none text-sm"
            />
          </div>
          {role === "Admin" && (
            <TransactionFormDialog
              mode="add"
              triggerClassName="h-11 px-5 rounded-xl shrink-0 shadow-sm text-sm"
            />
          )}
        </div>

        {/* Bottom: Filter dropdowns */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v || "all")}
          >
            <SelectTrigger className="w-auto min-w-[110px] shrink-0 h-9 rounded-lg bg-background border-border/60 hover:bg-muted transition-colors text-xs font-semibold tracking-wide">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-2xl">
              <SelectItem value="all" className="rounded-xl">
                All Types
              </SelectItem>
              <SelectItem value="income" className="rounded-xl">
                Income
              </SelectItem>
              <SelectItem value="expense" className="rounded-xl">
                Expense
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterCategory}
            onValueChange={(v) => setFilterCategory(v || "all")}
          >
            <SelectTrigger className="w-auto min-w-[130px] shrink-0 h-9 rounded-lg bg-background border-border/60 hover:bg-muted transition-colors text-xs font-semibold tracking-wide">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-2xl p-1">
              <SelectItem value="all" className="rounded-xl">
                All Categories
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="rounded-xl">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-4 w-px bg-border/60 shrink-0 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            className={`h-9 rounded-lg px-3 text-xs font-semibold gap-1 transition-colors ${sortField === "date" ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => handleSort("date")}
          >
            Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 rounded-lg px-3 text-xs font-semibold gap-1 transition-colors ${sortField === "amount" ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => handleSort("amount")}
          >
            Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} />
          </Button>
        </div>
      </div>

      {/* ── STICKY COLUMN HEADER ── */}
      <div className="hidden sm:flex items-center justify-between px-6 py-2.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] sticky top-[-1px] bg-card/80 dark:bg-[#0A0B14]/90 backdrop-blur-2xl rounded-xl border border-border/50 shadow-sm z-30 w-full">
        <div
          className="w-[110px] cursor-pointer hover:text-primary flex items-center transition-colors select-none"
          onClick={() => handleSort("date")}
        >
          Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
        </div>
        <div className="flex-1 min-w-[150px]">Transaction</div>
        <div className="hidden md:block w-[130px] text-center">Category</div>
        <div className="hidden lg:block w-[90px] text-center">Type</div>
        <div
          className="w-[110px] text-right cursor-pointer hover:text-primary flex items-center justify-end transition-colors select-none"
          onClick={() => handleSort("amount")}
        >
          Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} />
        </div>
        {role === "Admin" && (
          <div className="w-[72px] text-right hidden xl:block">Actions</div>
        )}
      </div>

      {/* ── TRANSACTION ROWS ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-muted/20 border border-dashed border-border">
          <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            No transactions match your filters
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="group relative flex items-center justify-between p-4 px-5 sm:px-6 rounded-2xl bg-card border border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              {/* Date */}
              <div className="hidden sm:block w-[110px] text-xs text-foreground/70 font-medium font-mono tracking-tight shrink-0">
                {tx.date}
              </div>

              {/* Transaction info */}
              <div className="flex-1 flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-full ring-1 ring-inset ${
                    tx.type === "income"
                      ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/25"
                      : "bg-rose-500/8 text-rose-500 ring-rose-500/20"
                  }`}
                >
                  {tx.type === "income" ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {tx.description}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono mt-0.5 sm:hidden">
                    {tx.date}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="hidden md:flex w-[130px] items-center justify-center shrink-0">
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 bg-primary/8 text-primary border-primary/20 text-[10px] font-semibold tracking-widest uppercase rounded-full"
                >
                  {tx.category}
                </Badge>
              </div>

              {/* Type */}
              <div className="hidden lg:flex w-[90px] items-center justify-center shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.1em] font-bold ${
                    tx.type === "income"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/25"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20"
                  }`}
                >
                  {tx.type}
                </span>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-end justify-center shrink-0 ml-2 w-[110px]">
                <span
                  className={`text-base font-mono font-bold tracking-tighter ${
                    tx.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}$
                  {tx.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Admin actions */}
              {role === "Admin" && (
                <div className="w-[72px] justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200 hidden xl:flex shrink-0 ml-3">
                  <TransactionFormDialog mode="edit" initialData={tx} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-full transition-colors"
                    onClick={() => {
                      deleteTransaction(tx.id)
                      toast.success("Transaction deleted")
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW ALL FOOTER ── */}
      <Link href="/transactions" className="w-full">
        <Button
          variant="outline"
          className="w-full rounded-2xl border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-300 gap-2 text-sm font-semibold py-6"
        >
          View all {transactions.length} transactions
          <ExternalLink className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
