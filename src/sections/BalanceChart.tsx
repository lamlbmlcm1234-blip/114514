import { useLithiumData } from '@/hooks/useLithiumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function BalanceChart() {
  const { data } = useLithiumData();
  const d = data.demandSegments;
  const s = data.supplySegments;

  const c = [
    { year: '2025', dm: Math.round(d.reduce((a, x) => a + x.value2025, 0)), sp: Math.round(s.reduce((a, x) => a + x.value2025, 0)) },
    { year: '2026E', dm: Math.round(d.reduce((a, x) => a + x.value2026E, 0)), sp: Math.round(s.reduce((a, x) => a + x.value2026E, 0)) },
    { year: '2027E', dm: Math.round(d.reduce((a, x) => a + x.value2027E, 0)), sp: Math.round(s.reduce((a, x) => a + x.value2027E, 0)) },
    { year: '2028E', dm: Math.round(d.reduce((a, x) => a + x.value2028E, 0)), sp: Math.round(s.reduce((a, x) => a + x.value2028E, 0)) },
  ];

  const tip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    const dm = payload.find((p: any) => p.dataKey === 'dm')?.value;
    const sp = payload.find((p: any) => p.dataKey === 'sp')?.value;
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg text-sm min-w-[160px]">
        <div className="font-bold text-base mb-2">{label}</div>
        <div className="flex justify-between py-1"><span className="text-slate-500">需求</span><span className="font-bold text-blue-700">{dm} 万吨</span></div>
        <div className="flex justify-between py-1"><span className="text-slate-500">供给</span><span className="font-bold text-emerald-700">{sp} 万吨</span></div>
        <div className="border-t pt-2 mt-1 flex justify-between"><span className="text-slate-500">缺口</span><span className={`font-bold ${sp - dm >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{sp - dm >= 0 ? '+' : ''}{sp - dm} 万吨</span></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Clean grouped bar - NO labels on bars */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">供需缺口预测（2025-2028E）</h3>
        <p className="text-sm text-slate-400 mb-8">蓝色 = 需求 · 绿色 = 供给 · 鼠标悬停查看具体数字</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={c} margin={{ top: 20, right: 20, left: 10, bottom: 10 }} barSize={50}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#333', fontWeight: 600 }} axisLine={{ stroke: '#ddd' }} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: '#999' }} axisLine={false} tickLine={false} />
            <Tooltip content={tip} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <Legend wrapperStyle={{ fontSize: 14, paddingTop: 16 }} formatter={(v: string) => v === 'dm' ? '需求' : '供给'} />
            <ReferenceLine y={0} stroke="#444" strokeWidth={1} />
            <Bar dataKey="dm" name="需求" fill="#1565C0" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sp" name="供给" fill="#43A047" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clean summary cards - wide enough for numbers */}
      <div className="grid grid-cols-4 gap-5">
        {c.map(d => (
          <div key={d.year} className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="text-sm text-slate-500 mb-3">{d.year}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold text-blue-700">{d.dm}</span>
              <span className="text-sm text-slate-400">vs</span>
              <span className="text-2xl font-bold text-emerald-700">{d.sp}</span>
            </div>
            <div className="text-xs text-slate-500">
              缺口 <span className={`font-bold text-sm ${d.sp - d.dm >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{d.sp - d.dm >= 0 ? '+' : ''}{d.sp - d.dm}</span> 万吨
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
