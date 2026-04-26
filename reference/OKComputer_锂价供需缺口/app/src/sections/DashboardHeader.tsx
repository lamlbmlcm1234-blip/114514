import { useLithiumData } from '@/hooks/useLithiumData';
import { TrendingUp, TrendingDown, Scale, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  const { data, updateLastUpdated } = useLithiumData();
  const totalDemand2026 = data.demandSegments.reduce((s, d) => s + d.value2026E, 0);
  const totalSupply2026 = data.supplySegments.reduce((s, d) => s + d.value2026E, 0);
  const balance2026 = totalSupply2026 - totalDemand2026;
  const currentPrice = data.monthlyTrend[data.monthlyTrend.length - 1]?.price ?? 17;
  const prevPrice = data.monthlyTrend[data.monthlyTrend.length - 2]?.price ?? 16.2;
  const priceChange = ((currentPrice - prevPrice) / prevPrice * 100).toFixed(1);

  const highAlerts = data.alerts.filter(a => a.impact === 'high').length;

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-7 h-7 text-emerald-700" />
            碳酸锂供需格局跟踪
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            实时跟踪全球锂资源供需变化 | 最后更新：{data.lastUpdated}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={updateLastUpdated}
          className="self-start lg:self-auto"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          更新日期
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">2026E 总需求</div>
          <div className="text-2xl font-bold text-slate-900">{totalDemand2026.toFixed(1)}</div>
          <div className="text-xs text-slate-500">万吨 LCE</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">2026E 总供给</div>
          <div className="text-2xl font-bold text-slate-900">{totalSupply2026.toFixed(1)}</div>
          <div className="text-xs text-slate-500">万吨 LCE</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Scale className="w-3 h-3" />
            供需平衡
          </div>
          <div className={`text-2xl font-bold ${balance2026 >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {balance2026 >= 0 ? '+' : ''}{balance2026.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">万吨 LCE</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">碳酸锂价格</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-slate-900">{currentPrice}</div>
            <div className={`text-xs font-semibold flex items-center ${Number(priceChange) >= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {Number(priceChange) >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {Number(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </div>
          </div>
          <div className="text-xs text-slate-500">万元/吨</div>
        </div>
      </div>

      {highAlerts > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700 font-medium">
            当前有 {highAlerts} 项高影响预警，请密切关注供给端扰动和需求端变化
          </span>
        </div>
      )}
    </div>
  );
}
