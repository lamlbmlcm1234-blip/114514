import { useMemo, useState } from 'react';
import { Network, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

// 产业链节点数据
const chainData = {
  upstream: [
    { id: 'salt_lake', name: '盐湖提锂', companies: ['盐湖股份', 'SQM', 'Albemarle'], utilization: 85, share: 28, status: 'good', cost: '3-5万元/吨' },
    { id: 'spodumene', name: '锂辉石矿', companies: ['天齐锂业', 'Pilbara', 'Greenbushes'], utilization: 92, share: 45, status: 'good', cost: '5-8万元/吨' },
    { id: 'lepidolite', name: '锂云母', companies: ['永兴材料', '江特电机'], utilization: 65, share: 12, status: 'constrained', cost: '8-12万元/吨' },
    { id: 'recycling', name: '电池回收', companies: ['格林美', '天奇股份'], utilization: 78, share: 8, status: 'growing', cost: '4-7万元/吨' },
  ],
  midstream_cathode: [
    { id: 'lfp', name: '磷酸铁锂', companies: ['湖南裕能', '德方纳米'], utilization: 58, share: 65, status: 'oversupply', margin: '5-8%' },
    { id: 'lmfp', name: '磷酸锰铁锂', companies: ['德方纳米', '容百科技'], utilization: 75, share: 5, status: 'growing', margin: '12-15%' },
    { id: 'ncm', name: '三元正极', companies: ['容百科技', '当升科技'], utilization: 72, share: 30, status: 'moderate', margin: '10-12%' },
  ],
  midstream_other: [
    { id: 'separator', name: '隔膜', companies: ['恩捷股份', '星源材质'], utilization: 82, share: 60, status: 'good', margin: '18%' },
    { id: 'electrolyte', name: '电解液', companies: ['天赐材料', '新宙邦'], utilization: 55, share: 45, status: 'oversupply', margin: '10-15%' },
    { id: 'anode', name: '负极', companies: ['贝特瑞', '璞泰来'], utilization: 62, share: 50, status: 'oversupply', margin: '15-20%' },
  ],
  downstream: [
    { id: 'catl', name: '宁德时代', type: '动力+储能', utilization: 97, share: 39, status: 'excellent', margin: '24%' },
    { id: 'byd', name: '比亚迪', type: '动力+储能', utilization: 88, share: 16, status: 'good', margin: '20%' },
    { id: 'eve', name: '亿纬锂能', type: '储能为主', utilization: 85, share: 8, status: 'moderate', margin: '12%' },
    { id: 'gotion', name: '国轩高科', type: '动力为主', utilization: 75, share: 5, status: 'moderate', margin: '8%' },
  ],
  application: [
    { id: 'ev', name: '新能源汽车', demand: 170, growth: 11, status: 'growing' },
    { id: 'storage', name: '储能系统', demand: 58, growth: 23, status: 'booming' },
    { id: 'consumer', name: '消费电子', demand: 8, growth: 0, status: 'stable' },
  ],
};

const statusConfig = {
  excellent: { label: '优秀', color: 'bg-emerald-600', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  good: { label: '良好', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  growing: { label: '成长', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  moderate: { label: '中等', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  constrained: { label: '受限', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  oversupply: { label: '过剩', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  booming: { label: '爆发', color: 'bg-purple-600', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  stable: { label: '稳定', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
};

const filterConfig = {
  all: { label: '全部节点', match: () => true },
  good: {
    label: '格局好',
    match: (status: string) => ['excellent', 'good', 'growing', 'booming'].includes(status),
  },
  oversupply: {
    label: '产能过剩',
    match: (status: string) => status === 'oversupply',
  },
} as const;

type ChainSectionKey = keyof typeof chainData;
type ChainNode = (typeof chainData)[ChainSectionKey][number];

function NodeCard({ node }: { node: ChainNode }) {
  const cfg = statusConfig[node.status as keyof typeof statusConfig];

  return (
    <div className={`${cfg.bgColor} ${cfg.borderColor} border-2 rounded-xl p-3 hover:shadow-lg transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 mb-1">{node.name}</h4>
          {node.companies && (
            <p className="text-xs text-slate-600 line-clamp-1">{node.companies.join('、')}</p>
          )}
          {node.type && (
            <p className="text-xs text-slate-600">{node.type}</p>
          )}
        </div>
        <span className={`${cfg.color} text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0`}>
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        {node.utilization !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">产能利用率</span>
            <span className={`font-bold ${node.utilization >= 80 ? 'text-emerald-700' : node.utilization >= 60 ? 'text-yellow-700' : 'text-red-700'}`}>
              {node.utilization}%
            </span>
          </div>
        )}
        {node.share !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">市场份额</span>
            <span className="font-bold text-slate-900">{node.share}%</span>
          </div>
        )}
        {node.cost && (
          <div className="flex justify-between">
            <span className="text-slate-500">成本</span>
            <span className="font-bold text-slate-900">{node.cost}</span>
          </div>
        )}
        {node.margin && (
          <div className="flex justify-between">
            <span className="text-slate-500">毛利率</span>
            <span className="font-bold text-slate-900">{node.margin}</span>
          </div>
        )}
        {node.demand !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">2026E需求</span>
            <span className="font-bold text-slate-900">{node.demand}万吨</span>
          </div>
        )}
        {node.growth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">增速</span>
            <span className={`font-bold flex items-center ${node.growth > 15 ? 'text-emerald-700' : node.growth > 0 ? 'text-blue-700' : 'text-gray-600'}`}>
              {node.growth > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : node.growth < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
              {node.growth > 0 ? '+' : ''}{node.growth}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IndustryChain() {
  const [filter, setFilter] = useState<string>('all');
  const activeFilter = filterConfig[filter as keyof typeof filterConfig] ?? filterConfig.all;

  const filteredSections = useMemo(() => {
    const filterNodes = (nodes: ChainNode[]) => nodes.filter(node => activeFilter.match(node.status));
    return {
      upstream: filterNodes(chainData.upstream),
      midstream_cathode: filterNodes(chainData.midstream_cathode),
      midstream_other: filterNodes(chainData.midstream_other),
      downstream: filterNodes(chainData.downstream),
      application: filterNodes(chainData.application),
    };
  }, [activeFilter]);

  const visibleNodes = Object.values(filteredSections).flat();
  const visibleCount = visibleNodes.length;
  const positiveCount = visibleNodes.filter(node => ['excellent', 'good', 'growing', 'booming'].includes(node.status)).length;
  const oversupplyCount = visibleNodes.filter(node => node.status === 'oversupply').length;

  const renderSection = (title: string, className: string, nodes: ChainNode[]) => (
    <div className="flex-1">
      <div className={`${className} text-white px-4 py-2 rounded-lg mb-3 text-center font-bold`}>
        {title}
      </div>
      <div className="space-y-3">
        {nodes.length > 0 ? (
          nodes.map(node => <NodeCard key={node.id} node={node} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            当前筛选下暂无节点
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-7 h-7 text-emerald-700" />
              全球锂电产业链全景图
            </h2>
            <p className="text-sm text-slate-500 mt-1">上游资源 → 中游材料 → 下游电池 → 终端应用</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('good')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'good' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              格局好
            </button>
            <button
              onClick={() => setFilter('oversupply')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'oversupply' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              产能过剩
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
              <span className="text-slate-600">{cfg.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          当前视图：<span className="font-semibold text-slate-900">{activeFilter.label}</span>
          {' '}| 可见节点 <span className="font-semibold text-slate-900">{visibleCount}</span>
          {' '}| 格局向好 <span className="font-semibold text-emerald-700">{positiveCount}</span>
          {' '}| 过剩环节 <span className="font-semibold text-red-600">{oversupplyCount}</span>
        </div>
      </div>

      {/* Chain Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <div className="flex gap-4 min-w-[1200px]">
          {/* Upstream */}
          {renderSection('上游：锂资源', 'bg-emerald-700', filteredSections.upstream)}

          <div className="flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-slate-300" />
          </div>

          {/* Midstream Cathode */}
          {renderSection('中游：正极材料', 'bg-blue-700', filteredSections.midstream_cathode)}

          <div className="flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-slate-300" />
          </div>

          {/* Midstream Other */}
          {renderSection('中游：其他材料', 'bg-blue-600', filteredSections.midstream_other)}

          <div className="flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-slate-300" />
          </div>

          {/* Downstream */}
          {renderSection('下游：电池企业', 'bg-purple-700', filteredSections.downstream)}

          <div className="flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-slate-300" />
          </div>

          {/* Application */}
          {renderSection('终端：应用市场', 'bg-orange-600', filteredSections.application)}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">当前筛选</div>
          <div className="text-2xl font-bold text-slate-900">{activeFilter.label}</div>
          <div className="text-xs text-slate-500">覆盖 {visibleCount} 个可见节点</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">格局向好节点</div>
          <div className="text-2xl font-bold text-emerald-700">{positiveCount}</div>
          <div className="text-xs text-slate-500">优秀、良好、成长与爆发环节</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">产能过剩节点</div>
          <div className="text-2xl font-bold text-red-600">{oversupplyCount}</div>
          <div className="text-xs text-slate-500">集中在中游材料与加工环节</div>
        </div>
      </div>
    </div>
  );
}
