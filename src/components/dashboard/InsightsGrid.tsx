"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertCircle, ShoppingBag } from "lucide-react"

export function InsightsGrid() {
  const { transactions } = useAppStore()

  const expenses = transactions.filter(tx => tx.type === "expense")
  
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const lastMonthDate = new Date()
  lastMonthDate.setMonth(currentMonth - 1)
  const lastMonth = lastMonthDate.getMonth()
  const lastMonthYear = lastMonthDate.getFullYear()

  let thisMonthExpenses = 0
  let lastMonthExpenses = 0
  
  const categoryCounts: Record<string, number> = {}

  expenses.forEach(tx => {
    const txDate = new Date(tx.date)
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      thisMonthExpenses += tx.amount
    } else if (txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear) {
      lastMonthExpenses += tx.amount
    }
    
    categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1
  })

  // Highest category by amount
  const categoryTotals = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {} as Record<string, number>)
  
  const entries = Object.entries(categoryTotals)
  const highestCategory = entries.length ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ["None", 0]

  // Largest transaction
  const largestTx = expenses.length ? expenses.reduce((a, b) => a.amount > b.amount ? a : b) : { description: "None", amount: 0 }

  // Most frequent category
  const freqEntries = Object.entries(categoryCounts)
  const mostFrequentCategory = freqEntries.length 
    ? freqEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0] 
    : "None"

  // Insight text
  let monthlyInsightText = "Not enough data for a monthly comparison."
  if (lastMonthExpenses > 0) {
    const diff = thisMonthExpenses - lastMonthExpenses
    const percentage = Math.abs((diff / lastMonthExpenses) * 100).toFixed(0)
    if (diff > 0) {
      monthlyInsightText = `Expenses are ${percentage}% higher this month than last.`
    } else if (diff < 0) {
      monthlyInsightText = `Expenses are ${percentage}% lower this month than last.`
    } else {
      monthlyInsightText = `Expenses are exactly tracking last month.`
    }
  } else if (thisMonthExpenses > 0) {
    monthlyInsightText = `You spent $${thisMonthExpenses.toLocaleString()} this month.`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
      <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 shadow-sm">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="rounded-full bg-blue-500/20 p-2 text-blue-500">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-foreground/80">Smart Insight</p>
            <p className="text-xs text-muted-foreground font-medium">{monthlyInsightText}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 shadow-sm">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-foreground/80">Largest Expense</p>
            <p className="text-xs text-muted-foreground font-medium">{largestTx.description} (${largestTx.amount})</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20 shadow-sm">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="rounded-full bg-rose-500/20 p-2 text-rose-500">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-foreground/80">Top Category</p>
            <p className="text-xs text-muted-foreground font-medium">{highestCategory[0]} at ${Number(highestCategory[1]).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 shadow-sm">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="rounded-full bg-amber-500/20 p-2 text-amber-500">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-foreground/80">Frequent Spends</p>
            <p className="text-xs text-muted-foreground font-medium">{mostFrequentCategory !== "None" ? `${mostFrequentCategory} is your most frequent spend.` : 'No recorded spends.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
