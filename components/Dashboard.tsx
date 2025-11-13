
import React from 'react';
import { CalculationResult, WarehouseData } from '../types';
import WorkerChart from './WorkerChart';
import WorkloadChart from './WorkloadChart';
import ChartCard from './ChartCard';
import { Users, AlertCircle } from 'lucide-react';

interface DashboardProps {
    result: CalculationResult | null;
    inputData: WarehouseData;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card p-4 rounded-lg shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
        <div className="p-3 bg-primary/10 text-primary rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ result, inputData }) => {
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <Users size={64} className="text-text-secondary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Oczekiwanie na dane</h3>
                <p className="text-text-secondary max-w-sm">
                    Wprowadź dane w formularzu po lewej stronie i kliknij "Oblicz", aby zobaczyć wyniki.
                </p>
            </div>
        );
    }
    
    if (result.total === 0 && (inputData.deliveries > 0 || inputData.orders > 0)) {
        return (
             <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Błąd w danych</h3>
                <p className="text-text-secondary max-w-sm">
                    Sprawdź, czy pole "Godziny pracy zmiany" ma wartość większą od zera oraz czy wydajność (np. dostaw na godzinę) nie jest zerowa dla zadań z obciążeniem.
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
    const neededColor = result.needed > 0 ? 'text-primary' : 'text-green-500';

    return (
        <div className="space-y-8">
             <div className="p-6 bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <h2 className="text-lg font-semibold text-text-secondary">Potrzebni dodatkowi pracownicy</h2>
                <p className={`text-6xl font-extrabold my-2 ${neededColor}`}>
                    {result.needed}
                </p>
                 {isSurplus && (
                    <p className="text-green-500 font-semibold -mt-2 mb-2">
                        (Nadmiar pracowników: {inputData.currentEmployees - result.total})
                    </p>
                 )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-around items-center text-text">
                    <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wider">Sugerowana</p>
                        <p className="text-xl font-bold">{result.total}</p>
                    </div>
                     <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wider">Obecnie</p>
                        <p className="text-xl font-bold">{inputData.currentEmployees}</p>
                    </div>
                     <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wider">Bufor</p>
                        <p className="text-xl font-bold">{result.buffer}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ChartCard title="Podział pracowników wg ról">
                    <WorkerChart data={workerData} />
                </ChartCard>
                <ChartCard title="Stosunek dostaw do zleceń">
                    <WorkloadChart data={workloadData} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Dashboard;