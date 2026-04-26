import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { Building2, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type ForecastYear = '2026' | '2027' | '2028';
type BiasKey = 'bullish' | 'neutral' | 'bearish';

// 机构预测数据
const institutionData = [
  {
    id: 'ubs',
    name: 'UBS（瑞银）',
    country: '瑞士',
    type: '投行',
    credibility: 5,
    forecasts: {
      '2026': { demand: 215, supply: 192, balance: -23, priceLow: 24000, priceHigh: 28000, priceUnit: 'USD/吨' },
      '2027': { demand: 258, supply: 215, balance: -43, priceLow: 26000, priceHigh: 32000, priceUnit: 'USD/吨' },
      '2028': { demand: 310, supply: 245, balance: -65, priceLow: 28000, priceHigh: 35000, priceUnit: 'USD/吨' },
    },
    keyAssumptions: [
      '储能需求超预期，2026年全球储能出货801GWh',
      '津巴布韦出口禁令2027年全面生效，供给受限',
      '2027年后绿地项目稀缺，供给增速放缓至12-15%',
    ],
    bias: 'bullish' as const,
    updateDate: '2026-03',
  },
  {
    id: 'ms',
    name: 'Morgan Stanley（摩根士丹利）',
    country: '美国',
    type: '投行',
    credibility: 5,
    forecasts: {
      '2026': { demand: 200, supply: 192, balance: -8, priceLow: 11432, priceHigh: 28580, priceUnit: 'USD/吨' },
      '2027': { demand: 240, supply: 220, balance: -20, priceLow: 15000, priceHigh: 30000, priceUnit: 'USD/吨' },
      '2028': { demand: 285, supply: 255, balance: -30, priceLow: 18000, priceHigh: 32000, priceUnit: 'USD/吨' },
    },
    keyAssumptions: [
      '需求预测相对保守，动力电池增速放缓',
      '供给端考虑了更多复产产能（Core Lithium、Pilbara Ngungaju）',
      '价格区间较宽，反映不确定性',
    ],
    bias: 'neutral' as const,
    updateDate: '2026-02',
  },
  {
    id: 'huatai',
    name: '华泰证券',
    country: '中国',
    type: '券商',
    credibility: 4,
    forecasts: {
      '2026': { demand: 215, supply: 216.2, balance: 1.2, priceLow: 80000, priceHigh: 90000, priceUnit: 'CNY/吨' },
      '2027': { demand: 258, supply: 245, balance: -13, priceLow: 100000, priceHigh: 120000, priceUnit: 'CNY/吨' },
      '2028': { demand: 310, supply: 270, balance: -40, priceLow: 120000, priceHigh: 150000, priceUnit: 'CNY/吨' },
    },
    keyAssumptions: [
      '2026年供需紧平衡，价格中枢8-9万元/吨（偏保守）',
      '国内需求增速换挡，但海外增量覆盖',
      '供给端考虑了江西锂云母复产',
    ],
    bias: 'bearish' as const,
    updateDate: '2026-04',
  },
  {
    id: 'guolian',
    name: '国联期货',
    country: '中国',
    type: '期货',
    credibility: 4,
    forecasts: {
      '2026': { demand: 214, supply: 203, balance: -11, priceLow: 170000, priceHigh: 190000, priceUnit: 'CNY/吨' },
      '2027': { demand: 258, supply: 230, balance: -28, priceLow: 180000, priceHigh: 220000, priceUnit: 'CNY/吨' },
      '2028': { demand: 310, supply: 255, balance: -55, priceLow: 200000, priceHigh: 250000, priceUnit: 'CNY/吨' },
    },
    keyAssumptions: [
      '储能爆发是最大超预期来源（+111.8% YoY）',
      '供给端扰动频繁（津巴布韦禁令、江西停产）',
      '库存结构性去化，2026年缺口扩大',
    ],
    bias: 'bullish' as const,
    updateDate: '2026-04',
  },
  {
    id: 'woodmac',
    name: 'Wood Mackenzie',
    country: '英国',
    type: '咨询',
    credibility: 5,
    forecasts: {
      '2026': { demand: 210, supply: 205, balance: -5, priceLow: 20000, priceHigh: 25000, priceUnit: 'USD/吨' },
      '2027': { demand: 250, supply: 235, balance: -15, priceLow: 22000, priceHigh: 28000, priceUnit: 'USD/吨' },
      '2028': { demand: 295, supply: 265, balance: -30, priceLow: 24000, priceHigh: 30000, priceUnit: 'USD/吨' },
    },
    keyAssumptions: [
      '需求和供给预测均处于中性水平',
      '考虑了技术进步对单位锂耗的影响',
      '价格预测相对温和',
    ],
    bias: 'neutral' as const,
    updateDate: '2026-01',
  },
];

const biasConfig = {
  bullish: { label: '看多', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300', icon: TrendingUp },
  neutral: { label: '中性', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', icon: AlertCircle },
  bearish: { label: '看空', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300', icon: XCircle },
};

export default function InstitutionForecast() {
  const [selectedYear, setSelectedYear] = useState<ForecastYear>('2026');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');

  // 准备对比数据
  const comparisonData = institutionData.map(inst => ({
    name: inst.name,
    demand: inst.forecasts[selectedYear].demand,
    supply: inst.forecasts[selectedYear].supply,
    balance: inst.forecasts[selectedYear].balance,
  }));

  // 价格预测对比
  const priceData = institutionData.map(inst => {
    const forecast = inst.forecasts[selectedYear];
    // 统一转换为人民币（假设汇率7.2）
    const rate = forecast.priceUnit === 'USD/吨' ? 7.2 : 1;
    return {
      name: inst.name,
      low: Math.round(forecast.priceLow * rate / 10000),
      high: Math.round(forecast.priceHigh * rate / 10000),
      mid: Math.round((forecast.priceLow + forecast.priceHigh) / 2 * rate / 10000),
    };
  });

  // 供需平衡趋势
  const trendData = ['2026', '2027', '2028'].map(year => {
    const yearData: any = { year };
    institutionData.forEach(inst => {
      yearData[inst.id] = inst.forecasts[year as ForecastYear].balance;
    });
    return yearData;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white border-2 border-slate-300 rounded-lg p-3 shadow-xl text-sm">
        <div className="font-bold mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-medium">{p.value} 万吨</span>
          </div>
        ))}
      </div>
    );
  };

  const filteredInstitutions = selectedInstitution === 'all'
    ? institutionData
    : institutionData.filter(inst => inst.id === selectedInstitution);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-emerald-700" />
              主流机构预测对比
            </h2>
            <p className="text-sm text-slate-500 mt-1">UBS · Morgan Stanley · 华泰证券 · 国联期货 · Wood Mackenzie</p>
          </div>
          <div className="flex gap-2">
              {(['2026', '2027', '2028'] as ForecastYear[]).map(year => (
              <button
                key={year}
                  onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${selectedYear === year ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="text-sm text-emerald-700 font-semibold mb-1">看多机构</div>
            <div className="text-3xl font-bold text-emerald-800">
              {institutionData.filter(i => i.bias === 'bullish').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {institutionData.filter(i => i.bias === 'bullish').map(i => i.name.split('（')[0]).join('、')}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="text-sm text-blue-700 font-semibold mb-1">中性机构</div>
            <div className="text-3xl font-bold text-blue-800">
              {institutionData.filter(i => i.bias === 'neutral').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {institutionData.filter(i => i.bias === 'neutral').map(i => i.name.split('（')[0]).join('、')}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="text-sm text-red-700 font-semibold mb-1">看空机构</div>
            <div className="text-3xl font-bold text-red-800">
              {institutionData.filter(i => i.bias === 'bearish').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {institutionData.filter(i => i.bias === 'bearish').map(i => i.name.split('（')[0]).join('、')}
            </div>
          </div>
        </div>
      </div>

      {/* Supply-Demand Balance Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedYear}年供需平衡预测对比</h3>
        <p className="text-xs text-slate-500 mb-4">单位：万吨LCE | 负值表示供给缺口</p>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
            <Bar dataKey="demand" name="需求" fill="#1565C0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="supply" name="供给" fill="#43A047" radius={[4, 4, 0, 0]} />
            <Bar dataKey="balance" name="平衡" fill="#E53935" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Price Forecast Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedYear}年价格预测对比</h3>
        <p className="text-xs text-slate-500 mb-4">单位：万元/吨（人民币） | 已统一汇率换算</p>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '万元/吨', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
            <Tooltip
              content={({ active, payload }: any) => {
                if (!active || !payload) return null;
                const data = payload[0]?.payload;
                return (
                  <div className="bg-white border-2 border-slate-300 rounded-lg p-3 shadow-xl text-sm">
                    <div className="font-bold mb-2">{data.name}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-600">低点</span>
                        <span className="font-bold text-emerald-700">{data.low} 万元/吨</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-600">中值</span>
                        <span className="font-bold text-blue-700">{data.mid} 万元/吨</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-600">高点</span>
                        <span className="font-bold text-red-700">{data.high} 万元/吨</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="low" name="低点" fill="#43A047" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mid" name="中值" fill="#1565C0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="high" name="高点" fill="#E53935" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Balance Trend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">供需平衡趋势（2026-2028）</h3>
        <p className="text-xs text-slate-500 mb-4">各机构对未来三年供需缺口的预测演变</p>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '供需平衡（万吨）', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="#000" strokeWidth={2} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="ubs" name="UBS" stroke="#1B5E20" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ms" name="Morgan Stanley" stroke="#1565C0" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="huatai" name="华泰证券" stroke="#C62828" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="guolian" name="国联期货" stroke="#6A1B9A" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="woodmac" name="Wood Mackenzie" stroke="#EF6C00" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Institution Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">机构详细观点</h3>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">全部机构</option>
            {institutionData.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
        </div>

        {filteredInstitutions.map(inst => {
          const cfg = biasConfig[inst.bias as BiasKey];
          const Icon = cfg.icon;
          return (
            <div key={inst.id} className={`${cfg.bgColor} ${cfg.borderColor} border-2 rounded-xl p-5`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-slate-900">{inst.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.bgColor} ${cfg.color} border ${cfg.borderColor}`}>
                      <Icon className="w-3 h-3 inline mr-1" />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span>{inst.country} · {inst.type}</span>
                    <span>更新：{inst.updateDate}</span>
                    <span className="flex items-center gap-1">
                      可信度：
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < inst.credibility ? 'text-yellow-500' : 'text-slate-300'}>★</span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {(['2026', '2027', '2028'] as ForecastYear[]).map(year => {
                  const forecast = inst.forecasts[year];
                  return (
                    <div key={year} className="bg-white/70 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500 mb-2 font-semibold">{year}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">需求</span>
                          <span className="font-bold text-blue-700">{forecast.demand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">供给</span>
                          <span className="font-bold text-green-700">{forecast.supply}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">平衡</span>
                          <span className={`font-bold ${forecast.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {forecast.balance >= 0 ? '+' : ''}{forecast.balance}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/70 rounded-lg p-3 border border-slate-200">
                <div className="text-xs font-semibold text-slate-700 mb-2">核心假设</div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {inst.keyAssumptions.map((assumption, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Analysis */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-600" />
          市场共识与分歧
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/80 rounded-lg p-4">
            <div className="font-bold text-emerald-800 mb-2">✓ 市场共识</div>
            <ul className="space-y-1 text-slate-700 text-xs">
              <li>• 2026年供需处于紧平衡至轻度短缺状态</li>
              <li>• 2027年后供需缺口显著扩大（-15至-65万吨）</li>
              <li>• 储能是最大超预期来源，增速20%+</li>
              <li>• 供给端扰动频繁（津巴布韦、江西）</li>
              <li>• 锂价中枢上移至15-20万元/吨区间</li>
            </ul>
          </div>
          <div className="bg-white/80 rounded-lg p-4">
            <div className="font-bold text-red-800 mb-2">✗ 主要分歧</div>
            <ul className="space-y-1 text-slate-700 text-xs">
              <li>• <strong>需求增速</strong>：UBS最乐观（215万吨），MS最保守（200万吨）</li>
              <li>• <strong>供给弹性</strong>：华泰认为2026年供给充足（216万吨），UBS认为受限（192万吨）</li>
              <li>• <strong>价格预测</strong>：国联期货最高（17-19万元），华泰最低（8-9万元）</li>
              <li>• <strong>复产速度</strong>：MS考虑了更多复产产能，UBS更谨慎</li>
              <li>• <strong>AIDC储能</strong>：分歧最大，从"概念炒作"到"确定性增量"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
