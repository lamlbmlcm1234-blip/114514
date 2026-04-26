import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ScatterChart, Scatter, ZAxis } from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, Info } from 'lucide-react';

// 成本曲线数据 - 按成本从低到高排序
const costCurveData = [
  // 盐湖提锂 - 成本最低
  {
    id: 'yhgf',
    name: '盐湖股份',
    type: '盐湖提锂',
    capacity: 8,
    cost: 4,
    costRange: '3-5',
    cumulative: 8,
    status: 'excellent',
    company: '盐湖股份',
    location: '青海',
    tech: '盐湖卤水提锂',
  },
  {
    id: 'sqm',
    name: 'SQM',
    type: '盐湖提锂',
    capacity: 21,
    cost: 4.5,
    costRange: '4-5',
    cumulative: 29,
    status: 'excellent',
    company: 'SQM',
    location: '智利',
    tech: '盐湖卤水提锂',
  },
  {
    id: 'alb',
    name: 'Albemarle',
    type: '盐湖提锂',
    capacity: 18,
    cost: 4.8,
    costRange: '4-5.5',
    cumulative: 47,
    status: 'excellent',
    company: 'Albemarle',
    location: '智利',
    tech: 'DLE技术',
  },

  // 锂辉石 - 成本中等
  {
    id: 'greenbushes',
    name: 'Greenbushes',
    type: '锂辉石',
    capacity: 35,
    cost: 6,
    costRange: '5-7',
    cumulative: 82,
    status: 'good',
    company: '天齐锂业',
    location: '澳洲',
    tech: '硬岩矿开采',
  },
  {
    id: 'pilbara',
    name: 'Pilbara',
    type: '锂辉石',
    capacity: 28,
    cost: 6.5,
    costRange: '5.5-7.5',
    cumulative: 110,
    status: 'good',
    company: 'Pilbara',
    location: '澳洲',
    tech: '硬岩矿开采',
  },
  {
    id: 'mrl',
    name: 'MRL',
    type: '锂辉石',
    capacity: 15,
    cost: 7,
    costRange: '6-8',
    cumulative: 125,
    status: 'good',
    company: 'Mineral Resources',
    location: '澳洲',
    tech: '硬岩矿开采',
  },

  // 电池回收 - 成本中等偏低
  {
    id: 'glm',
    name: '格林美',
    type: '电池回收',
    capacity: 5,
    cost: 5.5,
    costRange: '4-7',
    cumulative: 130,
    status: 'growing',
    company: '格林美',
    location: '中国',
    tech: '湿法回收',
  },
  {
    id: 'tqgf',
    name: '天奇股份',
    type: '电池回收',
    capacity: 3,
    cost: 6,
    costRange: '5-7',
    cumulative: 133,
    status: 'growing',
    company: '天奇股份',
    location: '中国',
    tech: '火法+湿法',
  },

  // 非洲锂矿
  {
    id: 'bikita',
    name: 'Bikita',
    type: '非洲锂矿',
    capacity: 12,
    cost: 7.5,
    costRange: '6-9',
    cumulative: 145,
    status: 'constrained',
    company: '中矿资源',
    location: '津巴布韦',
    tech: '硬岩矿开采',
  },
  {
    id: 'manono',
    name: 'Manono',
    type: '非洲锂矿',
    capacity: 8,
    cost: 8,
    costRange: '7-9',
    cumulative: 153,
    status: 'constrained',
    company: 'AVZ Minerals',
    location: '刚果(金)',
    tech: '硬岩矿开采',
  },

  // 锂云母 - 成本最高
  {
    id: 'yxcl',
    name: '永兴材料',
    type: '锂云母',
    capacity: 8,
    cost: 10,
    costRange: '8-12',
    cumulative: 161,
    status: 'marginal',
    company: '永兴材料',
    location: '江西宜春',
    tech: '锂云母提锂',
  },
  {
    id: 'jtdj',
    name: '江特电机',
    type: '锂云母',
    capacity: 6,
    cost: 11,
    costRange: '9-13',
    cumulative: 167,
    status: 'marginal',
    company: '江特电机',
    location: '江西宜春',
    tech: '锂云母提锂',
  },

  // 南美新项目
  {
    id: 'cauchari',
    name: 'Cauchari',
    type: '南美盐湖',
    capacity: 12,
    cost: 5,
    costRange: '4-6',
    cumulative: 179,
    status: 'expanding',
    company: 'Lithium Americas',
    location: '阿根廷',
    tech: '盐湖卤水提锂',
  },

  // 北美项目 - 成本高但战略意义大
  {
    id: 'thacker',
    name: 'Thacker Pass',
    type: '北美锂矿',
    capacity: 8,
    cost: 10,
    costRange: '8-12',
    cumulative: 187,
    status: 'expanding',
    company: 'Lithium Americas',
    location: '美国内华达',
    tech: '黏土矿提锂',
  },
];

