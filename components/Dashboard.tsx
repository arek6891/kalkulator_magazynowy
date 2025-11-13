
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
                    Sprawdź, czy pole "Godziny pracy zmiany" ma wartość większą od zera, aby można było przeprowadzić kalkulację.
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

    return (
        <div className="space-y-8">
            <div className="p-6 bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <div>
                    <h2 className="text-lg font-semibold text-text-secondary">Sugerowana liczba pracowników</h2>
                    <p className="text-5xl font-extrabold text-primary">{result.total}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                     <p className="text-sm text-text-secondary">W tym {result.buffer} os. buforu</p>
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
