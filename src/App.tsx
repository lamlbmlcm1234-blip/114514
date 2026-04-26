import { useState } from 'react';
import { DataProvider } from '@/hooks/useLithiumData';
import DashboardHeader from '@/sections/DashboardHeader';
import BalanceChart from '@/sections/BalanceChart';
import DemandPanel from '@/sections/DemandPanel';
import SupplyPanel from '@/sections/SupplyPanel';
import PriceTrend from '@/sections/PriceTrend';
import AlertPanel from '@/sections/AlertPanel';
import IndustryChain from '@/sections/IndustryChain';
import InvestmentAnalysis from '@/sections/InvestmentAnalysis';
import CostCurve from '@/sections/CostCurve';
import InstitutionForecast from '@/sections/InstitutionForecast';
import { LayoutDashboard, TrendingUp, TrendingDown, Bell, Network, Target, DollarSign, Building2 } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '总览', icon: LayoutDashboard },
    { id: 'chain', label: '产业链', icon: Network },
    { id: 'investment', label: '投资', icon: Target },
    { id: 'cost', label: '成本', icon: DollarSign },
    { id: 'forecast', label: '机构', icon: Building2 },
    { id: 'demand', label: '需求端', icon: TrendingUp },
    { id: 'supply', label: '供给端', icon: TrendingDown },
    { id: 'alerts', label: '动态', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-800 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">碳酸锂供需格局跟踪</h1>
                <p className="text-[11px] text-slate-400 tracking-wide">LITHIUM SUPPLY & DEMAND TRACKER</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-1 bg-slate-100 rounded-lg p-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-5">
        <DashboardHeader />

        {activeTab === 'overview' && (
          <div className="space-y-5">
            <BalanceChart />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2"><PriceTrend /></div>
              <div><AlertPanel /></div>
            </div>
          </div>
        )}

        {activeTab === 'chain' && (
          <IndustryChain />
        )}

        {activeTab === 'investment' && (
          <InvestmentAnalysis />
        )}

        {activeTab === 'cost' && (
          <CostCurve />
        )}

        {activeTab === 'forecast' && (
          <InstitutionForecast />
        )}

        {activeTab === 'demand' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3"><DemandPanel /></div>
            <div><AlertPanel /></div>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3"><SupplyPanel /></div>
            <div><AlertPanel /></div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AlertPanel />
            <PriceTrend />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>数据来源：UBS、Morgan Stanley、Wood Mackenzie、IEA、GGII、EVTank、InfoLink</span>
            <span>本页面仅供研究参考，不构成投资建议</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
