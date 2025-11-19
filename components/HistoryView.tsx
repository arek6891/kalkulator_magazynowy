
import React, { useState, useMemo } from 'react';
import { HistoryRecord } from '../types';
import { FileSpreadsheet, Edit, Trash2, Search, Filter, X, Calendar } from 'lucide-react';
import Button from './Button';

interface HistoryViewProps {
    history: HistoryRecord[];
    onEdit: (record: HistoryRecord) => void;
    onDelete: (id: string) => void;
    onExport: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onEdit, onDelete, onExport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredHistory = useMemo(() => {
        return history.filter((record) => {
            // 1. Text Search Filter
            const term = searchTerm.toLowerCase();
            // Construct a searchable string from relevant fields
            const searchableString = `
                ${record.data.date || ''} 
                ${record.data.deliveries} 
                ${record.data.orders} 
                ${record.data.currentEmployees} 
                ${record.result.total}
                ${record.result.receivers}
                ${record.result.pickers}
                ${record.result.packers}
            `.toLowerCase();
            
            const matchesSearch = term === '' || searchableString.includes(term);

            // 2. Date Range Filter
            let matchesDate = true;
            if (startDate || endDate) {
                const recordDateStr = record.data.date || new Date(record.timestamp).toISOString().split('T')[0];
                const recordDate = new Date(recordDateStr).getTime();
                
                if (startDate) {
                    const start = new Date(startDate).getTime();
                    if (recordDate < start) matchesDate = false;
                }
                
                if (endDate && matchesDate) {
                    const end = new Date(endDate).getTime();
                    if (recordDate > end) matchesDate = false;
                }
            }

            return matchesSearch && matchesDate;
        });
    }, [history, searchTerm, startDate, endDate]);

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    const hasActiveFilters = searchTerm || startDate || endDate;

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-card rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center p-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                    <FileSpreadsheet size={48} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Brak zapisanych danych</h3>
                <p className="text-text-secondary max-w-md">
                    Użyj kalkulatora i kliknij przycisk "Zapisz", aby zachować wyniki obliczeń i utworzyć historię raportów.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text">Historia Obliczeń</h2>
                        <p className="text-text-secondary text-sm">Zarządzaj zapisanymi raportami i eksportuj dane</p>
                    </div>
                    <Button onClick={onExport} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shrink-0">
                        <FileSpreadsheet size={18} />
                        Eksportuj do Excela (CSV)
                    </Button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-3 items-center bg-background p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                        <input 
                            type="text" 
                            placeholder="Szukaj (data, ilość...)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-card border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-primary outline-none text-text"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                        <div className="flex items-center gap-2 px-2 py-2 bg-card border border-gray-300 dark:border-gray-600 rounded-md">
                            <Calendar size={16} className="text-text-secondary" />
                            <span className="text-xs text-text-secondary whitespace-nowrap">Od:</span>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent text-sm text-text focus:outline-none w-32"
                            />
                        </div>
                        <span className="text-text-secondary">-</span>
                        <div className="flex items-center gap-2 px-2 py-2 bg-card border border-gray-300 dark:border-gray-600 rounded-md">
                            <Calendar size={16} className="text-text-secondary" />
                            <span className="text-xs text-text-secondary whitespace-nowrap">Do:</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent text-sm text-text focus:outline-none w-32"
                            />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button 
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors ml-auto md:ml-0"
                        >
                            <X size={16} />
                            Wyczyść
                        </button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto flex-grow p-4">
                {filteredHistory.length > 0 ? (
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text uppercase bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 rounded-l-lg">Data</th>
                                <th scope="col" className="px-4 py-3">Parametry</th>
                                <th scope="col" className="px-4 py-3 text-center">Dostawy / Zlecenia</th>
                                <th scope="col" className="px-4 py-3 text-center">Obecna Załoga</th>
                                <th scope="col" className="px-4 py-3 text-center bg-indigo-50 dark:bg-indigo-900/20 font-bold text-primary">Wymagane FTE</th>
                                <th scope="col" className="px-4 py-3 text-center bg-orange-50 dark:bg-orange-900/20 font-bold text-orange-600">Braki</th>
                                <th scope="col" className="px-4 py-3 rounded-r-lg text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((record) => (
                                <tr key={record.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-text whitespace-nowrap">
                                        {record.data.date || new Date(record.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col text-xs">
                                            <span>Zmiana: {record.data.workHours}h</span>
                                            <span>Przerwa: {record.data.breakTime}min</span>
                                            <span>Wydajność: {record.data.processEfficiency}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center font-mono">
                                        {record.data.deliveries} / {record.data.orders}
                                    </td>
                                    <td className="px-4 py-4 text-center font-bold">
                                        {record.data.currentEmployees}
                                    </td>
                                    <td className="px-4 py-4 text-center bg-indigo-50/50 dark:bg-indigo-900/10">
                                        <span className="text-lg font-bold text-primary">{record.result.total}</span>
                                        <span className="block text-xs text-text-secondary">
                                            (Odb:{record.result.receivers} Kom:{record.result.pickers} Pak:{record.result.packers})
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center bg-orange-50/50 dark:bg-orange-900/10">
                                        <span className={`font-bold ${record.result.needed > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {record.result.needed > 0 ? `+${record.result.needed}` : 'OK'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => onEdit(record)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Edytuj / Wczytaj"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(record.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Usuń"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
                        <Filter size={32} className="mb-2 opacity-50" />
                        <p>Nie znaleziono wyników dla podanych filtrów.</p>
                        <button onClick={clearFilters} className="text-primary text-sm mt-2 hover:underline">Wyczyść filtry</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
