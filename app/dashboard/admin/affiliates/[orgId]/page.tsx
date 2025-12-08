'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  FileCheck,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  MapPin,
  Shield,
} from 'lucide-react'
import { OrganizationRecord, getOrganizationById } from '@/lib/db-organizations'
import { getComplianceSubmissionsByOrg } from '@/lib/db-compliance'
import { getIncidentsByOrganization } from '@/lib/db-incidents'

type TabType = 'overview' | 'compliance' | 'users' | 'events' | 'impact' | 'risk'

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params?.orgId as string
  
  const [organization, setOrganization] = useState<OrganizationRecord | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  const [complianceData, setComplianceData] = useState<any[]>([])
  const [incidentData, setIncidentData] = useState<any[]>([])

  useEffect(() => {
    if (orgId) {
      loadOrganizationData()
    }
  }, [orgId])

  async function loadOrganizationData() {
    try {
      setLoading(true)
      const org = await getOrganizationById(orgId)
      setOrganization(org)

      if (org) {
        // Load compliance and incident data
        const [compliance, incidents] = await Promise.all([
          getComplianceSubmissionsByOrg(orgId),
          getIncidentsByOrganization(orgId),
        ])
        
        setComplianceData(compliance)
        setIncidentData(incidents)
      }
    } catch (error) {
      console.error('Error loading organization:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Not Found</h2>
        <p className="text-gray-600 mb-6">The organization you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard/admin/affiliates">
          <Button>Back to Affiliates</Button>
        </Link>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
  ]

  const mockComplianceScore = 85
  const mockRiskLevel = 'low'
  const openIncidents = incidentData.filter(i => i.status === 'open' || i.status === 'under_review').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/affiliates"
          className="inline-flex items-center gap-2 text-sm text-aviation-sky hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliates
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-aviation-navy flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              {organization.name}
            </h1>
            <p className="mt-2 text-gray-600">
              {organization.location?.city}, {organization.location?.state}, {organization.location?.country}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button className="bg-aviation-navy">
              <Shield className="h-4 w-4 mr-2" />
              Manage Status
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold capitalize">{organization.status || 'Active'}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-lg font-semibold text-green-600">{mockComplianceScore}%</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-lg font-semibold capitalize text-green-600">{mockRiskLevel}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Incidents</p>
                <p className={`text-lg font-semibold ${openIncidents > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {openIncidents}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${openIncidents > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-aviation-sky text-aviation-sky'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab organization={organization} />}
        {activeTab === 'compliance' && <ComplianceTab submissions={complianceData} />}
        {activeTab === 'users' && <UsersTab orgId={orgId} />}
        {activeTab === 'events' && <EventsTab orgId={orgId} />}
        {activeTab === 'impact' && <ImpactTab organization={organization} />}
        {activeTab === 'risk' && <RiskTab incidents={incidentData} />}
      </div>
    </div>
  )
}

function OverviewTab({ organization }: { organization: OrganizationRecord }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{organization.contactEmail || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{organization.contactPhone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Website</p>
              {organization.website ? (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-aviation-sky hover:underline"
                >
                  {organization.website}
                </a>
              ) : (
                <p className="font-medium">N/A</p>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">
                {organization.location?.city}, {organization.location?.state},{' '}
                {organization.location?.country}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          {organization.programTypes && organization.programTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organization.programTypes.map(program => (
                <span
                  key={program}
                  className="px-3 py-1 bg-aviation-sky/10 text-aviation-sky rounded-full text-sm font-medium"
                >
                  {program}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No programs listed</p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {organization.description || 'No description available.'}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-aviation-sky">
                {organization.impact?.studentsServed || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Students Served</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aviation-gold">
                {organization.impact?.certificationsAwarded || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Certifications</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {organization.impact?.volunteerHours || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Volunteer Hours</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {organization.impact?.eventsHosted || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Events Hosted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ComplianceTab({ submissions }: { submissions: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Documents</CardTitle>
        <CardDescription>
          Submitted compliance documents and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No compliance submissions yet</p>
        ) : (
          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium">{sub.requirementName}</p>
                  <p className="text-sm text-gray-600">
                    Submitted {new Date((sub.submittedAt as any)?.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sub.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : sub.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UsersTab({ orgId }: { orgId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Users</CardTitle>
        <CardDescription>Members, mentors, and administrators</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">
          User management interface coming soon
        </p>
      </CardContent>
    </Card>
  )
}

function EventsTab({ orgId }: { orgId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Events & Activities</CardTitle>
        <CardDescription>Past and upcoming events</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">
          Event listing coming soon
        </p>
      </CardContent>
    </Card>
  )
}

function ImpactTab({ organization }: { organization: OrganizationRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Metrics</CardTitle>
        <CardDescription>Organization&apos;s community impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-4">Youth Reached</h3>
            <div className="text-4xl font-bold text-aviation-sky mb-2">
              {organization.impact?.studentsServed || 0}
            </div>
            <p className="text-sm text-gray-600">Total students impacted</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Certifications Earned</h3>
            <div className="text-4xl font-bold text-aviation-gold mb-2">
              {organization.impact?.certificationsAwarded || 0}
            </div>
            <p className="text-sm text-gray-600">Professional certifications</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Volunteer Hours</h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {organization.impact?.volunteerHours || 0}
            </div>
            <p className="text-sm text-gray-600">Community service hours</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Events Hosted</h3>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {organization.impact?.eventsHosted || 0}
            </div>
            <p className="text-sm text-gray-600">Educational events</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RiskTab({ incidents }: { incidents: any[] }) {
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'under_review')
  const highPriorityIncidents = incidents.filter(i => i.priority === 'high' || i.priority === 'critical')
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Summary</CardTitle>
          <CardDescription>AI-generated risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">Low</div>
              <p className="text-sm text-gray-600">Current Risk Level</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">{openIncidents.length}</div>
              <p className="text-sm text-gray-600">Open Incidents</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">{highPriorityIncidents.length}</div>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Safety and compliance incidents</CardDescription>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No incidents reported</p>
          ) : (
            <div className="space-y-3">
              {incidents.slice(0, 5).map(incident => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date((incident.createdAt as any)?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        incident.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : incident.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {incident.priority}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        incident.status === 'resolved' || incident.status === 'closed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
