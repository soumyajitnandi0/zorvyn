import { TransactionTable } from "@/components/transactions/TransactionTable"

export default function TransactionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View, search, filter, and manage all your transactions in one place.
        </p>
      </div>

      <TransactionTable />
    </div>
  )
}
