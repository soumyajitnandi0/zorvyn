"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionFormDialog } from "./TransactionFormDialog"
import { Trash2, Search, Download, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"
import { toast } from "sonner"

function SortIcon({ field, sortField, sortDir }: { field: "date" | "amount"; sortField: "date" | "amount"; sortDir: "asc" | "desc" }) {
  if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-50 transition-colors hover:text-foreground hover:opacity-100" />
  return sortDir === "desc" ? <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-primary" /> : <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
}

export function TransactionTable() {
  const { transactions, role, deleteTransaction } = useAppStore()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  
  const categories = Array.from(new Set(transactions.map(t => t.category)))
  
  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const csvContent = [
      headers.join(","),
      ...filtered.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        `"${t.category}"`,
        t.type,
        t.amount
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Exported to CSV")
  }

  const now = new Date()
  
  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    const matchesCategory = filterCategory === "all" || t.category === filterCategory
    
    let matchesDate = true
    if (filterDateRange !== "all") {
      const txDate = new Date(t.date)
      if (filterDateRange === "this_month") {
        matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
      } else if (filterDateRange === "last_month") {
        const lastMonth = new Date(now)
        lastMonth.setMonth(now.getMonth() - 1)
        matchesDate = txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear()
      } else if (filterDateRange === "last_3_months") {
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 2)
        threeMonthsAgo.setDate(1)
        matchesDate = txDate >= threeMonthsAgo
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate
  }).sort((a, b) => {
    if (sortField === "date") {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortDir === "asc" ? -diff : diff
    } else {
      const diff = b.amount - a.amount
      return sortDir === "asc" ? -diff : diff
    }
  })


  return (
    <div className="space-y-6">
      {/* FILTER BAR (PREMIUM) */}
      <div className="flex flex-col gap-3 rounded-[24px] bg-card border border-border/80 p-3 shadow-sm relative overflow-hidden">
        
        {/* Top Row: Search and Add Transaction */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 sm:h-14 w-full rounded-2xl sm:rounded-[20px] bg-muted/40 border-transparent hover:border-border focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/60 shadow-none"
            />
          </div>
          {role === "Admin" && (
            <TransactionFormDialog 
              mode="add" 
              triggerClassName="h-12 w-12 sm:h-14 sm:w-auto px-0 sm:px-6 rounded-2xl sm:rounded-[20px] shrink-0 shadow-sm" 
              hideTextOnMobile 
            />
          )}
        </div>
        
        {/* Bottom Row: Horizontally Scrollable Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x snap-x snap-mandatory">
          <Select value={filterDateRange} onValueChange={(val) => setFilterDateRange(val || 'all')}>
            <SelectTrigger className="w-auto min-w-[130px] shrink-0 h-10 rounded-xl bg-background border-border/60 hover:bg-muted transition-colors snap-start text-xs font-semibold tracking-wide">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-2xl">
              <SelectItem value="all" className="rounded-xl">All Time</SelectItem>
              <SelectItem value="this_month" className="rounded-xl">This Month</SelectItem>
              <SelectItem value="last_month" className="rounded-xl">Last Month</SelectItem>
              <SelectItem value="last_3_months" className="rounded-xl">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={(val) => setFilterType(val || 'all')}>
            <SelectTrigger className="w-auto min-w-[120px] shrink-0 h-10 rounded-xl bg-background border-border/60 hover:bg-muted transition-colors snap-start text-xs font-semibold tracking-wide">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-2xl">
              <SelectItem value="all" className="rounded-xl">All Types</SelectItem>
              <SelectItem value="income" className="rounded-xl">Income</SelectItem>
              <SelectItem value="expense" className="rounded-xl">Expense</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val || 'all')}>
            <SelectTrigger className="w-auto min-w-[140px] shrink-0 h-10 rounded-xl bg-background border-border/60 hover:bg-muted transition-colors snap-start text-xs font-semibold tracking-wide">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-2xl p-2">
              <SelectItem value="all" className="rounded-xl cursor-pointer">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c} className="rounded-xl cursor-pointer">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="h-5 w-px bg-border/80 shrink-0 mx-1 snap-start" />
          
          <Button variant="ghost" className="h-10 shrink-0 rounded-xl hover:bg-muted px-4 transition-colors snap-start text-xs font-semibold tracking-wide" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4 text-muted-foreground" /> Export Data
          </Button>
        </div>
      </div>

      {/* FLOATING LIST ROWS */}
      <div className="flex flex-col gap-3">
        {/* Sticky column header */}
        <div className="hidden sm:flex items-center justify-between px-8 py-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] sticky top-[-1px] bg-card/80 dark:bg-[#0A0B14]/90 backdrop-blur-2xl rounded-xl border border-border/50 shadow-md z-30 w-full mb-1 group-hover:border-primary/20 transition-all duration-300">
           <div className="w-[120px] cursor-pointer hover:text-primary flex items-center transition-colors select-none" onClick={() => handleSort("date")}>Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} /></div>
           <div className="hidden sm:block flex-1 min-w-[150px]">Transaction</div>
           <div className="hidden md:block w-[140px] text-center">Category</div>
           <div className="hidden lg:block w-[100px] text-center">Type</div>
           <div className="flex-1 sm:w-[120px] sm:flex-none text-right cursor-pointer hover:text-primary flex items-center justify-end transition-colors select-none" onClick={() => handleSort("amount")}>Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} /></div>
           {role === "Admin" && <div className="w-[80px] text-right hidden xl:block">Actions</div>}
        </div>
        
        {/* Floating Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 rounded-2xl bg-muted/30 border border-dashed border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 ring-1 ring-primary/20">
               <Search className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground text-center text-sm max-w-sm">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-8">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="group relative flex items-center justify-between p-4 px-6 md:px-8 rounded-2xl bg-card border border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                 {/* Date Column (Desktop) */}
                 <div className="hidden sm:block w-[120px] text-sm text-foreground/80 font-medium font-mono tracking-tight shrink-0">{tx.date}</div>
                 
                 {/* Transaction Info (Description + Mobile Date) */}
                 <div className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                   <div className={`flex shrink-0 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-inner ring-1 ring-inset ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/25' : 'bg-rose-500/8 text-rose-500 ring-rose-500/20'}`}>
                     {tx.type === 'income' ? <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />}
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="font-semibold text-foreground text-sm sm:text-base truncate">{tx.description}</span>
                     <span className="text-[11px] text-muted-foreground font-mono mt-0.5 sm:hidden">{tx.date}</span>
                   </div>
                 </div>
                 
                 <div className="hidden md:flex w-[140px] items-center justify-center shrink-0">
                   <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-semibold tracking-widest uppercase">
                     {tx.category}
                   </span>
                 </div>
                 
                 <div className="hidden lg:flex w-[100px] items-center justify-center shrink-0">
                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.12em] font-bold ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/25' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20'}`}>
                     {tx.type}
                   </div>
                 </div>
                 
                 {/* Amount Column */}
                 <div className="flex flex-col items-end justify-center shrink-0 ml-2">
                   <div className={`text-base sm:text-xl font-mono tracking-tighter font-bold ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                     {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                 </div>
                 
                 {role === "Admin" && (
                   <div className="w-[80px] justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 hidden xl:flex shrink-0 ml-4">
                      <TransactionFormDialog mode="edit" initialData={tx} />
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-full transition-colors" onClick={() => { deleteTransaction(tx.id); toast.success("Transaction deleted") }}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                   </div>
                 )}
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
