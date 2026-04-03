"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function BalanceChart() {
  const { transactions, preferences } = useAppStore()
  const currency = preferences.currency
  
  const data = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
    
    const upToMonthTransactions = transactions.filter(tx => new Date(tx.date) <= endOfMonth)
    
    const income = upToMonthTransactions
      .filter(tx => tx.type === "income")
      .reduce((acc, tx) => acc + tx.amount, 0)
      
    const expenses = upToMonthTransactions
      .filter(tx => tx.type === "expense")
      .reduce((acc, tx) => acc + tx.amount, 0)
      
    data.push({
      name: monthNames[d.getMonth()],
      balance: income - expenses
    })
  }

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Balance Trend</p>
        <CardTitle className="text-xl font-bold">7-Month History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                opacity={0.35}
                dy={12}
                fontWeight={500}
                letterSpacing="0.05em"
              />
              <YAxis
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, currency)}
                opacity={0.35}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(99,102,241,0.2)',
                  backgroundColor: 'var(--background)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: 'rgba(99,102,241,0.8)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}
                itemStyle={{ color: '#818CF8', fontWeight: 700, fontSize: '16px' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatCurrency(Number(value), currency), '']}
                cursor={{ stroke: 'rgba(99,102,241,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBalance)"
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#6366F1', fill: 'var(--card)' }}
                style={{ filter: "drop-shadow(0px 4px 12px rgba(99,102,241,0.3))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
