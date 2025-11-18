
import React, { useState, useCallback, useEffect } from 'react';
import { CalculationResult, WarehouseData, HistoryRecord } from './types';
import { calculateWorkforce } from './services/calculationService';
import CalculatorForm from './components/CalculatorForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CalculationInfoModal from './components/CalculationInfoModal';
import HistoryView from './components/HistoryView';
import { Sun, Moon } from 'lucide-react';

const mockData: WarehouseData = {
    deliveries: 25,
    itemsPerDelivery: 100,
    deliveriesPerHour: 2,
    orders: 150,
    itemsPerOrder: 5,
    itemsPickedPerHour: 60,
    ordersPackedPerHour: 6,
    workHours: 8,
    currentEmployees: 15,
    breakTime: 30,
    processEfficiency: 85,
    date: new Date().toISOString().split('T')[0]
};

const initialWarehouseData: WarehouseData = {
    deliveries: 0,
    itemsPerDelivery: 0,
    deliveriesPerHour: 0,
    orders: 0,
    itemsPerOrder: 0,
    itemsPickedPerHour: 0,
    ordersPackedPerHour: 0,
    workHours: 8,
    currentEmployees: 0,
    breakTime: 30, 
    processEfficiency: 85,
    date: new Date().toISOString().split('T')[0]
};

type ViewState = 'calculator' | 'history';

function App() {
    const [data, setData] = useState<WarehouseData>(initialWarehouseData);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>('calculator');
    const [history, setHistory] = useState<HistoryRecord[]>([]);

    // Load history from local storage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('warehouseCalculatorHistory');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save history to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('warehouseCalculatorHistory', JSON.stringify(history));
    }, [history]);

    const handleCalculate = useCallback(() => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);
    }, [data]);

    const handleImport = useCallback(() => {
        setData({ ...mockData, date: new Date().toISOString().split('T')[0] });
        const calculation = calculateWorkforce(mockData);
        setResult(calculation);
    }, []);
    
    const handleSave = () => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);

        const newRecord: HistoryRecord = {
            id: data.id || crypto.randomUUID(),
            timestamp: Date.now(),
            data: { ...data },
            result: calculation
        };

        setHistory(prev => {
            const existingIndex = prev.findIndex(item => item.id === newRecord.id);
            if (existingIndex >= 0) {
                // Update existing
                const updated = [...prev];
                updated[existingIndex] = newRecord;
                return updated;
            } else {
                // Add new
                return [newRecord, ...prev];
            }
        });

        // Reset ID to prevent overwriting immediately unless intended, 
        // but here keeping it might be better for UX if they want to save again. 
        // Let's keep the ID on the form data so they know they are editing.
        setData(prev => ({ ...prev, id: newRecord.id }));
        
        alert("Dane zostały zapisane!");
    };

    const handleEditHistory = (record: HistoryRecord) => {
        setData(record.data);
        setResult(record.result);
        setCurrentView('calculator');
    };

    const handleDeleteHistory = (id: string) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten zapis?")) {
            setHistory(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleExportExcel = () => {
        // Create CSV content
        const headers = [
            "Data", "ID", 
            "Dostawy", "Art./Dostawa", "Norma Dostaw",
            "Zlecenia", "Art./Zlecenie", "Norma Zbiórki", "Norma Pakowania",
            "Godziny Pracy", "Przerwa (min)", "Wydajność (%)",
            "Obecni Pracownicy",
            "Wymagani: Odbiór", "Wymagani: Kompletacja", "Wymagani: Pakowanie",
            "Suma Wymagana", "Bufor", "Braki"
        ];

        const rows = history.map(rec => [
            rec.data.date, rec.id,
            rec.data.deliveries, rec.data.itemsPerDelivery, rec.data.deliveriesPerHour,
            rec.data.orders, rec.data.itemsPerOrder, rec.data.itemsPickedPerHour, rec.data.ordersPackedPerHour,
            rec.data.workHours, rec.data.breakTime, rec.data.processEfficiency,
            rec.data.currentEmployees,
            rec.result.receivers, rec.result.pickers, rec.result.packers,
            rec.result.total, rec.result.buffer, rec.result.needed
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(row => row.join(";"))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `raport_magazynowy_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
        document.body.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-background text-text font-sans transition-colors duration-300 flex flex-col">
            <Header 
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenInfo={() => setIsInfoOpen(true)} 
            />
             <button
                onClick={toggleDarkMode}
                className="fixed top-20 right-4 z-50 p-2 rounded-full bg-card text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <main className="flex-grow container mx-auto px-4 py-8">
                {currentView === 'calculator' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        <div className="lg:col-span-4">
                            <CalculatorForm
                                data={data}
                                setData={setData}
                                onCalculate={handleCalculate}
                                onImport={handleImport}
                                onSave={handleSave}
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <Dashboard result={result} inputData={data} />
                        </div>
                    </div>
                ) : (
                    <HistoryView 
                        history={history} 
                        onEdit={handleEditHistory} 
                        onDelete={handleDeleteHistory}
                        onExport={handleExportExcel}
                    />
                )}
            </main>
            
            <CalculationInfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)} 
            />
        </div>
    );
}

export default App;
