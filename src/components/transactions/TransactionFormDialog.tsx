"use client"

import { useState } from "react"
import { useAppStore, Transaction, TransactionType } from "@/lib/store"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Edit2 } from "lucide-react"
import { toast } from "sonner"

interface TransactionFormDialogProps {
  mode: "add" | "edit"
  initialData?: Transaction
  triggerClassName?: string
  hideTextOnMobile?: boolean
}

export function TransactionFormDialog({ mode, initialData, triggerClassName, hideTextOnMobile }: TransactionFormDialogProps) {
  const { addTransaction, editTransaction } = useAppStore()
  const [open, setOpen] = useState(false)

  const [description, setDescription] = useState(initialData?.description || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState(initialData?.category || "Other")
  const [type, setType] = useState<TransactionType>(initialData?.type || "expense")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !date || !category) return

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount)) return

    if (mode === "add") {
      addTransaction({
        description,
        amount: parsedAmount,
        date,
        category,
        type,
        status: "completed"
      })
      toast.success("Transaction added")
    } else if (mode === "edit" && initialData) {
      editTransaction(initialData.id, {
        description,
        amount: parsedAmount,
        date,
        category,
        type,
      })
      toast.success("Transaction updated")
    }

    setOpen(false)
    if (mode === "add") {
      setDescription("")
      setAmount("")
      setCategory("Other")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === "add" ? (
        <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "gap-2 shadow-sm", triggerClassName)}>
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span className={cn(hideTextOnMobile && "hidden sm:inline")}>Add Transaction</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-muted-foreground hover:text-foreground")}>
          <Edit2 className="h-4 w-4" />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add Transaction" : "Edit Transaction"}</DialogTitle>
            <DialogDescription>
              {mode === "add" ? "Enter the details for your new transaction." : "Update the details for this transaction."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Groceries"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(val) => setType(val as TransactionType)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Food"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{mode === "add" ? "Add" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
