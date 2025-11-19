import React, { useState, useCallback, useEffect } from 'react';
import { CalculationResult, WarehouseData, HistoryRecord } from './types';
import { calculateWorkforce } from './services/calculationService';
import { generateOperationalInsights } from './services/aiService';
import CalculatorForm from './components/CalculatorForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CalculationInfoModal from './components/CalculationInfoModal';
import HistoryView from './components/HistoryView';

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
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>('calculator');
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    
    // AI State
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

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

    // Clear AI analysis when key data changes significantly to avoid stale insights
    useEffect(() => {
        setAiAnalysis(null);
    }, [data.deliveries, data.orders, data.workHours, data.currentEmployees]);

    const handleCalculate = useCallback(() => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);
    }, [data]);

    const handleImport = useCallback(() => {
        setData({ ...mockData, date: new Date().toISOString().split('T')[0] });
        const calculation = calculateWorkforce(mockData);
        setResult(calculation);
    }, []);

    const handleGenerateAiAnalysis = async () => {
        if (!result) return;
        setIsAiLoading(true);
        try {
            const analysis = await generateOperationalInsights(data, result);
            setAiAnalysis(analysis);
        } catch (e) {
            console.error("Error generating analysis", e);
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleSave = () => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);

        const newRecord: HistoryRecord = {
            id: data.id || crypto.randomUUID(),
            timestamp: Date.now(),
            data: { ...data },
            result: calculation,
            aiAnalysis: aiAnalysis || undefined
        };

        setHistory(prev => {
            const existingIndex = prev.findIndex(item => item.id === newRecord.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newRecord;
                return updated;
            } else {
                return [newRecord, ...prev];
            }
        });

        setData(prev => ({ ...prev, id: newRecord.id }));
        alert("Dane zostały zapisane!");
    };

    const handleEditHistory = (record: HistoryRecord) => {
        setData(record.data);
        setResult(record.result);
        if (record.aiAnalysis) {
            setAiAnalysis(record.aiAnalysis);
        } else {
            setAiAnalysis(null);
        }
        setCurrentView('calculator');
    };

    const handleDeleteHistory = (id: string) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten zapis?")) {
            setHistory(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleExportExcel = () => {
        const headers = [
            "Data", "ID", 
            "Dostawy", "Art./Dostawa", "Norma Dostaw",
            "Zlecenia", "Art./Zlecenie", "Norma Zbiórki", "Norma Pakowania",
            "Godziny Pracy", "Przerwa (min)", "Wydajność (%)",
            "Obecni Pracownicy",
            "Wymagani: Odbiór", "Wymagani: Kompletacja", "Wymagani: Pakowanie",
            "Suma Wymagana", "Bufor", "Braki", "Analiza AI"
        ];

        const rows = history.map(rec => [
            rec.data.date, rec.id,
            rec.data.deliveries, rec.data.itemsPerDelivery, rec.data.deliveriesPerHour,
            rec.data.orders, rec.data.itemsPerOrder, rec.data.itemsPickedPerHour, rec.data.ordersPackedPerHour,
            rec.data.workHours, rec.data.breakTime, rec.data.processEfficiency,
            rec.data.currentEmployees,
            rec.result.receivers, rec.result.pickers, rec.result.packers,
            rec.result.total, rec.result.buffer, rec.result.needed,
            rec.aiAnalysis ? "Tak" : "Nie"
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

    return (
        <div className="min-h-screen bg-background text-text font-sans flex flex-col">
            <Header 
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenInfo={() => setIsInfoOpen(true)} 
            />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                {currentView === 'calculator' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        <div className="lg:col-span-4 h-full">
                            <CalculatorForm
                                data={data}
                                setData={setData}
                                onCalculate={handleCalculate}
                                onImport={handleImport}
                                onSave={handleSave}
                            />
                        </div>
                        <div className="lg:col-span-8 h-full">
                            <Dashboard 
                                result={result} 
                                inputData={data}
                                aiAnalysis={aiAnalysis}
                                isAiLoading={isAiLoading}
                                onGenerateAiAnalysis={handleGenerateAiAnalysis}
                            />
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