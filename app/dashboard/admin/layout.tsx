'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield,
  Building2,
  FileCheck,
  AlertTriangle,
  MessageSquare,
  ClipboardList,
  Users,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const adminNavItems = [
  {
    name: 'Overview',
    href: '/dashboard/admin/overview',
    icon: BarChart3,
    description: 'Network-wide analytics',
  },
  {
    name: 'Affiliates',
    href: '/dashboard/admin/affiliates',
    icon: Building2,
    description: 'Organizations',
  },
  {
    name: 'Compliance',
    href: '/dashboard/admin/compliance',
    icon: FileCheck,
    description: 'Document management',
  },
  {
    name: 'Incidents',
    href: '/dashboard/admin/incidents',
    icon: AlertTriangle,
    description: 'Safety reports',
  },
  {
    name: 'Communications',
    href: '/dashboard/admin/communications',
    icon: MessageSquare,
    description: 'Broadcasts',
  },
  {
    name: 'Audit Logs',
    href: '/dashboard/admin/audit-logs',
    icon: ClipboardList,
    description: 'Activity tracking',
  },
  {
    name: 'Admin Users',
    href: '/dashboard/admin/admin-users',
    icon: Users,
    description: 'Role management',
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-aviation-navy transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-aviation-gold" />
              <span className="text-lg font-heading font-bold text-white">Admin HQ</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-white/50">{item.description}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-aviation-gold" />
            <span className="font-heading font-bold text-aviation-navy">Admin HQ</span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
