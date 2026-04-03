"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"

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

  const insights = [
    {
      icon: "✦",
      label: "Monthly Analysis",
      value: monthlyInsightText,
    },
    {
      icon: "↑",
      label: "Largest Expense",
      value: `${largestTx.description} · $${largestTx.amount.toLocaleString()}`,
    },
    {
      icon: "⬡",
      label: "Top Category",
      value: `${highestCategory[0]} · $${Number(highestCategory[1]).toLocaleString()} total`,
    },
    {
      icon: "◈",
      label: "Frequent Spends",
      value: mostFrequentCategory !== "None" ? `${mostFrequentCategory} is your most recurring category` : "No recorded spends yet.",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {insights.map((item) => (
        <Card key={item.label} className="border-border">
          <div className="flex flex-col gap-3 p-5">
            {/* Icon */}
            <div className="flex items-center gap-3">
              <span className="text-primary text-xl font-bold leading-none">{item.icon}</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
            </div>
            {/* Thin separator */}
            <div className="brand-line" />
            {/* Value */}
            <p className="text-sm font-medium text-foreground/90 leading-snug">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
