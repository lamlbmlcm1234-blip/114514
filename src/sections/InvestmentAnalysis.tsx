import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Star, Award, Zap, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

// 投资标的数据
const investmentData = {
  tier1: [
    {
      id: 'yhgf',
      name: '盐湖股份',
      code: '000792',
      sector: '上游锂矿',
      pe: 12,
      pb: 3.0,
      logic: '成本~3万元/吨，行业最低；8万吨产能',
      elasticity: '碳酸锂17万→吨毛利14万，成本不变',
      catalyst: '盐湖提锂成本极低，锂价上涨直接转化为利润',
      risk: '产能扩张周期长（7-10年）',
      rating: 5,
    },
    {
      id: 'tqly',
      name: '天齐锂业',
      code: '002466/9696.HK',
      sector: '上游锂矿',
      pe: 11,
      pb: 2.0,
      logic: 'Greenbushes全球最低成本硬岩矿；CGP3爬坡',
      elasticity: '权益产量释放+精矿月度定价',
      catalyst: 'CGP3 2026年爬坡，长期266万吨精矿/年',
      risk: '资产负债率28%，财务稳健但扩产受限',
      rating: 5,
    },
    {
      id: 'gfly',
      name: '赣锋锂业',
      code: '002460/1772.HK',
      sector: '上游锂矿',
      pe: 21,
      pb: 3.7,
      logic: '全球资源布局最全；锂盐销量+42%',
      elasticity: '资源+冶炼+电池三重利润',
      catalyst: '2026Q1净利润16-21亿元，单季接近2025全年',
      risk: '估值已部分计价乐观预期',
      rating: 4,
    },
    {
      id: 'ygdy',
      name: '阳光电源',
      code: '300274',
      sector: '储能系统集成',
      pe: 18,
      pb: 6.0,
      logic: '海外储能毛利率36.49%；AIDC电源拓展',
      elasticity: '海外高毛利订单持续放量',
      catalyst: '2025年储能发货43GWh（+54%），主动放弃国内低毛利项目',
      risk: 'AIDC储能预期可能透支',
      rating: 5,
    },
  ],
  tier2: [
    {
      id: 'ndsd',
      name: '宁德时代',
      code: '300750/9868.HK',
      sector: '动力+储能电池',
      pe: 18,
      pb: 4.5,
      logic: '全球电池市占率39.2%；储能毛利率26.71%',
      elasticity: 'AIDC深度布局，匈牙利产能爬坡',
      catalyst: '2025年销量661GWh（+39%），产能利用率96.9%',
      risk: '国内动力电池价格竞争加剧',
      rating: 5,
    },
    {
      id: 'ejgf',
      name: '恩捷股份',
      code: '002812',
      sector: '隔膜',
      pe: 50,
      pb: 3.0,
      logic: '隔膜格局改善；境外毛利率34.97%',
      elasticity: '行业CR3超60%，二三线出清',
      catalyst: '2025年隔膜销量128.4亿平米（+45.5%），毛利率18.01%（+10.62pp）',
      risk: '估值偏高，扭亏后PE达50x',
      rating: 4,
    },
    {
      id: 'rbkj',
      name: '容百科技',
      code: '688005',
      sector: '三元正极',
      pe: 25,
      pb: 2.5,
      logic: '韩国6万吨+波兰2.5万吨海外产能',
      elasticity: '海外三元正极享受溢价',
      catalyst: 'LMFP布局领先，2026年"纯用方案"正式上车',
      risk: '国内三元正极产能过剩',
      rating: 4,
    },
  ],
  tier3: [
    {
      id: 'ywln',
      name: '亿纬锂能',
      code: '300014',
      sector: '储能电池',
      pe: 25,
      pb: 3.0,
      logic: '储能出货全球第二；Q1边际改善',
      elasticity: '毛利率仅12.28%，以利润换份额，Q1边际改善',
      catalyst: '2025年储能出货71.05GWh（+40.8%）首超动力电池',
      risk: '毛利率远低于宁德时代（26.71%），盈利质量待验证',
      rating: 3,
    },
    {
      id: 'byd',
      name: '比亚迪',
      code: '002594/1211.HK',
      sector: '整车+电池+储能',
      pe: 20,
      pb: 5.0,
      logic: '沙特12.5GWh全球最大储能订单',
      elasticity: '储能业务增速vs盈利质量',
      catalyst: '2025年动力电池及储能电池装机总量285.6GWh（+46.7%）',
      risk: '储能业务毛利率低于动力电池',
      rating: 4,
    },
    {
      id: 'khsj',
      name: '科华数据',
      code: '002335',
      sector: 'AIDC储能',
      pe: 35,
      pb: 4.0,
      logic: 'AIDC业绩拐点已现',
      elasticity: '体量较小，估值偏高',
      catalyst: '2025Q2收入25.2亿元（环比+107%），AIDC数据中心业务驱动',
      risk: 'AIDC储能2026年体量仅40GWh（占全球储能5%），概念炒作风险',
      rating: 3,
    },
    {
      id: 'dfnm',
      name: '德方纳米',
      code: '300769',
      sector: 'LMFP正极',
      pe: 30,
      pb: 3.5,
      logic: '11万吨LMFP产能行业第一，液相法技术优势',
      elasticity: 'LMFP量产将重塑铁锂正极竞争格局',
      catalyst: '2025年国内LMFP出货量约3万吨（+275%），2026年预计7-8万吨',
      risk: 'LMFP技术路线尚未完全验证，传统LFP业务承压',
      rating: 3,
    },
  ],
  tier4: [
    {
      id: 'hnyn',
      name: '湖南裕能',
      code: '301358',
      sector: '磷酸铁锂正极',
      logic: '产能过剩，加工费持续承压，碳酸锂涨价传导存在时滞',
      reason: '固相法普通产品同质化严重，沦为"代工厂"，毛利率仅5-8%',
      rating: 1,
    },
    {
      id: 'tccl',
      name: '天赐材料',
      code: '002709',
      sector: '电解液',
      logic: '六氟磷酸锂严重过剩，价格战持续',
      reason: '产能从2020年5万吨扩至2024年超30万吨，毛利率10-15%，龙头也无法阻止价格战',
      rating: 1,
    },
    {
      id: 'xzb',
      name: '新宙邦',
      code: '300037',
      sector: '电解液',
      logic: '配方混合技术壁垒低，产线投资仅几千万',
      reason: '建设周期6-9个月，进入门槛低，定价权极弱',
      rating: 1,
    },
    {
      id: 'btr',
      name: '贝特瑞',
      code: '835185',
      sector: '负极',
      logic: '石墨化产能严重过剩（利用率<60%）',
      reason: '人造石墨产品差异化低，一体化重资产陷阱，毛利率15-20%',
      rating: 1,
    },
    {
      id: 'ptl',
      name: '璞泰来',
      code: '603659',
      sector: '负极',
      logic: '负极材料龙头，但同样深陷价格战',
      reason: 'CR5约70%，但龙头企业同样无法摆脱产能过剩困境',
      rating: 1,
    },
    {
      id: 'gxgk',
      name: '国轩高科',
      code: '002074',
      sector: '储能电池（国内）',
      logic: '国内价格竞争激烈，毛利率个位数',
      reason: '二线电池厂以利润换份额，盈利质量差',
      rating: 1,
    },
  ],
};

