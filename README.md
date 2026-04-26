# 全球锂资源供需跟踪看板

## 项目简介

这是一个面向研究场景的锂资源供需可视化网站，聚合总览、产业链、投资、成本、机构预测、需求端、供给端和动态提醒等模块，基于 React + TypeScript + Vite + Tailwind CSS + Recharts 构建。

## 当前功能

### 1. 总览
- 全球碳酸锂供需平衡图（2025-2028E）
- 月度价格与库存趋势
- 动态提醒面板
- 顶部 KPI 与最近更新时间

### 2. 产业链分析
- 上游资源、中游材料、下游电池、终端应用全景展示
- 支持“全部 / 格局好 / 产能过剩”筛选
- 筛选后同步更新节点显示与摘要统计

### 3. 投资分析
- 产业链投资标的梯队分析
- 不同赛道的逻辑拆解与相对比较

### 4. 成本曲线
- 全球锂资源供给成本曲线
- 成本-产能散点图
- 按供给类型筛选图表与表格
- 点击图表或表格查看项目详情

### 5. 机构预测
- 多家机构对供给、需求、价格的对比视图

### 6. 需求端细分分析
- **动力电池**：全球新能源车销量驱动
- **储能电池**：最大超预期来源，包含AIDC储能
- **电动重卡**：高速增长领域
- **AIDC数据中心储能**：新兴增长点
- **电动两轮车**：东南亚市场爆发
- **消费电子**：稳定需求
- **工业及其他**：传统需求下滑
- **用户侧储能**：政策影响显著

### 7. 供给端细分分析
- **盐湖提锂**：全球成本最低路线
- **锂辉石（澳洲/非洲）**：主要供给来源
- **锂云母（江西）**：成本最高，政策扰动
- **非洲锂矿**：政策风险高，资源优异
- **南美盐湖**：长期增量潜力大
- **供给成本曲线**：现价 17 万元/吨参考线可见

### 8. 实时动态提醒
- 供给端扰动事件
- 需求端变化
- 价格波动
- 政策影响
- 支持本地新增、编辑、删除

## 技术栈

- **前端框架**：React 19.2.0
- **开发语言**：TypeScript
- **构建工具**：Vite 5.4.11
- **样式方案**：Tailwind CSS 3.4.19
- **UI组件**：Radix UI + shadcn/ui
- **图表库**：Recharts 2.15.4
- **图标库**：Lucide React

## 快速开始

### 安装依赖
```bash
npm install
```

如果当前 Windows 终端未配置 `npm` 到 PATH，可尝试使用 `npm.cmd install`。

### 启动开发服务器
```bash
npm run dev
```

如果 `npm` 命令不可用，可尝试 `npm.cmd run dev`。

默认访问 [http://localhost:5173](http://localhost:5173)

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
website-project/
├── src/
│   ├── components/      # UI组件
│   ├── sections/        # 页面区块
│   │   ├── DashboardHeader.tsx    # 仪表板头部
│   │   ├── BalanceChart.tsx       # 供需平衡图表
│   │   ├── IndustryChain.tsx      # 产业链全景
│   │   ├── InvestmentAnalysis.tsx # 投资分析
│   │   ├── CostCurve.tsx          # 成本曲线
│   │   ├── InstitutionForecast.tsx# 机构预测
│   │   ├── DemandPanel.tsx        # 需求端面板
│   │   ├── SupplyPanel.tsx        # 供给端面板
│   │   ├── PriceTrend.tsx         # 价格趋势
│   │   └── AlertPanel.tsx         # 动态提醒
│   ├── data/            # 数据文件
│   │   └── initialData.ts         # 初始数据
│   ├── types/           # 类型定义
│   │   └── lithium.ts             # 锂数据类型
│   ├── hooks/           # 自定义Hooks
│   │   └── useLithiumData.tsx     # 数据管理Hook
│   ├── lib/             # 工具函数
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── public/              # 静态资源
├── package.json         # 项目配置
└── README.md           # 本文件
```

## 数据来源

- UBS
- Morgan Stanley
- Wood Mackenzie
- IEA Global EV Outlook
- GGII
- EVTank
- InfoLink
- 各公司年报/季报

## 免责声明

本系统仅供研究参考，不构成投资建议。投资者应根据自身判断做出投资决策，并承担相应风险。

## 开发说明

### 添加新的需求细分
编辑 `src/data/initialData.ts`，在 `demandSegments` 数组中添加新项。

### 添加新的供给细分
编辑 `src/data/initialData.ts`，在 `supplySegments` 数组中添加新项。

### 更新实时数据
通过 `useLithiumData` Hook 提供的方法更新数据，当前数据持久化到浏览器 `localStorage`。
