"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"

export function SummaryCards() {
  const { transactions } = useAppStore()

  const income = transactions
    .filter(tx => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0)

  const expenses = transactions
    .filter(tx => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0)

  const balance = income - expenses
  const savingsRate = income > 0 ? ((balance / income) * 100) : 0

  // Month-over-month calculations
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const lastMonthDate = new Date()
  lastMonthDate.setMonth(currentMonth - 1)
  const lastMonth = lastMonthDate.getMonth()
  const lastMonthYear = lastMonthDate.getFullYear()

  let thisMonthIncome = 0
  let thisMonthExpenses = 0
  let lastMonthIncome = 0
  let lastMonthExpenses = 0

  transactions.forEach(tx => {
    const txDate = new Date(tx.date)
    const txMonth = txDate.getMonth()
    const txYear = txDate.getFullYear()
    
    if (txMonth === currentMonth && txYear === currentYear) {
      if (tx.type === "income") thisMonthIncome += tx.amount
      else thisMonthExpenses += tx.amount
    } else if (txMonth === lastMonth && txYear === lastMonthYear) {
      if (tx.type === "income") lastMonthIncome += tx.amount
      else lastMonthExpenses += tx.amount
    }
  })

  const thisMonthBalance = thisMonthIncome - thisMonthExpenses
  const lastMonthBalance = lastMonthIncome - lastMonthExpenses

  const calcTrend = (current: number, previous: number) => {
    if (previous === 0 && current === 0) return { val: 0, text: "0.0%" }
    if (previous === 0) return { val: 100, text: "+100.0%" }
    const diff = current - previous
    const pct = (diff / Math.abs(previous)) * 100
    return { val: pct, text: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` }
  }

  const balanceTrend = calcTrend(thisMonthBalance, lastMonthBalance)
  const incomeTrend = calcTrend(thisMonthIncome, lastMonthIncome)
  const expenseTrend = calcTrend(thisMonthExpenses, lastMonthExpenses)
  
  const thisMonthSavings = thisMonthIncome > 0 ? (thisMonthBalance / thisMonthIncome) * 100 : 0
  const lastMonthSavings = lastMonthIncome > 0 ? (lastMonthBalance / lastMonthIncome) * 100 : 0
  const savingsTrendVal = thisMonthSavings - lastMonthSavings
  const savingsTrendText = `${savingsTrendVal > 0 ? "+" : ""}${savingsTrendVal.toFixed(1)}%`

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <div className="bg-primary/10 p-2 rounded-full">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center">
             {balanceTrend.val >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />}
            {balanceTrend.text} from last month
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <div className="bg-emerald-500/10 p-2 rounded-full">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center">
            {incomeTrend.val >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />}
            {incomeTrend.text} from last month
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="bg-rose-500/10 p-2 rounded-full">
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center">
             {expenseTrend.val < 0 ? <ArrowDownRight className="mr-1 h-3 w-3 text-emerald-500" /> : <ArrowUpRight className="mr-1 h-3 w-3 text-rose-500" />}
            {expenseTrend.text} from last month
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <div className="bg-blue-500/10 p-2 rounded-full">
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center text-muted-foreground">
             {savingsTrendVal >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />}
            {savingsTrendText} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
