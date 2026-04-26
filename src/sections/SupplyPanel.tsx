import { useLithiumData } from '@/hooks/useLithiumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';

const SEGMENTS = [
  {
    id: 'spodumene', name: '锂辉石矿', sub: '澳洲/非洲硬岩锂矿，供给主力', color: '#0D47A1',
    assumption: 'Greenbushes CGP3 2026年爬坡，长期266万吨精矿/年；Pilbara FY26指引82-87万吨，Ngungaju 4个月可重启；Core Lithium 2026年5月重启Finniss。2027年后绿地项目稀缺。',
  },
  {
    id: 'salt_lake', name: '盐湖提锂', sub: '全球成本最低路线', color: '#1565C0',
    assumption: '盐湖股份8万吨产能，收率82.4%；SQM 21万吨→2030年30万吨；Albemarle 31亿美元DLE技术，回收率94%。扩产周期7-10年但成本极稳定。',
  },
  {
    id: 'africa_mine', name: '非洲锂矿', sub: '中资主导新兴供给', color: '#1976D2',
    assumption: '中矿Bikita精矿32.8万吨/年；津巴布韦2026年4月配额制，2027年1月全面禁止精矿出口；倒逼中资本地建冶炼厂，不改变全球总量但改变贸易流。',
  },
  {
    id: 'south_america', name: '南美盐湖', sub: '阿根廷绿地项目释放', color: '#1E88E5',
    assumption: '阿根廷Cauchari-Olaroz等2026年集中释放；绿地项目为主，但CAPEX受2023-2025价格低迷影响推迟；长期潜力大但短期爬坡慢。',
  },
  {
    id: 'lepidolite', name: '锂云母', sub: '江西高成本路线', color: '#42A5F5',
    assumption: '成本8-12万元/吨，7-10万价格时部分矿山亏损停产；17万价格下恢复盈利但弹性弱于盐湖和锂辉石；面临环保和采矿证政策扰动。',
  },
  {
    id: 'recycling', name: '锂电池回收', sub: '退役电池回收利用', color: '#64B5F6',
    assumption: '动力电池退役高峰来临，2026年退役量预计80GWh。格林美、天奇股份等企业回收产能快速扩张。回收锂成本低于原生锂。',
  },
  {
    id: 'north_america', name: '北美锂矿', sub: 'IRA法案推动本土化', color: '#90CAF9',
    assumption: 'IRA法案推动本土供应链建设。Thacker Pass（Lithium Americas）2026年投产，Salton Sea地热提锂试点。成本高但享受政策补贴。',
  },
  {
    id: 'europe_mine', name: '欧洲锂矿', sub: '关键原材料法案驱动', color: '#BBDEFB',
    assumption: '塞尔维亚Jadar项目、葡萄牙锂矿等。环保审批严格，建设周期长。欧盟《关键原材料法案》要求2030年本土供应占比10%。',
  },
  {
    id: 'seawater', name: '海水提锂', sub: '实验阶段新技术', color: '#E3F2FD',
    assumption: '沙特KAUST、中国天津大学等研究机构试点。海水锂浓度仅0.17ppm，提取成本极高。2026年前仍处于实验室阶段。',
  },
];

const YEAR_KEYS = ['value2025', 'value2026E', 'value2027E', 'value2028E'] as const;
const YEAR_LABELS = ['2025', '2026E', '2027E', '2028E'];

export default function SupplyPanel() {
  const { data } = useLithiumData();

  const rows = SEGMENTS.map(info => {
    const d = data.supplySegments.find(s => s.id === info.id);
    if (!d) return null;
    const inc = Math.round(d.value2028E - d.value2025);
    const cagr = d.value2025 > 0 ? Math.round((Math.pow(d.value2028E / d.value2025, 1 / 3) - 1) * 100) : 0;
    return { ...info, ...d, inc, cagr };
  }).filter(Boolean);

  const total2025 = Math.round(data.supplySegments.reduce((s, d) => s + d.value2025, 0));
  const total2028 = Math.round(data.supplySegments.reduce((s, d) => s + d.value2028E, 0));
  const totalInc = total2028 - total2025;

  const incData = rows.filter(r => r!.inc > 0).map(r => ({
    name: r!.name, value: r!.inc, color: r!.color,
  })).sort((a, b) => b.value - a.value);

  const costCurve = rows!.map(r => ({
    name: r!.name,
    low: +r!.costRange.split('-')[0],
    high: +r!.costRange.split('-')[1].replace('万元/吨', '').replace('+', ''),
    color: r!.color,
  })).sort((a, b) => a.low - b.low);
  const maxCostAxis = Math.max(17, ...costCurve.map(item => item.high)) + 2;

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return <text x={x + width + 6} y={y + 13} fill="#555" fontSize={13} fontWeight={600}>+{value}</text>;
  };

  const totals = YEAR_KEYS.map((key, i) => ({
    year: YEAR_LABELS[i],
    val: Math.round(data.supplySegments.reduce((s, d) => s + d[key], 0)),
  }));

  return (
    <div className="space-y-8">
      {/* Total supply cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">碳酸锂总供给预测（万吨LCE）</h3>
        <div className="grid grid-cols-4 gap-5">
          {totals.map((t, i) => {
            const shades = ['bg-blue-50 border-blue-200','bg-blue-100 border-blue-300','bg-blue-200 border-blue-400','bg-blue-300 border-blue-500'];
            return (
              <div key={t.year} className={`${shades[i]} rounded-2xl p-6 text-center border`}>
                <div className="text-sm text-slate-600 mb-2">{t.year}</div>
                <div className="text-4xl font-extrabold text-slate-900">{t.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual cards */}
      {rows!.map(row => (
        <div key={row!.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: row!.color }} />
            <div>
              <h4 className="text-base font-bold text-slate-900">{row!.name}</h4>
              <span className="text-xs text-slate-400">{row!.sub} · 成本 {row!.costRange}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-sm">
            {YEAR_KEYS.map((key, i) => (
              <div key={key} className="text-center">
                <div className="text-xs text-slate-400">{YEAR_LABELS[i]}</div>
                <div className={`font-bold ${i === 1 ? 'text-blue-700' : 'text-slate-700'}`}>{Math.round(row![key])}</div>
              </div>
            ))}
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-400">增量(25→28)</div>
              <div className="font-bold text-blue-700">+{row!.inc}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">CAGR</div>
              <div className="font-bold text-blue-700">{row!.cagr}%</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-600">假设前提：</span>{row!.assumption}
          </div>
        </div>
      ))}

      {/* Cost curve */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">供给成本曲线（2026E）· 红色虚线 = 现价17万元/吨</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costCurve} layout="vertical" margin={{ top: 10, right: 50, left: 10, bottom: 10 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} domain={[0, maxCostAxis]} axisLine={{ stroke: '#e0e0e0' }} tickLine={false} label={{ value: '万元/吨', position: 'insideBottomRight', style: { fontSize: 12, fill: '#999' } }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#333' }} width={100} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 8 }} />
            <ReferenceLine x={17} stroke="#E53935" strokeDasharray="8 4" strokeWidth={2} label={{ value: '现价17万', position: 'top', fill: '#E53935', fontSize: 11 }} />
            <Bar dataKey="high" fill="#E3F2FD" radius={[0, 6, 6, 0]} name="成本上限" />
            <Bar dataKey="low" radius={[0, 6, 6, 0]} name="成本下限">
              {costCurve.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Increment bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">供给增量来源分解（2025 → 2028E，合计 +{totalInc} 万吨）</h3>
        <ResponsiveContainer width="100%" height={260}>
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
