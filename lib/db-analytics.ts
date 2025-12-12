import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  writeBatch,
  onSnapshot,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
  AnalyticsSnapshot,
  SnapshotPeriod,
  StudentMetrics,
  ProgramMetrics,
  FinancialMetrics,
  EngagementMetrics,
  GeographicMetrics,
  FlightPlan2030Metrics,
  CustomReport,
  ReportConfig,
  ReportRun,
  ReportRunStatus,
  KPITarget,
  KPIStatus,
  KPIPeriod,
  DataExport,
  DataExportStatus,
  ExportFormat,
  MetricTrend,
  TrendDirection,
  TrendComparison,
  AIInsights,
} from '@/types'

// ============================================
// ANALYTICS SNAPSHOTS
// ============================================

/**
 * Get the most recent analytics snapshot
 */
export async function getLatestSnapshot(
  period: SnapshotPeriod = 'daily'
): Promise<AnalyticsSnapshot | null> {
  try {
    const snapshotsRef = collection(db, 'analyticsSnapshots')
    const q = query(
      snapshotsRef,
      where('period', '==', period),
      orderBy('timestamp', 'desc'),
      limit(1)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    return snapshot.docs[0].data() as AnalyticsSnapshot
  } catch (error) {
    console.error('Error getting latest snapshot:', error)
    throw error
  }
}

/**
 * Get snapshots for a date range
 */
export async function getSnapshotsByDateRange(
  startDate: Date,
  endDate: Date,
  period: SnapshotPeriod = 'daily'
): Promise<AnalyticsSnapshot[]> {
  try {
    const snapshotsRef = collection(db, 'analyticsSnapshots')
    const q = query(
      snapshotsRef,
      where('period', '==', period),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as AnalyticsSnapshot)
  } catch (error) {
    console.error('Error getting snapshots by date range:', error)
    throw error
  }
}

/**
 * Get the last N snapshots
 */
export async function getRecentSnapshots(
  count: number = 30,
  period: SnapshotPeriod = 'daily'
): Promise<AnalyticsSnapshot[]> {
  try {
    const snapshotsRef = collection(db, 'analyticsSnapshots')
    const q = query(
      snapshotsRef,
      where('period', '==', period),
      orderBy('timestamp', 'desc'),
      limit(count)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as AnalyticsSnapshot)
  } catch (error) {
    console.error('Error getting recent snapshots:', error)
    throw error
  }
}

/**
 * Create a new analytics snapshot (typically called by scheduled function)
 */
export async function createSnapshot(
  data: Omit<AnalyticsSnapshot, 'snapshotId' | 'generatedAt'>
): Promise<string> {
  try {
    const snapshotsRef = collection(db, 'analyticsSnapshots')
    const snapshotId = doc(snapshotsRef).id

    const snapshot: AnalyticsSnapshot = {
      ...data,
      snapshotId,
      generatedAt: Timestamp.now(),
    }

    await setDoc(doc(snapshotsRef, snapshotId), snapshot)
    return snapshotId
  } catch (error) {
    console.error('Error creating snapshot:', error)
    throw error
  }
}

/**
 * Subscribe to real-time snapshot updates
 */
export function subscribeToLatestSnapshot(
  period: SnapshotPeriod,
  callback: (snapshot: AnalyticsSnapshot | null) => void
): () => void {
  const snapshotsRef = collection(db, 'analyticsSnapshots')
  const q = query(
    snapshotsRef,
    where('period', '==', period),
    orderBy('timestamp', 'desc'),
    limit(1)
  )

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null)
    } else {
      callback(snapshot.docs[0].data() as AnalyticsSnapshot)
    }
  })
}

// ============================================
// FLIGHT PLAN 2030 PROGRESS
// ============================================

const FLIGHT_PLAN_2030_GOAL = 1000000 // 1 million lives

/**
 * Calculate Flight Plan 2030 progress metrics
 */
