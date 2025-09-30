import type React from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  useSidebar?: boolean
}

export function DashboardLayout({ children, useSidebar = true }: DashboardLayoutProps) {
  if (!useSidebar) {
    return (
      <div className="min-h-screen bg-background">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
