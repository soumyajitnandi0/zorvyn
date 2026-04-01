"use client"

import * as React from "react"
import { useAppStore, Role } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function RoleSwitcher() {
  const { role, setRole } = useAppStore()

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="role-select" className="text-sm font-medium text-muted-foreground">
        Role
      </Label>
      <Select value={role} onValueChange={(val) => setRole(val as Role)}>
        <SelectTrigger id="role-select" className="w-[120px] h-8">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Viewer">Viewer</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
