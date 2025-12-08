'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
} from 'lucide-react'

interface NetworkMetrics {
  activeOrganizations: number
  totalOrganizations: number
  activeMentors: number
  activeStudents: number
  eventsThisMonth: number
  sessionsThisWeek: number
  pendingCompliance: number
  openIncidents: number
  highRiskOrgs: number
  countriesActive: number
}

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    activeOrganizations: 156,
    totalOrganizations: 189,
    activeMentors: 487,
    activeStudents: 1247,
    eventsThisMonth: 34,
    sessionsThisWeek: 128,
    pendingCompliance: 12,
    openIncidents: 5,
    highRiskOrgs: 3,
    countriesActive: 24,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: Fetch real metrics from Firestore
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Network Overview
        </h1>
        <p className="mt-2 text-gray-600">
          Global platform health and key performance indicators
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-sky">
              {metrics.activeOrganizations}
            </div>
            <p className="text-xs text-muted-foreground">
              of {metrics.totalOrganizations} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeMentors}</div>
            <p className="text-xs text-muted-foreground">Engaged this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Active</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-gold">{metrics.countriesActive}</div>
            <p className="text-xs text-muted-foreground">Global reach</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.eventsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Mentorship sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((metrics.totalOrganizations - metrics.pendingCompliance) / metrics.totalOrganizations) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingCompliance} pending reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Safety & Risk Indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Safety Indicators
            </CardTitle>
            <CardDescription>Active safety concerns requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Open Incident Reports</span>
              <span className={`text-2xl font-bold ${metrics.openIncidents > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {metrics.openIncidents}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High-Risk Organizations</span>
              <span className={`text-2xl font-bold ${metrics.highRiskOrgs > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.highRiskOrgs}
              </span>
            </div>
            <div className="pt-2">
              {metrics.openIncidents > 0 || metrics.highRiskOrgs > 0 ? (
                <a
                  href="/dashboard/admin/incidents"
                  className="text-sm text-aviation-sky hover:underline"
                >
                  View incident reports →
                </a>
              ) : (
                <p className="text-sm text-green-600">✓ No critical safety issues</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Program Quality
            </CardTitle>
            <CardDescription>Overall platform health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Mentor-Student Ratio</span>
              <span className="text-2xl font-bold text-aviation-sky">1:2.6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Session Rating</span>
              <span className="text-2xl font-bold text-aviation-gold">4.7/5</span>
            </div>
            <div className="pt-2">
              <p className="text-sm text-green-600">
                ✓ All metrics within healthy ranges
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/dashboard/admin/affiliates"
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-5 w-5 text-aviation-sky mb-2" />
              <div className="font-medium text-sm">Review Affiliates</div>
              <div className="text-xs text-gray-500">Manage organizations</div>
            </a>
            <a
              href="/dashboard/admin/compliance"
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
              <div className="font-medium text-sm">Approve Compliance</div>
              <div className="text-xs text-gray-500">{metrics.pendingCompliance} pending</div>
            </a>
            <a
              href="/dashboard/admin/incidents"
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-orange-600 mb-2" />
              <div className="font-medium text-sm">Review Incidents</div>
              <div className="text-xs text-gray-500">{metrics.openIncidents} open</div>
            </a>
            <a
              href="/dashboard/admin/communications"
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-5 w-5 text-purple-600 mb-2" />
              <div className="font-medium text-sm">Send Broadcast</div>
              <div className="text-xs text-gray-500">Network communication</div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
