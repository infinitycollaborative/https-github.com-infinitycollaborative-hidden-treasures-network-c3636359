import { Timestamp } from 'firebase/firestore'

/**
 * Phase 16: Analytics & Reporting Engine Types
 * Provides comprehensive analytics, reporting, and data export capabilities
 */

// ============================================
// ANALYTICS SNAPSHOT TYPES
// ============================================

/**
 * Snapshot period types
 */
export type SnapshotPeriod = 'daily' | 'weekly' | 'monthly'

/**
 * Student metrics captured in each snapshot
 */
export interface StudentMetrics {
  totalStudents: number
  newStudents: number
  activeStudents: number
  totalXP: number
  averageXP: number
  totalBadges: number
  totalFlightHours: number
  averageFlightHours: number
  graduationRate: number
  atRiskCount: number
}

/**
 * Program metrics captured in each snapshot
 */
export interface ProgramMetrics {
  totalPrograms: number
  newPrograms: number
  totalSessions: number
  averageAttendance: number
  completionRate: number
  totalParticipants: number
}

/**
 * Financial metrics captured in each snapshot
 */
export interface FinancialMetrics {
  totalDonations: number
  donationCount: number
  averageDonation: number
  totalRevenue: number
  itemsSold: number
  sponsorContributions: number
}

/**
 * User engagement metrics
 */
export interface EngagementMetrics {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionDuration: number
  bounceRate: number
  returnRate: number
}

/**
 * Geographic distribution metrics
 */
export interface GeographicMetrics {
  schoolCount: number
  districtCount: number
  stateBreakdown: Record<string, number>
  ruralCount: number
  urbanCount: number
}

/**
 * Flight Plan 2030 progress tracking (Goal: 1 million lives)
 */
export interface FlightPlan2030Metrics {
  livesReached: number
  percentageToGoal: number
  projectedCompletion: Timestamp
  monthlyGrowthRate: number
  yearlyTarget: number
  yearlyProgress: number
}

/**
 * Complete analytics snapshot document
 */
export interface AnalyticsSnapshot {
  snapshotId: string
  timestamp: Timestamp
  period: SnapshotPeriod
  startDate: Timestamp
  endDate: Timestamp

  // Metrics
  studentMetrics: StudentMetrics
  programMetrics: ProgramMetrics
  financialMetrics: FinancialMetrics
  engagementMetrics: EngagementMetrics
  geographicMetrics: GeographicMetrics
  flightPlan2030: FlightPlan2030Metrics

  // Metadata
  generatedBy: 'automated' | 'manual'
  generatedAt: Timestamp
  version: string
}

// ============================================
// CUSTOM REPORT TYPES
// ============================================

/**
 * Data sources available for custom reports
 */
export type ReportDataSource =
  | 'students'
  | 'programs'
  | 'donations'
  | 'sessions'
  | 'marketplace'
  | 'schools'
  | 'organizations'
  | 'events'

/**
 * Date range types for reports
 */
export type DateRangeType =
  | 'custom'
  | 'last7days'
  | 'last30days'
  | 'last90days'
  | 'thisYear'
  | 'allTime'

/**
 * Chart visualization types
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'table' | 'heatmap' | 'area'

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

/**
 * Report grouping options
 */
export type ReportGroupBy =
  | 'school'
  | 'grade'
  | 'month'
  | 'sponsor'
  | 'program'
  | 'organization'
  | 'state'
  | 'week'

/**
 * Report visibility options
 */
export type ReportVisibility = 'private' | 'shared' | 'public'

/**
 * Report schedule frequency
 */
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly'

/**
 * Custom report filters
 */
export interface ReportFilters {
  schoolIds?: string[]
  gradeLevel?: string[]
  rankTier?: string[]
  donationType?: string[]
  sponsorId?: string
  programType?: string[]
  geographicRegion?: string[]
  organizationIds?: string[]
  dateRange?: {
    startDate?: Timestamp
    endDate?: Timestamp
  }
}

/**
 * Report date range configuration
 */
export interface ReportDateRange {
  type: DateRangeType
  startDate?: Timestamp
  endDate?: Timestamp
}

/**
 * Report schedule configuration
 */
export interface ReportSchedule {
  enabled: boolean
  frequency: ScheduleFrequency
  dayOfWeek?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  time: string // HH:mm format
  recipients: string[] // Email addresses
}

/**
 * Report configuration
 */
export interface ReportConfig {
  dataSource: ReportDataSource
  dateRange: ReportDateRange
  filters: ReportFilters
  metrics: string[]
  groupBy?: ReportGroupBy
  sortBy: string
  sortOrder: 'asc' | 'desc'
  chartType: ChartType
  exportFormat: ExportFormat
}

/**
 * Custom report definition
 */
export interface CustomReport {
  reportId: string
  name: string
  description: string
  createdBy: string
  createdByName?: string
  createdAt: Timestamp
  updatedAt: Timestamp

  // Configuration
  config: ReportConfig

  // Access Control
  visibility: ReportVisibility
  sharedWith: string[]

  // Schedule (optional)
  schedule?: ReportSchedule