const tierConfig = {
  tier1: {
    title: '第一梯队',
    subtitle: '利润弹性最大，确定性最高',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-800',
    badgeColor: 'bg-emerald-600',
    icon: Award,
  },
  tier2: {
    title: '第二梯队',
    subtitle: '高景气，格局较好',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-800',
    badgeColor: 'bg-green-600',
    icon: Star,
  },
  tier3: {
    title: '第三梯队',
    subtitle: '弹性大，但需验证',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-600',
    icon: Zap,
  },
  tier4: {
    title: '第四梯队',
    subtitle: '承压或回避',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-600',
    icon: XCircle,
  },
};

interface StockCardProps {
  stock: any;
  tier: 'tier1' | 'tier2' | 'tier3' | 'tier4';
}

function StockCard({ stock, tier }: StockCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = tierConfig[tier];

  return (
    <div className={`${cfg.bgColor} ${cfg.borderColor} border-2 rounded-xl p-4 hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg text-slate-900">{stock.name}</h4>
            {stock.rating && (
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < stock.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
          {stock.code && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-mono">{stock.code}</span>
              <span className={`px-2 py-0.5 rounded-full ${cfg.badgeColor} text-white font-medium`}>
                {stock.sector}
              </span>
            </div>
          )}
          {!stock.code && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badgeColor} text-white font-medium`}>
              {stock.sector}
            </span>
          )}
        </div>
        {tier !== 'tier4' && stock.pe && (
          <div className="text-right flex-shrink-0 ml-3">
            <div className="text-xs text-slate-500">PE/PB</div>
            <div className="text-sm font-bold text-slate-900">{stock.pe}x / {stock.pb}x</div>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <div className="text-xs text-slate-500 mb-1">核心逻辑</div>
          <div className="text-slate-800 font-medium">{stock.logic}</div>
        </div>

        {tier !== 'tier4' && (
          <>
            <div>
              <div className="text-xs text-slate-500 mb-1">利润弹性来源</div>
              <div className="text-slate-700">{stock.elasticity}</div>
            </div>

            {expanded && (
              <>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    关键催化剂
                  </div>
                  <div className="text-slate-700 bg-white/50 rounded-lg p-2 text-xs">
                    {stock.catalyst}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    风险提示
                  </div>
                  <div className="text-slate-700 bg-white/50 rounded-lg p-2 text-xs">
                    {stock.risk}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {tier === 'tier4' && (
          <div>
            <div className="text-xs text-slate-500 mb-1">回避理由</div>
            <div className="text-slate-700">{stock.reason}</div>
          </div>
        )}
      </div>

      {tier !== 'tier4' && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              收起详情
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              展开详情
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function InvestmentAnalysis() {
  const [selectedTier, setSelectedTier] = useState<string>('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-7 h-7 text-emerald-700" />
              投资标的分析与梯队排序
            </h2>
            <p className="text-sm text-slate-500 mt-1">基于供需格局、利润弹性、确定性的四梯队分类</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${selectedTier === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              全部
            </button>
            {Object.entries(tierConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${selectedTier === key ? `${cfg.badgeColor} text-white` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cfg.title}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
            <div className="text-emerald-600 font-semibold mb-1">第一梯队</div>
            <div className="text-2xl font-bold text-emerald-800">{investmentData.tier1.length}</div>
            <div className="text-slate-500">低成本锂矿+海外储能</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-green-600 font-semibold mb-1">第二梯队</div>
            <div className="text-2xl font-bold text-green-800">{investmentData.tier2.length}</div>
            <div className="text-slate-500">电池龙头+隔膜</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-yellow-600 font-semibold mb-1">第三梯队</div>
            <div className="text-2xl font-bold text-yellow-800">{investmentData.tier3.length}</div>
            <div className="text-slate-500">二线电池+AIDC</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-red-600 font-semibold mb-1">第四梯队</div>
            <div className="text-2xl font-bold text-red-800">{investmentData.tier4.length}</div>
            <div className="text-slate-500">产能过剩环节</div>
          </div>
        </div>
      </div>

      {/* Tier 1 */}
      {(selectedTier === 'all' || selectedTier === 'tier1') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-emerald-700" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{tierConfig.tier1.title}</h3>
              <p className="text-sm text-slate-500">{tierConfig.tier1.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentData.tier1.map(stock => (
              <StockCard key={stock.id} stock={stock} tier="tier1" />
            ))}
          </div>
        </div>
      )}

      {/* Tier 2 */}
      {(selectedTier === 'all' || selectedTier === 'tier2') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-green-700" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{tierConfig.tier2.title}</h3>
              <p className="text-sm text-slate-500">{tierConfig.tier2.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentData.tier2.map(stock => (
              <StockCard key={stock.id} stock={stock} tier="tier2" />
            ))}
          </div>
        </div>
      )}

      {/* Tier 3 */}
      {(selectedTier === 'all' || selectedTier === 'tier3') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-700" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{tierConfig.tier3.title}</h3>
              <p className="text-sm text-slate-500">{tierConfig.tier3.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentData.tier3.map(stock => (
              <StockCard key={stock.id} stock={stock} tier="tier3" />
            ))}
          </div>
        </div>
      )}

      {/* Tier 4 */}
      {(selectedTier === 'all' || selectedTier === 'tier4') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-700" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{tierConfig.tier4.title}</h3>
              <p className="text-sm text-slate-500">{tierConfig.tier4.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentData.tier4.map(stock => (
              <StockCard key={stock.id} stock={stock} tier="tier4" />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <div className="font-bold mb-1">免责声明</div>
            <div>本页面基于公开信息和独立研究，不构成投资建议。投资者应根据自身判断做出投资决策，并承担相应风险。股票代码、估值数据仅供参考，请以实时行情为准。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