// 价格参考线数据
const priceLines = [
  { price: 7, label: '2025年低点', color: '#EF5350' },
  { price: 17, label: '2026年当前价', color: '#66BB6A' },
  { price: 20, label: '2026年高点预测', color: '#42A5F5' },
];

const statusConfig = {
  excellent: { label: '优秀', color: '#1B5E20', bgColor: '#E8F5E9' },
  good: { label: '良好', color: '#2E7D32', bgColor: '#F1F8E9' },
  growing: { label: '成长', color: '#1565C0', bgColor: '#E3F2FD' },
  expanding: { label: '扩产', color: '#6A1B9A', bgColor: '#F3E5F5' },
  constrained: { label: '受限', color: '#EF6C00', bgColor: '#FFF3E0' },
  marginal: { label: '边际', color: '#C62828', bgColor: '#FFEBEE' },
};

const typeColors = {
  '盐湖提锂': '#1B5E20',
  '锂辉石': '#1565C0',
  '电池回收': '#6A1B9A',
  '非洲锂矿': '#EF6C00',
  '锂云母': '#C62828',
  '南美盐湖': '#00897B',
  '北美锂矿': '#5E35B1',
};

type CostCurveItem = typeof costCurveData[number];

export default function CostCurve() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredData = useMemo(
    () => (selectedType === 'all' ? costCurveData : costCurveData.filter(d => d.type === selectedType)),
    [selectedType],
  );

  // 重新计算筛选后的累计产能，保证图表和表格使用同一口径。
  const curveData = useMemo(
    () => filteredData.reduce<((CostCurveItem & { cumulativeStart: number; cumulative: number })[])>((acc, item) => {
      const cumulativeStart = acc.length === 0 ? 0 : acc[acc.length - 1].cumulative;
      acc.push({
        ...item,
        cumulativeStart,
        cumulative: cumulativeStart + item.capacity,
      });
      return acc;
    }, []),
    [filteredData],
  );

  const selectedProject = useMemo(
    () => costCurveData.find(item => item.id === showDetails) ?? null,
    [showDetails],
  );

  useEffect(() => {
    if (showDetails && !filteredData.some(item => item.id === showDetails)) {
      setShowDetails(null);
    }
  }, [filteredData, showDetails]);

  const totalCapacity = filteredData.reduce((sum, item) => sum + item.capacity, 0);
  const averageCost = filteredData.length > 0
    ? (filteredData.reduce((sum, item) => sum + item.cost, 0) / filteredData.length).toFixed(1)
    : '0';
  const maxCost = Math.max(...filteredData.map(item => item.cost), ...priceLines.map(line => line.price)) + 2;
  const maxCumulative = Math.max(...curveData.map(item => item.cumulative), 0) + 10;
  const visibleTypes = Object.entries(typeColors).filter(([type]) => filteredData.some(item => item.type === type));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white border-2 border-slate-300 rounded-xl p-3 shadow-xl text-sm max-w-[280px]">
        <div className="font-bold text-base mb-2 text-slate-900">{data.name}</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">类型</span>
            <span className="font-semibold" style={{ color: typeColors[data.type as keyof typeof typeColors] }}>
              {data.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">成本区间</span>
            <span className="font-bold text-slate-900">{data.costRange} 万元/吨</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">产能</span>
            <span className="font-bold text-slate-900">{data.capacity} 万吨LCE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">累计产能</span>
            <span className="font-bold text-slate-900">{data.cumulative} 万吨LCE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">企业</span>
            <span className="font-semibold text-slate-900">{data.company}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">位置</span>
            <span className="text-slate-700">{data.location}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-emerald-700" />
              全球锂资源供给成本曲线
            </h2>
            <p className="text-sm text-slate-500 mt-1">成本竞争力分析 · 边际供给识别 · 盈利能力评估</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${selectedType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              全部
            </button>
            {Object.keys(typeColors).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all`}
                style={{
                  backgroundColor: selectedType === type ? typeColors[type as keyof typeof typeColors] : '#f1f5f9',
                  color: selectedType === type ? 'white' : '#64748b',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              当前样本
            </div>
            <div className="text-2xl font-bold text-emerald-800">{filteredData.length} 个项目</div>
            <div className="text-slate-600">{selectedType === 'all' ? '覆盖全部供给类型' : `仅查看 ${selectedType}`}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-1 text-blue-700 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              合计产能
            </div>
            <div className="text-2xl font-bold text-blue-800">{totalCapacity} 万吨</div>
            <div className="text-slate-600">按当前筛选口径重新汇总</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-1 text-red-700 font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              平均成本
            </div>
            <div className="text-2xl font-bold text-red-800">{averageCost} 万元</div>
            <div className="text-slate-600">和 17 万现价参考线对比更直观</div>
          </div>
        </div>
      </div>

      {/* Cost Curve Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">成本曲线图（阶梯图）</h3>
        <p className="text-xs text-slate-500 mb-4">横轴：累计产能 | 纵轴：生产成本 | 颜色：供给类型 | 点击柱体查看项目详情</p>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={curveData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="cumulative"
              label={{ value: '累计产能（万吨LCE）', position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              label={{ value: '生产成本（万元/吨）', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tick={{ fontSize: 11 }}
              domain={[0, maxCost]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Price reference lines */}
            {priceLines.map(line => (
              <ReferenceLine
                key={line.price}
                y={line.price}
                stroke={line.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: line.label, position: 'right', fill: line.color, fontSize: 11, fontWeight: 600 }}
              />
            ))}

            <Bar dataKey="cost" radius={[4, 4, 0, 0]} onClick={(data: CostCurveItem) => setShowDetails(data.id)} cursor="pointer">
              {curveData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={typeColors[entry.type as keyof typeof typeColors]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          {visibleTypes.map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="text-slate-700">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scatter Chart - Cost vs Capacity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">成本-产能散点图</h3>
        <p className="text-xs text-slate-500 mb-4">气泡大小 = 产能规模 | 颜色 = 供给类型 | 点击气泡查看详情</p>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="cumulative"
              name="累计产能"
              label={{ value: '累计产能（万吨LCE）', position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
              tick={{ fontSize: 11 }}
              domain={[0, maxCumulative]}
            />
            <YAxis
              type="number"
              dataKey="cost"
              name="成本"
              label={{ value: '生产成本（万元/吨）', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tick={{ fontSize: 11 }}
              domain={[0, maxCost]}
            />
            <ZAxis type="number" dataKey="capacity" range={[100, 1000]} name="产能" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

            {/* Price reference lines */}
            {priceLines.map(line => (
              <ReferenceLine
                key={line.price}
                y={line.price}
                stroke={line.color}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            ))}

            {visibleTypes.map(([type, color]) => (
              <Scatter
                key={type}
                name={type}
                data={curveData.filter(d => d.type === type)}
                fill={color}
                onClick={(point: CostCurveItem) => setShowDetails(point.id)}
                cursor="pointer"
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Detail Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">项目详情</h3>
            <p className="text-xs text-slate-500 mt-1">点击上方图表柱体、气泡或下方表格行即可切换详情</p>
          </div>
          {selectedProject && (
            <button
              onClick={() => setShowDetails(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
            >
              收起详情
            </button>
          )}
        </div>

        {selectedProject ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{selectedProject.name}</h4>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: typeColors[selectedProject.type as keyof typeof typeColors] }}
                  >
                    {selectedProject.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{selectedProject.company} · {selectedProject.location}</p>
              </div>
              <div
                className="px-3 py-2 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: statusConfig[selectedProject.status as keyof typeof statusConfig].bgColor,
                  color: statusConfig[selectedProject.status as keyof typeof statusConfig].color,
                }}
              >
                {statusConfig[selectedProject.status as keyof typeof statusConfig].label}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">单吨成本</div>
                <div className="text-xl font-bold text-slate-900">{selectedProject.cost} 万元</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">成本区间</div>
                <div className="text-xl font-bold text-slate-900">{selectedProject.costRange} 万元</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">产能规模</div>
                <div className="text-xl font-bold text-slate-900">{selectedProject.capacity} 万吨</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">17万价差</div>
                <div className={`text-xl font-bold ${17 - selectedProject.cost >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {17 - selectedProject.cost >= 0 ? '+' : ''}{(17 - selectedProject.cost).toFixed(1)} 万元
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500 mb-2">技术路线</div>
                <div className="font-semibold text-slate-900">{selectedProject.tech}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500 mb-2">投资提示</div>
                <div className="text-slate-700">
                  {selectedProject.cost <= 6
                    ? '处于全球低成本曲线前沿，对锂价下行更具韧性。'
                    : selectedProject.cost <= 8
                      ? '属于主力供给区间，盈利受锂价波动影响但仍具备供给弹性。'
                      : '已接近边际供给区间，更依赖价格上行与政策支持。'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
            暂未选中项目，点击上方图表或下方表格行即可查看明细。
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">成本明细表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700">项目</th>
                <th className="text-left p-3 font-semibold text-slate-700">类型</th>
                <th className="text-left p-3 font-semibold text-slate-700">企业</th>
                <th className="text-left p-3 font-semibold text-slate-700">位置</th>
                <th className="text-right p-3 font-semibold text-slate-700">成本区间</th>
                <th className="text-right p-3 font-semibold text-slate-700">产能</th>
                <th className="text-right p-3 font-semibold text-slate-700">累计产能</th>
                <th className="text-center p-3 font-semibold text-slate-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => setShowDetails(item.id)}
                  className={`border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                    showDetails === item.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="p-3 font-medium text-slate-900">{item.name}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: typeColors[item.type as keyof typeof typeColors] }}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{item.company}</td>
                  <td className="p-3 text-slate-600">{item.location}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{item.costRange} 万元/吨</td>
                  <td className="p-3 text-right font-semibold text-slate-900">{item.capacity} 万吨</td>
                  <td className="p-3 text-right text-slate-700">{curveData.find(d => d.id === item.id)?.cumulative ?? item.cumulative} 万吨</td>
                  <td className="p-3 text-center">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: statusConfig[item.status as keyof typeof statusConfig].bgColor,
                        color: statusConfig[item.status as keyof typeof statusConfig].color,
                      }}
                    >
                      {statusConfig[item.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          成本曲线分析要点
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/80 rounded-lg p-4">
            <div className="font-bold text-emerald-800 mb-2">✓ 低成本供给（3-7万元/吨）</div>
            <ul className="space-y-1 text-slate-700 text-xs">
              <li>• 盐湖提锂：成本最低（3-5万），但扩产周期长（7-10年）</li>
              <li>• 锂辉石矿：主力供给（5-8万），澳洲资源禀赋优异</li>
              <li>• 电池回收：成本中等（4-7万），2026年后快速增长</li>
              <li>• <strong>当前锂价17万元/吨，低成本矿山吨毛利10-14万元</strong></li>
            </ul>
          </div>
          <div className="bg-white/80 rounded-lg p-4">
            <div className="font-bold text-red-800 mb-2">✗ 高成本供给（8-12万元/吨）</div>
            <ul className="space-y-1 text-slate-700 text-xs">
              <li>• 锂云母：成本最高（8-12万），环保压力大</li>
              <li>• 非洲锂矿：政策风险（津巴布韦出口禁令）</li>
              <li>• 北美项目：战略意义&gt;经济意义，享受IRA补贴</li>
              <li>• <strong>锂价跌破10万元/吨时，边际供给将退出</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
