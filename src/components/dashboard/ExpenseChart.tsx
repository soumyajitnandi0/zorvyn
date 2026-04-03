"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Premium, distinct category colors that pop on a dark background
const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#0ea5e9', // Sky
  '#a855f7', // Purple
  '#64748b', // Slate
]

export function ExpenseChart() {
  const { transactions, preferences } = useAppStore()
  const currency = preferences.currency

  const now = new Date()
  const expenses = transactions.filter(tx => {
    if (tx.type !== "expense") return false
    const txDate = new Date(tx.date)
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
  })
  
  const categoryTotals = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Spending Breakdown</p>
        <CardTitle className="text-xl font-bold">This Month</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            No expense data this month.
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="46%"
                  innerRadius={68}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.9} />
                  ))}
                </Pie>
                {/* Center total label */}
                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--foreground)', fontSize: '20px', fontWeight: 700 }}>
                  {formatCurrency(total, currency)}
                </text>
                <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--muted-foreground)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  TOTAL
                </text>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(Number(value), currency), 'Amount']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                    fontSize: '13px'
                  }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ fontWeight: 500, color: 'var(--muted-foreground)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)', paddingTop: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
