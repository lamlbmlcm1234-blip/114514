import { useLithiumData } from '@/hooks/useLithiumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const SEGMENTS = [
  {
    id: 'power_battery', name: '动力电池', sub: '新能源汽车核心驱动力', color: '#E65100',
    assumption: '全球EV销量2025年2070万辆→2028年3000万辆；中国渗透率40%→55%；海外渗透率15%→28%。国内Q1-21.1%为政策退出一次性冲击，全年仍正增长。',
  },
  {
    id: 'energy_storage', name: '储能电池', sub: '最大超预期来源', color: '#F57C00',
    assumption: '全球储能出货2025年651GWh→2028年1200GWh；中国大储60%+增速；海外非中国占比首超50%；136号文后独立储能成为主力。',
  },
  {
    id: 'heavy_truck', name: '电动重卡', sub: '政策驱动爆发增长', color: '#EF6C00',
    assumption: '国四货车报废更新补贴延续至2026年底；电动化率20.5%→43%；单车带电400kWh；换电模式港口/矿区渗透率提升至35%。',
  },
  {
    id: 'aidc_storage', name: 'AIDC储能', sub: 'AI算力催生新增量', color: '#FFA000',
    assumption: '全球AIDC储能2025年12GWh→2028年100GWh；宁德时代确认与全球科技公司合作；英伟达800V架构将储能列为必备组件。',
  },
  {
    id: 'two_wheeler', name: '电动两轮车', sub: '新国标替换高峰', color: '#FFB300',
    assumption: '新国标2025年9月实施，2026年替换高峰；锂电两轮车出货10GWh→30GWh；东南亚油改电出口增量；脉冲式增长，2027年后回归常态。',
  },
  {
    id: 'consumer_electronics', name: '消费电子', sub: '稳定存量需求', color: '#8D6E63',
    assumption: '智能手机出货量12亿部/年趋于平稳；笔记本锂电渗透率接近饱和；无显著增量亦无下滑风险。',
  },
  {
    id: 'user_storage', name: '用户侧储能', sub: '政策扰动负增长', color: '#FFAB91',
    assumption: '11省取消固定分时电价改为现货定价；峰谷套利模式被打破；Q1新增同比-22.4%；全年可能零增长甚至负增长。',
  },
  {
    id: 'industrial_other', name: '工业及其他', sub: '需求拖累项', color: '#B0BEC5',
    assumption: '润滑脂、玻璃陶瓷等传统工业用锂持续被锂电替代；每年减少0.5-1万吨LCE；结构性下滑不可逆。',
  },
];

const YEAR_KEYS = ['value2025', 'value2026E', 'value2027E', 'value2028E'] as const;
const YEAR_LABELS = ['2025', '2026E', '2027E', '2028E'];

export default function DemandPanel() {
  const { data } = useLithiumData();

  const rows = SEGMENTS.map(info => {
    const d = data.demandSegments.find(s => s.id === info.id);
    if (!d) return null;
    const inc = Math.round(d.value2028E - d.value2025);
    const cagr = d.value2025 > 0 ? Math.round((Math.pow(d.value2028E / d.value2025, 1 / 3) - 1) * 100) : 0;
    return { ...info, ...d, inc, cagr };
  }).filter(Boolean);

  const total2025 = Math.round(data.demandSegments.reduce((s, d) => s + d.value2025, 0));
  const total2028 = Math.round(data.demandSegments.reduce((s, d) => s + d.value2028E, 0));
  const totalInc = total2028 - total2025;

  // Increment bar data
  const incData = rows.filter(r => r!.inc > 0).map(r => ({
    name: r!.name, value: r!.inc, color: r!.color,
  })).sort((a, b) => b.value - a.value);

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return <text x={x + width + 6} y={y + 13} fill="#555" fontSize={13} fontWeight={600}>+{value}</text>;
  };

  // Total cards
  const totals = YEAR_KEYS.map((key, i) => ({
    year: YEAR_LABELS[i],
    val: Math.round(data.demandSegments.reduce((s, d) => s + d[key], 0)),
  }));

  return (
    <div className="space-y-8">
      {/* Total demand cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">碳酸锂总需求预测（万吨LCE）</h3>
        <div className="grid grid-cols-4 gap-5">
          {totals.map((t, i) => {
            const shades = ['bg-orange-50 border-orange-200','bg-orange-100 border-orange-300','bg-orange-200 border-orange-400','bg-orange-300 border-orange-500'];
            return (
              <div key={t.year} className={`${shades[i]} rounded-2xl p-6 text-center border`}>
                <div className="text-sm text-slate-600 mb-2">{t.year}</div>
                <div className="text-4xl font-extrabold text-slate-900">{t.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual segment cards */}
      {rows!.map(row => (
        <div key={row!.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Header: color dot + name + sub */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: row!.color }} />
            <div>
              <h4 className="text-base font-bold text-slate-900">{row!.name}</h4>
              <span className="text-xs text-slate-400">{row!.sub}</span>
            </div>
          </div>

          {/* Data row: 4 years + inc + cagr */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-sm">
            {YEAR_KEYS.map((key, i) => (
              <div key={key} className="text-center">
                <div className="text-xs text-slate-400">{YEAR_LABELS[i]}</div>
                <div className={`font-bold ${i === 1 ? 'text-orange-700' : 'text-slate-700'}`}>{Math.round(row![key])}</div>
              </div>
            ))}
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-400">增量(25→28)</div>
              <div className="font-bold text-orange-700">+{row!.inc}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">CAGR</div>
              <div className="font-bold text-orange-700">{row!.cagr}%</div>
            </div>
          </div>

          {/* Assumption */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-600">假设前提：</span>{row!.assumption}
          </div>
        </div>
      ))}

      {/* Increment horizontal bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">需求增量驱动因素（2025 → 2028E，合计 +{totalInc} 万吨）</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={incData} layout="vertical" margin={{ top: 10, right: 80, left: 10, bottom: 10 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#333' }} width={100} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 8 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {incData.map((e, i) => <Cell key={i} fill={e.color} />)}
              <LabelList content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
