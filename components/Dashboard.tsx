
import React from 'react';
import { CalculationResult, WarehouseData } from '../types';
import WorkerChart from './WorkerChart';
import WorkloadChart from './WorkloadChart';
import ChartCard from './ChartCard';
import AiInsightsCard from './AiInsightsCard';
import { Users, AlertCircle, Clock } from 'lucide-react';

interface DashboardProps {
    result: CalculationResult | null;
    inputData: WarehouseData;
    aiAnalysis: string | null;
    isAiLoading: boolean;
    onGenerateAiAnalysis: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, inputData, aiAnalysis, isAiLoading, onGenerateAiAnalysis }) => {
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <Users size={64} className="text-text-secondary mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-text">Oczekiwanie na dane</h3>
                <p className="text-text-secondary max-w-sm">
                    Wprowadź dane w formularzu po lewej stronie i kliknij "Oblicz FTE", aby zobaczyć wyniki wg standardów.
                </p>
            </div>
        );
    }
    
    // Check for specific validation error from service
    if (result.error) {
        return (
             <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Błąd Walidacji</h3>
                <p className="text-text text-lg font-medium mb-2">{result.error}</p>
                <p className="text-text-secondary text-sm max-w-md">
                    Popraw zaznaczone wartości w formularzu, aby dokonać obliczeń.
                </p>
            </div>
        )
    }

    // Fallback check for generic logical errors (legacy check)
    if (result.total === 0 && (inputData.deliveries > 0 || inputData.orders > 0)) {
        return (
             <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Błąd w danych</h3>
                <p className="text-text-secondary max-w-sm">
                    Sprawdź, czy normy wydajnościowe (np. dostawy na godzinę) nie wynoszą zero przy dodatnim wolumenie.
                </p>
            </div>
        )
    }

    const workerData = [
        { name: 'Odbiór', value: result.receivers },
        { name: 'Kompletacja', value: result.pickers },
        { name: 'Pakowanie', value: result.packers },
    ];
    
    const workloadData = [
        { name: 'Praca', dostawy: inputData.deliveries, zlecenia: inputData.orders }
    ];

    const isSurplus = result.total < inputData.currentEmployees;
    const neededColor = result.needed > 0 ? 'text-primary' : 'text-green-600';

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main KPI Card */}
                <div className="p-6 bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-left">
                            <h2 className="text-lg font-semibold text-text-secondary">Zapotrzebowanie (FTE)</h2>
                            <p className="text-xs text-text-secondary">Full Time Equivalent</p>
                        </div>
                        {/* Changed style for better readability: Light blue background, dark blue text */}
                        <div className="text-right bg-blue-50 border border-blue-100 p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-blue-600 font-semibold flex items-center justify-end gap-1 mb-1">
                                <Clock size={14} /> Efektywny czas pracy
                            </p>
                            <p className="font-mono font-bold text-xl text-blue-900">{result.effectiveWorkHours}h <span className="text-sm font-normal text-blue-500">/ os.</span></p>
                        </div>
                    </div>

                    <div>
                        <p className={`text-5xl lg:text-6xl font-extrabold my-2 ${neededColor}`}>
                            {result.needed > 0 ? `+${result.needed}` : "0"}
                        </p>
                        {result.needed > 0 ? (
                            <p className="text-text-secondary">dodatkowych pracowników</p>
                        ) : (
                            <p className="text-green-600 font-medium">Obsada optymalna</p>
                        )}
                        
                        {isSurplus && (
                            <p className="text-green-600 font-semibold text-sm mt-1">
                                (Nadmiar: {inputData.currentEmployees - result.total})
                            </p>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 grid grid-cols-3 gap-2 text-text">
                        <div className="flex flex-col items-center">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Wymagane</p>
                            <p className="text-xl font-bold text-primary">{result.total}</p>
                        </div>
                        <div className="flex flex-col items-center border-l border-r border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Obecnie</p>
                            <p className="text-xl font-bold">{inputData.currentEmployees}</p>
                        </div>
                        <div className="flex flex-col items-center relative group cursor-help">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1 underline decoration-dotted">Narzut</p>
                            <p className="text-xl font-bold text-orange-500">{result.buffer}</p>
                        </div>
                    </div>
                </div>

                {/* AI Insights Card */}
                <div className="h-full">
                    <AiInsightsCard 
                        analysis={aiAnalysis} 
                        isLoading={isAiLoading} 
                        onGenerate={onGenerateAiAnalysis} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Podział etatu (FTE)">
                    <WorkerChart data={workerData} />
                </ChartCard>
                <ChartCard title="Wolumen operacyjny">
                    <WorkloadChart data={workloadData} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Dashboard;
