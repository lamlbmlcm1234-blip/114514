import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppData, DemandSegment, SupplySegment, AlertItem } from '@/types/lithium';
import { initialData } from '@/data/initialData';

interface DataContextType {
  data: AppData;
  updateDemandSegment: (id: string, updates: Partial<DemandSegment>) => void;
  updateSupplySegment: (id: string, updates: Partial<SupplySegment>) => void;
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  updateAlert: (id: string, updates: Partial<AlertItem>) => void;
  deleteAlert: (id: string) => void;
  updateLastUpdated: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

function mergeById<T extends { id: string }>(baseItems: T[], savedItems: unknown): T[] {
  if (!Array.isArray(savedItems)) return baseItems;

  const savedMap = new Map(
    savedItems
      .filter((item): item is Partial<T> & { id: string } => typeof item === 'object' && item !== null && 'id' in item && typeof (item as { id: unknown }).id === 'string')
      .map(item => [item.id, item]),
  );

  const mergedBase = baseItems.map(item => ({
    ...item,
    ...(savedMap.get(item.id) ?? {}),
  }));

  const extraSaved = savedItems.filter((item): item is T => {
    return typeof item === 'object' && item !== null && 'id' in item && typeof (item as { id: unknown }).id === 'string' && !baseItems.some(base => base.id === (item as { id: string }).id);
  });

  return [...mergedBase, ...extraSaved];
}

function hydrateAppData(saved: unknown): AppData {
  if (!saved || typeof saved !== 'object') return initialData;

  const parsed = saved as Partial<AppData>;

  return {
    ...initialData,
    ...parsed,
    demandSegments: mergeById(initialData.demandSegments, parsed.demandSegments),
    supplySegments: mergeById(initialData.supplySegments, parsed.supplySegments),
    balanceHistory: Array.isArray(parsed.balanceHistory) ? parsed.balanceHistory : initialData.balanceHistory,
    monthlyTrend: Array.isArray(parsed.monthlyTrend) ? parsed.monthlyTrend : initialData.monthlyTrend,
    alerts: Array.isArray(parsed.alerts) ? parsed.alerts : initialData.alerts,
    lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : initialData.lastUpdated,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('lithium-tracker-data');
    if (saved) {
      try {
        return hydrateAppData(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    return initialData;
  });

  const updateDemandSegment = useCallback((id: string, updates: Partial<DemandSegment>) => {
    setData(prev => {
      const newData = {
        ...prev,
        demandSegments: prev.demandSegments.map(s => s.id === id ? { ...s, ...updates } : s),
      };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateSupplySegment = useCallback((id: string, updates: Partial<SupplySegment>) => {
    setData(prev => {
      const newData = {
        ...prev,
        supplySegments: prev.supplySegments.map(s => s.id === id ? { ...s, ...updates } : s),
      };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const addAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    setData(prev => {
      const newAlert: AlertItem = { ...alert, id: Date.now().toString() };
      const newData = { ...prev, alerts: [newAlert, ...prev.alerts] };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateAlert = useCallback((id: string, updates: Partial<AlertItem>) => {
    setData(prev => {
      const newData = {
        ...prev,
        alerts: prev.alerts.map(a => a.id === id ? { ...a, ...updates } : a),
      };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setData(prev => {
      const newData = { ...prev, alerts: prev.alerts.filter(a => a.id !== id) };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateLastUpdated = useCallback(() => {
    setData(prev => {
      const newData = { ...prev, lastUpdated: new Date().toISOString().split('T')[0] };
      localStorage.setItem('lithium-tracker-data', JSON.stringify(newData));
      return newData;
    });
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      updateDemandSegment,
      updateSupplySegment,
      addAlert,
      updateAlert,
      deleteAlert,
      updateLastUpdated,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useLithiumData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useLithiumData must be used within DataProvider');
  return ctx;
}
