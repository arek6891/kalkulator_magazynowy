
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CalculationResult, WarehouseData, HistoryRecord, AppSettings } from './types';
import { calculateWorkforce } from './services/calculationService';
import { generateOperationalInsights } from './services/aiService';
import CalculatorForm from './components/CalculatorForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CalculationInfoModal from './components/CalculationInfoModal';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';

const defaultSettings: AppSettings = {
    defaultWorkHours: 8,
    defaultBreakTime: 30,
    defaultEfficiency: 85
};

type ViewState = 'calculator' | 'history' | 'settings';

function App() {
    // Load settings first
    const [settings, setSettings] = useState<AppSettings>(() => {
        const savedSettings = localStorage.getItem('warehouseCalculatorSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    // Initial data depends on settings
    const initialWarehouseData: WarehouseData = {
        deliveries: 0,
        itemsPerDelivery: 0,
        deliveriesPerHour: 0,
        orders: 0,
        itemsPerOrder: 0,
        itemsPickedPerHour: 0,
        ordersPackedPerHour: 0,
        workHours: settings.defaultWorkHours,
        currentEmployees: 0,
        breakTime: settings.defaultBreakTime, 
        processEfficiency: settings.defaultEfficiency,
        date: new Date().toISOString().split('T')[0]
    };

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

    // Save settings to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('warehouseCalculatorSettings', JSON.stringify(settings));
    }, [settings]);

    // Determine if we are in "Update Mode" (Editing an existing record with the same date)
    const isUpdateMode = useMemo(() => {
        if (!data.id) return false;
        const existingRecord = history.find(h => h.id === data.id);
        if (!existingRecord) return false;
        // It is an update only if the date hasn't changed
        return existingRecord.data.date === data.date;
    }, [data.id, data.date, history]);

    const handleCalculate = useCallback(() => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);
        // Clear previous AI analysis on new calculation as it might be outdated
        setAiAnalysis(null);
    }, [data]);

    const handleImport = useCallback(() => {
        const mockData: WarehouseData = { 
            deliveries: 25,
            itemsPerDelivery: 100,
            deliveriesPerHour: 2,
            orders: 150,
            itemsPerOrder: 5,
            itemsPickedPerHour: 60,
            ordersPackedPerHour: 6,
            workHours: settings.defaultWorkHours,
            currentEmployees: 15,
            breakTime: settings.defaultBreakTime,
            processEfficiency: settings.defaultEfficiency,
            date: new Date().toISOString().split('T')[0] 
        };

        setData(mockData);
        
        // Calculate immediately using the mock data object to avoid state update latency
        const mockCalculation = calculateWorkforce(mockData);
        setResult(mockCalculation);
        setAiAnalysis(null);
    }, [settings]);

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

        // Determine if we should create a new record or update an existing one
        let finalId = data.id;
        let shouldCreateNew = false;
        let userMessage = "";

        if (!finalId) {
            // No ID yet = New Record
            finalId = crypto.randomUUID();
            shouldCreateNew = true;
            userMessage = "Zapisano nowy raport!";
        } else {
            // ID exists, check history
            const existingRecord = history.find(h => h.id === finalId);
            
            if (existingRecord) {
                if (existingRecord.data.date !== data.date) {
                    // Date changed = New Record (don't overwrite history from other days)
                    finalId = crypto.randomUUID();
                    shouldCreateNew = true;
                    userMessage = `Utworzono nowy zapis dla daty ${data.date}!`;
                } else {
                    // Date matches = Update existing
                    shouldCreateNew = false;
                    userMessage = "Zaktualizowano istniejący zapis.";
                }
            } else {
                // ID in state but not in history (rare case) = New Record
                finalId = crypto.randomUUID();
                shouldCreateNew = true;
                userMessage = "Zapisano nowy raport!";
            }
        }

        const newRecord: HistoryRecord = {
            id: finalId,
            timestamp: Date.now(),
            data: { ...data, id: finalId }, // Ensure data has the correct ID
            result: calculation,
            aiAnalysis: aiAnalysis || undefined
        };

        setHistory(prev => {
            if (shouldCreateNew) {
                // Add new record to the top
                return [newRecord, ...prev];
            } else {
                // Update existing record
                return prev.map(item => item.id === finalId ? newRecord : item);
            }
        });

        // Update current state ID to match
        setData(prev => ({ ...prev, id: finalId }));
        
        alert(userMessage);
    };

    const handleEditHistory = (record: HistoryRecord) => {
        // First set the data
        setData(record.data);
        setResult(record.result);
        
        // Explicitly handle AI analysis state
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

    const handleUpdateSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
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

    const renderView = () => {
        switch (currentView) {
            case 'calculator':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        <div className="lg:col-span-4 h-full">
                            <CalculatorForm
                                data={data}
                                setData={setData}
                                onCalculate={handleCalculate}
                                onImport={handleImport}
                                onSave={handleSave}
                                isUpdateMode={isUpdateMode}
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
                );
            case 'history':
                return (
                    <HistoryView 
                        history={history} 
                        onEdit={handleEditHistory} 
                        onDelete={handleDeleteHistory}
                        onExport={handleExportExcel}
                    />
                );
            case 'settings':
                return (
                    <SettingsView 
                        settings={settings} 
                        onSave={handleUpdateSettings} 
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-background text-text font-sans flex flex-col">
            <Header 
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenInfo={() => setIsInfoOpen(true)} 
            />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderView()}
            </main>
            
            <CalculationInfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)} 
            />
        </div>
    );
}

export default App;
