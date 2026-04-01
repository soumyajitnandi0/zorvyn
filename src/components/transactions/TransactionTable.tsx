"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionFormDialog } from "./TransactionFormDialog"
import { Trash2, Search, Download, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"
import { toast } from "sonner"

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

  const SortIcon = ({ field }: { field: "date" | "amount" }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-50 transition-colors hover:text-foreground hover:opacity-100" />
    return sortDir === "desc" ? <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-primary" /> : <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
  }

  return (
    <div className="space-y-6">
      {/* FILTER BAR (PILLS) */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center rounded-3xl bg-card/40 backdrop-blur-2xl p-2 pl-4 border ring-1 ring-black/5 dark:ring-white/5 border-black/5 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="flex flex-1 items-center gap-2 w-full xl:max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 w-full rounded-full bg-background/50 border-white/5 shadow-inner focus-visible:ring-1 focus-visible:ring-primary/40 transition-shadow text-base placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-[calc(100vw-40px)] xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-none items-center pr-2">
          {role === "Admin" && (
             <div className="mr-2 hidden xl:block">
                <TransactionFormDialog mode="add" />
             </div>
          )}

          <Select value={filterDateRange} onValueChange={(val) => setFilterDateRange(val || 'all')}>
            <SelectTrigger className="w-[140px] shrink-0 h-12 rounded-full bg-background/50 border-white/5 shadow-inner hover:bg-card/80 transition-colors">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/5 backdrop-blur-2xl bg-card/80">
              <SelectItem value="all" className="rounded-xl">All Time</SelectItem>
              <SelectItem value="this_month" className="rounded-xl">This Month</SelectItem>
              <SelectItem value="last_month" className="rounded-xl">Last Month</SelectItem>
              <SelectItem value="last_3_months" className="rounded-xl">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(val) => setFilterType(val || 'all')}>
            <SelectTrigger className="w-[120px] shrink-0 h-12 rounded-full bg-background/50 border-white/5 shadow-inner hover:bg-card/80 transition-colors">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/5 backdrop-blur-2xl bg-card/80">
              <SelectItem value="all" className="rounded-xl">All Types</SelectItem>
              <SelectItem value="income" className="rounded-xl">Income</SelectItem>
              <SelectItem value="expense" className="rounded-xl">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val || 'all')}>
            <SelectTrigger className="w-[140px] shrink-0 h-12 rounded-full bg-background/50 border-white/5 shadow-inner hover:bg-card/80 transition-colors border-none ring-1 ring-white/5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/5 backdrop-blur-2xl bg-card/80 p-2">
              <SelectItem value="all" className="rounded-xl cursor-pointer">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c} className="rounded-xl cursor-pointer">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="h-6 w-px bg-border/50 mx-1 hidden xl:block" />
          
          <Button variant="outline" className="h-12 shrink-0 rounded-full border-white/5 bg-background/50 hover:bg-card/80 shadow-inner px-5 transition-colors" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* FLOATING LIST ROWS */}
      <div className="flex flex-col gap-3">
        {/* Table Headers List Layout */}
        <div className="flex items-center justify-between px-8 py-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest sticky top-0 bg-background/60 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/5 shadow-sm z-10 w-full mb-2">
           <div className="w-[120px] cursor-pointer hover:text-primary flex items-center transition-colors select-none" onClick={() => handleSort("date")}>Date <SortIcon field="date" /></div>
           <div className="hidden sm:block flex-1 min-w-[150px]">Transaction</div>
           <div className="hidden md:block w-[140px] text-center">Category</div>
           <div className="hidden lg:block w-[100px] text-center">Type</div>
           <div className="flex-1 sm:w-[120px] sm:flex-none text-right cursor-pointer hover:text-primary flex items-center justify-end transition-colors select-none" onClick={() => handleSort("amount")}>Amount <SortIcon field="amount" /></div>
           {role === "Admin" && <div className="w-[80px] text-right hidden xl:block">Actions</div>}
        </div>
        
        {/* Floating Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 rounded-[3rem] bg-card/30 backdrop-blur-md border border-white/5 border-dashed">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-inner">
               <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground text-center max-w-sm">Adjust your filters or search query to find what you're looking for.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-8">
            {filtered.map((tx) => (
              <div 
                key={tx.id} 
                className="group relative flex items-center justify-between p-4 px-6 md:px-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:-translate-y-0.5 hover:bg-card/70 transition-all duration-400 ring-1 ring-black/5 dark:ring-white/5"
              >
                 <div className="w-[120px] text-sm text-foreground/80 font-medium font-mono tracking-tight shrink-0">{tx.date}</div>
                 
                 <div className="flex-1 flex items-center gap-4 min-w-[150px]">
                   <div className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full shadow-inner ring-1 ring-inset ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-500 ring-rose-500/20'}`}>
                     {tx.type === 'income' ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                   </div>
                   <span className="font-semibold text-foreground text-base truncate">{tx.description}</span>
                 </div>
                 
                 <div className="hidden md:flex w-[140px] items-center justify-center shrink-0">
                   <Badge variant="secondary" className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none rounded-full shadow-sm text-xs font-semibold tracking-wide">
                     {tx.category}
                   </Badge>
                 </div>
                 
                 <div className="hidden lg:flex w-[100px] items-center justify-center shrink-0">
                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30' : 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/30'}`}>
                     {tx.type}
                   </div>
                 </div>
                 
                 <div className={`w-[130px] sm:w-[120px] shrink-0 text-right text-lg sm:text-xl font-mono tracking-tighter font-bold ${tx.type === "income" ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}>
                   {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
