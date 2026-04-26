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

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('lithium-tracker-data');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
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
