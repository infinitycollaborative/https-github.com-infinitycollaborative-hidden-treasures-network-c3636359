'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { OrganizationRecord, getAllOrganizations } from '@/lib/db-organizations'

interface OrganizationWithHealth extends OrganizationRecord {
  complianceScore?: number
  riskScore?: number
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  lastActivityDate?: Date
  activeStudents?: number
  activeMentors?: number
}

export default function AffiliatesPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithHealth[]>([])
  const [filteredOrgs, setFilteredOrgs] = useState<OrganizationWithHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')

  useEffect(() => {
    loadOrganizations()
  }, [])

  useEffect(() => {
    filterOrganizations()
  }, [organizations, searchTerm, statusFilter, countryFilter])

  async function loadOrganizations() {
    try {
      setLoading(true)
      const orgs = await getAllOrganizations()
      
      // Enhance with mock health data (TODO: fetch from actual health collection)
      const enhanced = orgs.map(org => ({
        ...org,
        complianceScore: Math.floor(Math.random() * 40) + 60, // Mock: 60-100
        riskScore: Math.floor(Math.random() * 50), // Mock: 0-50
        riskLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
        lastActivityDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        activeStudents: Math.floor(Math.random() * 50) + 10,
        activeMentors: Math.floor(Math.random() * 20) + 5,
      }))
      
      setOrganizations(enhanced)
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterOrganizations() {
    let filtered = [...organizations]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        org =>
          org.name.toLowerCase().includes(term) ||
          org.location?.city?.toLowerCase().includes(term) ||
          org.location?.country?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(org => org.status === statusFilter)
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(org => org.location?.country === countryFilter)
    }

    setFilteredOrgs(filtered)
  }

  const countries = Array.from(
    new Set(organizations.map(org => org.location?.country).filter(Boolean))
  ).sort()

  function getRiskBadgeColor(level?: string) {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusIcon(status?: string) {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Affiliate Organizations
        </h1>
        <p className="mt-2 text-gray-600">
          Manage and monitor all organizations in the network
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-aviation-sky">
              {organizations.length}
            </div>
            <p className="text-xs text-gray-600">Total Organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {organizations.filter(o => o.status === 'active' || o.status === 'approved').length}
            </div>
            <p className="text-xs text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {organizations.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-600">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {organizations.filter(o => o.riskLevel === 'high' || o.riskLevel === 'critical').length}
            </div>
            <p className="text-xs text-gray-600">High Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Country Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <div className="space-y-4">
        {filteredOrgs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No organizations found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrgs.map(org => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Organization Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-aviation-sky" />
                      <h3 className="text-lg font-semibold text-aviation-navy">
                        {org.name}
                      </h3>
                      {getStatusIcon(org.status)}
                      <span className="text-sm text-gray-500 capitalize">
                        {org.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p>
                        📍 {org.location?.city}, {org.location?.state}, {org.location?.country}
                      </p>
                      {org.programTypes && org.programTypes.length > 0 && (
                        <p>
                          🎯 {org.programTypes.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-medium">Compliance:</span>{' '}
                        <span className={org.complianceScore! >= 80 ? 'text-green-600' : 'text-orange-600'}>
                          {org.complianceScore}%
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Risk:</span>{' '}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskBadgeColor(org.riskLevel)}`}>
                          {org.riskLevel}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Students:</span> {org.activeStudents}
                      </div>
                      <div>
                        <span className="font-medium">Mentors:</span> {org.activeMentors}
                      </div>
                      <div>
                        <span className="font-medium">Last Active:</span>{' '}
                        {org.lastActivityDate
                          ? new Date(org.lastActivityDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/admin/affiliates/${org.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {org.status === 'pending' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
