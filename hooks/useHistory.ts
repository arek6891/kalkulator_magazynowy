import { useState, useEffect, useCallback } from 'react';
import { HistoryRecord } from '../types';
import { supabase, isCloudEnabled } from '../services/supabase';

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Initial Load
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            if (isCloudEnabled && supabase) {
                // Cloud Mode
                const { data, error } = await supabase
                    .from('history')
                    .select('*')
                    .order('timestamp', { ascending: false });
                
                if (error) throw error;
                
                // Map DB structure back to app structure if needed, or assume 1:1 match
                if (data) {
                    setHistory(data as HistoryRecord[]);
                }
            } else {
                // Local Mode
                const savedHistory = localStorage.getItem('warehouseCalculatorHistory');
                if (savedHistory) {
                    setHistory(JSON.parse(savedHistory));
                }
            }
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addRecord = async (record: HistoryRecord) => {
        setIsSyncing(true);
        try {
            // Optimistic update (update UI immediately)
            setHistory(prev => [record, ...prev]);

            if (isCloudEnabled && supabase) {
                const { error } = await supabase
                    .from('history')
                    .insert([record]);
                if (error) {
                    console.error("Cloud save failed:", error);
                    alert("Błąd zapisu w chmurze!");
                    // Revert optimistic update? Or just warn.
                }
            } else {
                // Save to local storage
                const current = JSON.parse(localStorage.getItem('warehouseCalculatorHistory') || '[]');
                localStorage.setItem('warehouseCalculatorHistory', JSON.stringify([record, ...current]));
            }
        } finally {
            setIsSyncing(false);
        }
    };

    const updateRecord = async (record: HistoryRecord) => {
        setIsSyncing(true);
        try {
            setHistory(prev => prev.map(item => item.id === record.id ? record : item));

            if (isCloudEnabled && supabase) {
                const { error } = await supabase
                    .from('history')
                    .update(record)
                    .eq('id', record.id);
                if (error) throw error;
            } else {
                const current = JSON.parse(localStorage.getItem('warehouseCalculatorHistory') || '[]');
                const updated = current.map((item: HistoryRecord) => item.id === record.id ? record : item);
                localStorage.setItem('warehouseCalculatorHistory', JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const deleteRecord = async (id: string) => {
        setIsSyncing(true);
        try {
            setHistory(prev => prev.filter(item => item.id !== id));

            if (isCloudEnabled && supabase) {
                const { error } = await supabase
                    .from('history')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
            } else {
                const current = JSON.parse(localStorage.getItem('warehouseCalculatorHistory') || '[]');
                const updated = current.filter((item: HistoryRecord) => item.id !== id);
                localStorage.setItem('warehouseCalculatorHistory', JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    return {
        history,
        isLoading,
        isSyncing,
        isCloudEnabled,
        addRecord,
        updateRecord,
        deleteRecord,
        refresh: loadHistory
    };
};