export function calculateFlightPlan2030Progress(
  totalStudents: number,
  previousMonthStudents: number
): FlightPlan2030Metrics {
  const percentageToGoal = (totalStudents / FLIGHT_PLAN_2030_GOAL) * 100
  const monthlyGrowthRate =
    previousMonthStudents > 0
      ? ((totalStudents - previousMonthStudents) / previousMonthStudents) * 100
      : 0

  // Project completion date based on growth rate
  let projectedCompletion = new Date()
  if (monthlyGrowthRate > 0) {
    const monthsToGoal =
      Math.log(FLIGHT_PLAN_2030_GOAL / totalStudents) /
      Math.log(1 + monthlyGrowthRate / 100)
    projectedCompletion.setMonth(projectedCompletion.getMonth() + Math.ceil(monthsToGoal))
  } else {
    // If no growth, set to 2030 target date
    projectedCompletion = new Date('2030-12-31')
  }

  // Calculate yearly target (divide remaining by years left until 2030)
  const now = new Date()
  const target2030 = new Date('2030-12-31')
  const yearsRemaining = Math.max(
    1,
    (target2030.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  )
  const remaining = FLIGHT_PLAN_2030_GOAL - totalStudents
  const yearlyTarget = Math.ceil(remaining / yearsRemaining)

  // Calculate this year's progress
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearProgress = totalStudents - (previousMonthStudents * 12) // Rough estimate

  return {
    livesReached: totalStudents,
    percentageToGoal: Math.min(100, percentageToGoal),
    projectedCompletion: Timestamp.fromDate(projectedCompletion),
    monthlyGrowthRate,
    yearlyTarget,
    yearlyProgress: Math.max(0, yearProgress),
  }
}

/**
 * Get Flight Plan 2030 dashboard data
 */
export async function getFlightPlan2030Dashboard(): Promise<{
  current: FlightPlan2030Metrics | null
  history: { date: Date; livesReached: number }[]
  milestones: { target: number; reached: boolean; date?: Date }[]
}> {
  try {
    const latestSnapshot = await getLatestSnapshot('monthly')
    const snapshots = await getRecentSnapshots(12, 'monthly')

    const history = snapshots.map((s) => ({
      date: s.timestamp.toDate(),
      livesReached: s.flightPlan2030.livesReached,
    }))

    // Define milestones
    const milestoneTargets = [10000, 50000, 100000, 250000, 500000, 750000, 1000000]
    const currentLives = latestSnapshot?.flightPlan2030.livesReached || 0

    const milestones = milestoneTargets.map((target) => {
      const reachedSnapshot = snapshots.find(
        (s) => s.flightPlan2030.livesReached >= target
      )
      return {
        target,
        reached: currentLives >= target,
        date: reachedSnapshot?.timestamp.toDate(),
      }
    })

    return {
      current: latestSnapshot?.flightPlan2030 || null,
      history,
      milestones,
    }
  } catch (error) {
    console.error('Error getting Flight Plan 2030 dashboard:', error)
    throw error
  }
}

// ============================================
// CUSTOM REPORTS
// ============================================

/**
 * Get all custom reports for a user
 */
export async function getUserReports(userId: string): Promise<CustomReport[]> {
  try {
    const reportsRef = collection(db, 'customReports')
    const q = query(
      reportsRef,
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as CustomReport)
  } catch (error) {
    console.error('Error getting user reports:', error)
    throw error
  }
}

/**
 * Get shared reports accessible to a user
 */
export async function getSharedReports(userId: string): Promise<CustomReport[]> {
  try {
    const reportsRef = collection(db, 'customReports')
    const q = query(
      reportsRef,
      where('sharedWith', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as CustomReport)
  } catch (error) {
    console.error('Error getting shared reports:', error)
    throw error
  }
}

/**
 * Get public reports
 */
export async function getPublicReports(): Promise<CustomReport[]> {
  try {
    const reportsRef = collection(db, 'customReports')
    const q = query(
      reportsRef,
      where('visibility', '==', 'public'),
      orderBy('runCount', 'desc'),
      limit(20)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as CustomReport)
  } catch (error) {
    console.error('Error getting public reports:', error)
    throw error
  }
}

/**
 * Get a single report by ID
 */
export async function getReport(reportId: string): Promise<CustomReport | null> {
  try {
    const reportRef = doc(db, 'customReports', reportId)
    const reportDoc = await getDoc(reportRef)

    if (!reportDoc.exists()) {
      return null
    }

    return reportDoc.data() as CustomReport
  } catch (error) {
    console.error('Error getting report:', error)
    throw error
  }
}

/**
 * Create a new custom report
 */
export async function createReport(
  data: Omit<CustomReport, 'reportId' | 'createdAt' | 'updatedAt' | 'runCount' | 'averageRuntime'>
): Promise<string> {
  try {
    const reportsRef = collection(db, 'customReports')
    const reportId = doc(reportsRef).id

    const report: CustomReport = {
      ...data,
      reportId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      runCount: 0,
      averageRuntime: 0,
    }

    await setDoc(doc(reportsRef, reportId), report)
    return reportId
  } catch (error) {
    console.error('Error creating report:', error)
    throw error
  }
}

/**
 * Update an existing report
 */
export async function updateReport(
  reportId: string,
  data: Partial<CustomReport>
): Promise<void> {
  try {
    const reportRef = doc(db, 'customReports', reportId)
    await updateDoc(reportRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating report:', error)
    throw error
  }
}

/**
 * Delete a report
 */
export async function deleteReport(reportId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'customReports', reportId))
  } catch (error) {
    console.error('Error deleting report:', error)
    throw error
  }
}

