"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function BalanceChart() {
  const { transactions } = useAppStore()
  
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
    <Card className="col-span-1 lg:col-span-3 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>Your balance over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                opacity={0.4}
                dy={15}
              />
              <YAxis 
                stroke="currentColor" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`}
                opacity={0.4}
                dx={-15}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: '#fff', fontWeight: 600 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`$${value}`, 'Balance']}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="oklch(0.6 0.2 260)" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                activeDot={{ r: 8, strokeWidth: 0, fill: "oklch(0.6 0.2 260)" }}
                style={{ filter: "drop-shadow(0px 10px 10px rgba(59,130,246,0.3))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
