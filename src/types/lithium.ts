export interface DemandSegment {
  id: string;
  name: string;
  value2024: number;
  value2025: number;
  value2026E: number;
  value2027E: number;
  value2028E: number;
  growthRate: number;
  unit: string;
  description: string;
  status: 'booming' | 'growing' | 'stable' | 'declining';
}

export interface SupplySegment {
  id: string;
  name: string;
  value2024: number;
  value2025: number;
  value2026E: number;
  value2027E: number;
  value2028E: number;
  growthRate: number;
  unit: string;
  costRange: string;
  description: string;
  status: 'expanding' | 'stable' | 'constrained' | 'declining';
}

export interface BalanceData {
  year: string;
  demand: number;
  supply: number;
  balance: number;
  priceLow: number;
  priceHigh: number;
}

export interface MonthlyData {
  month: string;
  demand: number;
  supply: number;
  inventory: number;
  price: number;
}

export interface AlertItem {
  id: string;
  date: string;
  category: 'demand' | 'supply' | 'price' | 'policy';
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AppData {
  demandSegments: DemandSegment[];
  supplySegments: SupplySegment[];
  balanceHistory: BalanceData[];
  monthlyTrend: MonthlyData[];
  alerts: AlertItem[];
  lastUpdated: string;
}
