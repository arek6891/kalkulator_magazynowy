
import React from 'react';
import { HistoryRecord } from '../types';
import { FileSpreadsheet, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Button from './Button';

interface HistoryViewProps {
    history: HistoryRecord[];
    onEdit: (record: HistoryRecord) => void;
    onDelete: (id: string) => void;
    onExport: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onEdit, onDelete, onExport }) => {
    
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
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text">Historia Obliczeń</h2>
                    <p className="text-text-secondary text-sm">Zarządzaj zapisanymi raportami i eksportuj dane</p>
                </div>
                <Button onClick={onExport} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <FileSpreadsheet size={18} />
                    Eksportuj do Excela (CSV)
                </Button>
            </div>

            <div className="overflow-x-auto flex-grow p-4">
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
                        {history.map((record) => (
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
            </div>
        </div>
    );
};

export default HistoryView;
