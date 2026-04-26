import { useLithiumData } from '@/hooks/useLithiumData';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function PriceTrend() {
  const { data } = useLithiumData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-sm">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-medium">{p.value}{p.name === '碳酸锂价格' ? ' 万元/吨' : ' 万吨'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-4">
      <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        碳酸锂价格 & 库存趋势
      </h2>
      <p className="text-xs text-slate-500 mb-3">月度跟踪数据：价格走势与社会库存变化</p>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
          <YAxis yAxisId="price" tick={{ fontSize: 10 }} label={{ value: '价格(万元/吨)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
          <YAxis yAxisId="inventory" orientation="right" tick={{ fontSize: 10 }} label={{ value: '库存(万吨)', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area yAxisId="inventory" type="monotone" dataKey="inventory" name="社会库存" fill="#E8F5E9" stroke="#43A047" strokeWidth={2} />
          <Line yAxisId="price" type="monotone" dataKey="price" name="碳酸锂价格" stroke="#E53935" strokeWidth={2.5} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
        {(() => {
          const latest = data.monthlyTrend[data.monthlyTrend.length - 1];
          const prev = data.monthlyTrend[data.monthlyTrend.length - 2];
          const priceChange = ((latest.price - prev.price) / prev.price * 100).toFixed(1);
          const invChange = ((latest.inventory - prev.inventory) / Math.abs(prev.inventory) * 100).toFixed(1);
          return (
            <>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-0.5">最新价格 ({latest.month})</div>
                <div className="text-xl font-bold text-red-600">{latest.price}</div>
                <div className="text-xs text-slate-400">万元/吨</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-0.5">环比变化</div>
                <div className={`text-xl font-bold ${Number(priceChange) >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {Number(priceChange) >= 0 ? '+' : ''}{priceChange}%
                </div>
                <div className="text-xs text-slate-400">较上月</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-0.5">社会库存</div>
                <div className="text-xl font-bold text-blue-700">{latest.inventory}</div>
                <div className="text-xs text-slate-400">万吨 ({Number(invChange) >= 0 ? '+' : ''}{invChange}%)</div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