/**
 * Record a report run
 */
export async function recordReportRun(
  data: Omit<ReportRun, 'runId'>
): Promise<string> {
  try {
    const runsRef = collection(db, 'reportRuns')
    const runId = doc(runsRef).id

    const run: ReportRun = {
      ...data,
      runId,
    }

    await setDoc(doc(runsRef, runId), run)

    // Update report stats
    if (data.status === 'completed') {
      const reportRef = doc(db, 'customReports', data.reportId)
      await updateDoc(reportRef, {
        runCount: increment(1),
        lastRun: Timestamp.now(),
      })
    }

    return runId
  } catch (error) {
    console.error('Error recording report run:', error)
    throw error
  }
}

/**
 * Get report run history
 */
export async function getReportRunHistory(
  reportId: string,
  limitCount: number = 10
): Promise<ReportRun[]> {
  try {
    const runsRef = collection(db, 'reportRuns')
    const q = query(
      runsRef,
      where('reportId', '==', reportId),
      orderBy('executedAt', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as ReportRun)
  } catch (error) {
    console.error('Error getting report run history:', error)
    throw error
  }
}

// ============================================
// KPI TARGETS
// ============================================

/**
 * Get all KPI targets
 */
export async function getAllKPITargets(): Promise<KPITarget[]> {
  try {
    const targetsRef = collection(db, 'kpiTargets')
    const q = query(targetsRef, orderBy('name', 'asc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as KPITarget)
  } catch (error) {
    console.error('Error getting KPI targets:', error)
    throw error
  }
}

/**
 * Get KPI targets by period
 */
export async function getKPITargetsByPeriod(period: KPIPeriod): Promise<KPITarget[]> {
  try {
    const targetsRef = collection(db, 'kpiTargets')
    const q = query(
      targetsRef,
      where('period', '==', period),
      orderBy('name', 'asc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as KPITarget)
  } catch (error) {
    console.error('Error getting KPI targets by period:', error)
    throw error
  }
}

/**
 * Get KPI targets by status
 */
export async function getKPITargetsByStatus(status: KPIStatus): Promise<KPITarget[]> {
  try {
    const targetsRef = collection(db, 'kpiTargets')
    const q = query(
      targetsRef,
      where('status', '==', status),
      orderBy('percentageComplete', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as KPITarget)
  } catch (error) {
    console.error('Error getting KPI targets by status:', error)
    throw error
  }
}

/**
 * Get a single KPI target
 */
export async function getKPITarget(targetId: string): Promise<KPITarget | null> {
  try {
    const targetRef = doc(db, 'kpiTargets', targetId)
    const targetDoc = await getDoc(targetRef)

    if (!targetDoc.exists()) {
      return null
    }

    return targetDoc.data() as KPITarget
  } catch (error) {
    console.error('Error getting KPI target:', error)
    throw error
  }
}

/**
 * Create a new KPI target
 */
export async function createKPITarget(
  data: Omit<KPITarget, 'targetId' | 'createdAt' | 'updatedAt' | 'status' | 'percentageComplete'>
): Promise<string> {
  try {
    const targetsRef = collection(db, 'kpiTargets')
    const targetId = doc(targetsRef).id

    // Calculate initial status
    const percentageComplete = (data.currentValue / data.targetValue) * 100
    let status: KPIStatus = 'on-track'
    if (percentageComplete >= 100) {
      status = 'achieved'
    } else if (data.currentValue < data.thresholds.red) {
      status = 'critical'
    } else if (data.currentValue < data.thresholds.yellow) {
      status = 'at-risk'
    }

    const target: KPITarget = {
      ...data,
      targetId,
      status,
      percentageComplete,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(doc(targetsRef, targetId), target)
    return targetId
  } catch (error) {
    console.error('Error creating KPI target:', error)
    throw error
  }
}

/**
 * Update a KPI target
 */
export async function updateKPITarget(
  targetId: string,
  data: Partial<KPITarget>
): Promise<void> {
  try {
    const targetRef = doc(db, 'kpiTargets', targetId)
    await updateDoc(targetRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating KPI target:', error)
    throw error
  }
}

/**
 * Update KPI target progress
 */
export async function updateKPIProgress(
  targetId: string,
  currentValue: number
): Promise<KPIStatus> {
  try {
    const target = await getKPITarget(targetId)
    if (!target) {
      throw new Error('KPI target not found')
    }

    const percentageComplete = (currentValue / target.targetValue) * 100
    let status: KPIStatus = 'on-track'

    if (percentageComplete >= 100) {
      status = 'achieved'
    } else if (currentValue < target.thresholds.red) {
      status = 'critical'
    } else if (currentValue < target.thresholds.yellow) {
      status = 'at-risk'
    }

    await updateDoc(doc(db, 'kpiTargets', targetId), {
      currentValue,
      percentageComplete,
      status,
      lastChecked: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return status
  } catch (error) {
    console.error('Error updating KPI progress:', error)
    throw error
  }
}

/**
 * Delete a KPI target
 */
export async function deleteKPITarget(targetId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'kpiTargets', targetId))
  } catch (error) {
    console.error('Error deleting KPI target:', error)
    throw error
  }
}

/**
 * Subscribe to KPI targets updates
 */
export function subscribeToKPITargets(
  callback: (targets: KPITarget[]) => void
): () => void {
  const targetsRef = collection(db, 'kpiTargets')
  const q = query(targetsRef, orderBy('status', 'asc'))

  return onSnapshot(q, (snapshot) => {
    const targets = snapshot.docs.map((doc) => doc.data() as KPITarget)
    callback(targets)
  })
}

// ============================================
// DATA EXPORTS
// ============================================

/**
 * Create a data export request
 */
export async function createDataExport(
  data: Omit<DataExport, 'exportId' | 'requestedAt' | 'status'>
): Promise<string> {
  try {
    const exportsRef = collection(db, 'dataExports')
    const exportId = doc(exportsRef).id

    const exportDoc: DataExport = {
      ...data,
      exportId,
      requestedAt: Timestamp.now(),
      status: 'pending',
    }

    await setDoc(doc(exportsRef, exportId), exportDoc)
    return exportId
  } catch (error) {
    console.error('Error creating data export:', error)
    throw error
  }
}

/**
 * Get user's export history
 */
export async function getUserExports(userId: string): Promise<DataExport[]> {
  try {
    const exportsRef = collection(db, 'dataExports')
    const q = query(
      exportsRef,
      where('requestedBy', '==', userId),
      orderBy('requestedAt', 'desc'),
      limit(50)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data() as DataExport)
  } catch (error) {
    console.error('Error getting user exports:', error)
    throw error
  }
}

/**
 * Get a single export
 */
export async function getDataExport(exportId: string): Promise<DataExport | null> {
  try {
    const exportRef = doc(db, 'dataExports', exportId)
    const exportDoc = await getDoc(exportRef)

    if (!exportDoc.exists()) {
      return null
    }

    return exportDoc.data() as DataExport
  } catch (error) {
    console.error('Error getting data export:', error)
    throw error
  }
}

/**
 * Update export status
 */
export async function updateExportStatus(
  exportId: string,
  status: DataExportStatus,
  additionalData?: Partial<DataExport>
): Promise<void> {
  try {
    const exportRef = doc(db, 'dataExports', exportId)
    await updateDoc(exportRef, {
      status,
      ...additionalData,
      ...(status === 'completed' ? { completedAt: Timestamp.now() } : {}),
    })
  } catch (error) {
    console.error('Error updating export status:', error)
    throw error
  }
}

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Calculate trend for a specific metric
 */
export function calculateTrend(
  current: number,
  previous: number
): { change: number; changePercent: number; direction: TrendDirection } {
  const change = current - previous
  const changePercent = previous > 0 ? (change / previous) * 100 : 0

  let direction: TrendDirection = 'stable'
  if (changePercent > 1) direction = 'up'
  else if (changePercent < -1) direction = 'down'

  return { change, changePercent, direction }
}

/**
 * Get metric trends from snapshots
 */
export async function getMetricTrends(
  metricPath: string,
  periods: number = 12
): Promise<TrendComparison> {
  try {
    const snapshots = await getRecentSnapshots(periods, 'monthly')

    const getNestedValue = (obj: any, path: string): number => {
      return path.split('.').reduce((curr, key) => curr?.[key], obj) || 0
    }

    const data = snapshots.map((s) => ({
      label: s.timestamp.toDate().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      value: getNestedValue(s, metricPath),
      timestamp: s.timestamp,
    }))

    // Calculate average growth
    let totalGrowth = 0
    for (let i = 1; i < data.length; i++) {
      if (data[i].value > 0) {
        totalGrowth += ((data[i - 1].value - data[i].value) / data[i].value) * 100
      }
    }
    const averageGrowth = data.length > 1 ? totalGrowth / (data.length - 1) : 0

    // Determine overall trend
    let trend: TrendDirection = 'stable'
    if (averageGrowth > 1) trend = 'up'
    else if (averageGrowth < -1) trend = 'down'

    return {
      metric: metricPath,
      periods: data.reverse(), // Oldest to newest
      trend,
      averageGrowth,
    }
  } catch (error) {
    console.error('Error getting metric trends:', error)
    throw error
  }
}

/**
 * Get dashboard summary with key metrics and trends
 */
export async function getDashboardSummary(): Promise<{
  current: AnalyticsSnapshot | null
  trends: {
    students: MetricTrend
    programs: MetricTrend
    donations: MetricTrend
    engagement: MetricTrend
  } | null
  flightPlan2030: FlightPlan2030Metrics | null
  kpiSummary: {
    total: number
    achieved: number
    onTrack: number
    atRisk: number
    critical: number
  }
}> {
  try {
    const [current, previous, kpiTargets] = await Promise.all([
      getLatestSnapshot('daily'),
      getRecentSnapshots(2, 'daily').then((s) => s[1] || null),
      getAllKPITargets(),
    ])

    let trends = null
    if (current && previous) {
      trends = {
        students: {
          metricName: 'Total Students',
          currentValue: current.studentMetrics.totalStudents,
          previousValue: previous.studentMetrics.totalStudents,
          ...calculateTrend(
            current.studentMetrics.totalStudents,
            previous.studentMetrics.totalStudents
          ),
          periodStart: previous.timestamp,
          periodEnd: current.timestamp,
        },
        programs: {
          metricName: 'Active Programs',
          currentValue: current.programMetrics.totalPrograms,
          previousValue: previous.programMetrics.totalPrograms,
          ...calculateTrend(
            current.programMetrics.totalPrograms,
            previous.programMetrics.totalPrograms
          ),
          periodStart: previous.timestamp,
          periodEnd: current.timestamp,
        },
        donations: {
          metricName: 'Total Donations',
          currentValue: current.financialMetrics.totalDonations,
          previousValue: previous.financialMetrics.totalDonations,
          ...calculateTrend(
            current.financialMetrics.totalDonations,
            previous.financialMetrics.totalDonations
          ),
          periodStart: previous.timestamp,
          periodEnd: current.timestamp,
        },
        engagement: {
          metricName: 'Daily Active Users',
          currentValue: current.engagementMetrics.dailyActiveUsers,
          previousValue: previous.engagementMetrics.dailyActiveUsers,
          ...calculateTrend(
            current.engagementMetrics.dailyActiveUsers,
            previous.engagementMetrics.dailyActiveUsers
          ),
          periodStart: previous.timestamp,
          periodEnd: current.timestamp,
        },
      }
    }

    const kpiSummary = {
      total: kpiTargets.length,
      achieved: kpiTargets.filter((k) => k.status === 'achieved').length,
      onTrack: kpiTargets.filter((k) => k.status === 'on-track').length,
      atRisk: kpiTargets.filter((k) => k.status === 'at-risk').length,
      critical: kpiTargets.filter((k) => k.status === 'critical').length,
    }

    return {
      current,
      trends,
      flightPlan2030: current?.flightPlan2030 || null,
      kpiSummary,
    }
  } catch (error) {
    console.error('Error getting dashboard summary:', error)
    throw error
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format number for display
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}

/**
 * Format currency for display
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get status color class
 */
export function getStatusColor(status: KPIStatus): string {
  switch (status) {
    case 'achieved':
      return 'text-green-600 bg-green-100'
    case 'on-track':
      return 'text-blue-600 bg-blue-100'
    case 'at-risk':
      return 'text-yellow-600 bg-yellow-100'
    case 'critical':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Get trend color class
 */
export function getTrendColor(direction: TrendDirection, inverse: boolean = false): string {
  if (inverse) {
    switch (direction) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }
  switch (direction) {
    case 'up':
      return 'text-green-600'
    case 'down':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}