  // Usage Stats
  runCount: number
  lastRun?: Timestamp
  averageRuntime: number
}

// ============================================
// REPORT RUN TYPES
// ============================================

/**
 * Report execution status
 */
export type ReportRunStatus = 'running' | 'completed' | 'failed'

/**
 * Report run/execution record
 */
export interface ReportRun {
  runId: string
  reportId: string
  reportName: string

  executedBy: string
  executedByName?: string
  executedAt: Timestamp
  completedAt?: Timestamp

  status: ReportRunStatus
  errorMessage?: string

  // Execution Details
  rowCount: number
  executionTime: number // Milliseconds

  // Data Storage
  resultData: any[]
  dataStoragePath?: string // GCS path for large results

  // Export Details
  exportFormat: ExportFormat
  exportUrl?: string
  exportSize: number // Bytes

  // Metadata
  filters: ReportFilters
  dateRange: ReportDateRange
}

// ============================================
// KPI TARGET TYPES
// ============================================

/**
 * KPI tracking period
 */
export type KPIPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

/**
 * KPI status based on progress
 */
export type KPIStatus = 'on-track' | 'at-risk' | 'critical' | 'achieved'

/**
 * KPI threshold configuration
 */
export interface KPIThresholds {
  red: number    // Critical threshold
  yellow: number // Warning threshold
  green: number  // On track threshold
}

/**
 * KPI alert configuration
 */
export interface KPIAlerts {
  enabled: boolean
  notifyUsers: string[]
  emailOnYellow: boolean
  emailOnRed: boolean
  slackWebhook?: string
}

/**
 * KPI target definition
 */
export interface KPITarget {
  targetId: string
  name: string
  description: string

  // Metric Definition
  metricPath: string // e.g., "studentMetrics.activeStudents"
  targetValue: number
  currentValue: number
  unit: string // e.g., "students", "dollars", "percent"

  // Thresholds
  thresholds: KPIThresholds

  // Time Period
  period: KPIPeriod
  startDate: Timestamp
  endDate: Timestamp

  // Status
  status: KPIStatus
  percentageComplete: number

  // Alerts
  alerts: KPIAlerts

  // Ownership
  owner: string
  ownerName?: string
  stakeholders: string[]

  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  lastChecked?: Timestamp
}

// ============================================
// DATA EXPORT TYPES
// ============================================

/**
 * Data export type
 */
export type DataExportType = 'snapshot' | 'custom-report' | 'raw-data'

/**
 * Data export status
 */
export type DataExportStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Data export request/record
 */
export interface DataExport {
  exportId: string
  requestedBy: string
  requestedByName?: string
  requestedAt: Timestamp
  completedAt?: Timestamp

  // Export Configuration
  exportType: DataExportType
  dataSource: string
  format: ExportFormat

  // Filters
  dateRange?: {
    startDate: Timestamp
    endDate: Timestamp
  }
  filters?: ReportFilters

  // Status
  status: DataExportStatus
  errorMessage?: string

  // File Details
  fileName: string
  fileSize: number // Bytes
  rowCount: number
  storagePath: string
  downloadUrl?: string
  expiresAt?: Timestamp

  // Privacy
  includesPII: boolean
  auditLog: boolean
}

// ============================================
// AI INSIGHTS TYPES
// ============================================

/**
 * AI-generated insights from analytics data
 */
export interface AIInsights {
  snapshotId: string
  generatedAt: Timestamp

  positiveTrends: string[]
  concerns: string[]
  recommendations: string[]
  prediction: string
  summary: string

  // Confidence
  confidenceScore: number
}

/**
 * Student risk prediction from AI
 */
export interface StudentRiskPrediction {
  studentId: string
  riskLevel: 'low' | 'medium' | 'high'
  riskScore: number // 0-100
  factors: string[]
  recommendations: string[]
  reasoning: string
  predictedAt: Timestamp
}

// ============================================
// DASHBOARD TYPES
// ============================================

/**
 * Dashboard widget types
 */
export type DashboardWidgetType =
  | 'stat-card'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'table'
  | 'progress-ring'
  | 'heatmap'
  | 'leaderboard'

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string
  type: DashboardWidgetType
  title: string
  description?: string
  metricPath: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { row: number; col: number }
  config?: Record<string, any>
}

/**
 * Custom dashboard configuration
 */
export interface CustomDashboard {
  dashboardId: string
  name: string
  description: string
  createdBy: string
  widgets: DashboardWidget[]
  isDefault: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================
// TREND ANALYSIS TYPES
// ============================================

/**
 * Trend direction
 */
export type TrendDirection = 'up' | 'down' | 'stable'

/**
 * Metric trend data
 */
export interface MetricTrend {
  metricName: string
  currentValue: number
  previousValue: number
  change: number
  changePercent: number
  direction: TrendDirection
  periodStart: Timestamp
  periodEnd: Timestamp
}

/**
 * Trend comparison data
 */
export interface TrendComparison {
  metric: string
  periods: {
    label: string
    value: number
    timestamp: Timestamp
  }[]
  trend: TrendDirection
  averageGrowth: number
}
