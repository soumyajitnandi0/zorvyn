import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { BalanceChart } from "@/components/dashboard/BalanceChart"
import { ExpenseChart } from "@/components/dashboard/ExpenseChart"
import { InsightsGrid } from "@/components/dashboard/InsightsGrid"

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Your financial summary and insights at a glance.
        </p>
      </div>

      <SummaryCards />
      
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <BalanceChart />
        <ExpenseChart />
      </div>

      <InsightsGrid />
    </div>
  )
}
