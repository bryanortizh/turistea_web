export interface ReportResponse {
  status: number;
  message: string;
  filter_applied: string;
  period_limit: number;
  summary: ReportSummary;
  period_stats: PeriodStats[];
}

export interface ReportSummary {
  total_reserves: number;
  total_revenue: number;
  average_price: string;
  total_people: number;
  status_breakdown: StatusBreakdown;
}

export interface StatusBreakdown {
  pending: number;
  rejected: number;
  pendingpay: number;
  reserve: number;
  inprocesstravel: number;
  done: number;
  approved: number;
}

export interface PeriodStats {
  reservation_period: string;
  total_reserves: number;
  pending_reserves: string;
  rejected_reserves: string;
  pendingpay_reserves: string;
  reserve_reserves: string;
  inprocesstravel_reserves: string;
  done_reserves: string;
  approved_reserves: string;
  total_revenue: string;
  avg_price: string;
  total_people: string;
  reservation_date: string;
}