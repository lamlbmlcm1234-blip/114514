import { useState } from 'react';
import { useLithiumData } from '@/hooks/useLithiumData';
import { Bell, AlertTriangle, TrendingUp, TrendingDown, Shield, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const categoryConfig: Record<string, { label: string; color: string; icon: any }> = {
  demand: { label: '需求', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
  supply: { label: '供给', color: 'bg-emerald-100 text-emerald-800', icon: TrendingDown },
  price: { label: '价格', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  policy: { label: '政策', color: 'bg-purple-100 text-purple-800', icon: Shield },
};

const impactConfig: Record<string, { label: string; class: string }> = {
  high: { label: '高影响', class: 'bg-red-500' },
  medium: { label: '中影响', class: 'bg-orange-400' },
  low: { label: '低影响', class: 'bg-green-400' },
};

export default function AlertPanel() {
  const { data, addAlert, deleteAlert } = useLithiumData();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newAlert, setNewAlert] = useState({
    title: '',
    content: '',
    category: 'demand' as 'demand' | 'supply' | 'price' | 'policy',
    impact: 'medium' as 'high' | 'medium' | 'low',
  });

  const filteredAlerts = filter === 'all'
    ? data.alerts
    : data.alerts.filter(a => a.category === filter);

  const handleAdd = () => {
    if (!newAlert.title.trim() || !newAlert.content.trim()) return;
    addAlert({
      date: new Date().toISOString().split('T')[0],
      title: newAlert.title,
      content: newAlert.content,
      category: newAlert.category,
      impact: newAlert.impact,
    });
    setNewAlert({ title: '', content: '', category: 'demand', impact: 'medium' });
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          最新动态 & 预警
        </h2>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="demand">需求</SelectItem>
              <SelectItem value="supply">供给</SelectItem>
              <SelectItem value="price">价格</SelectItem>
              <SelectItem value="policy">政策</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 text-xs" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            新增
          </Button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">添加新动态</span>
            <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="标题"
              value={newAlert.title}
              onChange={e => setNewAlert(p => ({ ...p, title: e.target.value }))}
              className="h-8 text-sm"
            />
            <Textarea
              placeholder="详细内容"
              value={newAlert.content}
              onChange={e => setNewAlert(p => ({ ...p, content: e.target.value }))}
              className="text-sm min-h-[60px]"
            />
            <div className="flex gap-2">
              <Select value={newAlert.category} onValueChange={v => setNewAlert(p => ({ ...p, category: v as any }))}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand">需求</SelectItem>
                  <SelectItem value="supply">供给</SelectItem>
                  <SelectItem value="price">价格</SelectItem>
                  <SelectItem value="policy">政策</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newAlert.impact} onValueChange={v => setNewAlert(p => ({ ...p, impact: v as any }))}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高影响</SelectItem>
                  <SelectItem value="medium">中影响</SelectItem>
                  <SelectItem value="low">低影响</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} size="sm" className="w-full">添加</Button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredAlerts.map((alert) => {
          const cfg = categoryConfig[alert.category];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`p-1 rounded ${cfg.color} flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900">{alert.title}</span>
                      <span className={`inline-block w-2 h-2 rounded-full ${impactConfig[alert.impact].class}`} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400">{alert.date}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteAlert(alert.id)} className="text-slate-300 hover:text-red-500 flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{alert.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
