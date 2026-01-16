import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CalculationResult, WarehouseData, HistoryRecord, AppSettings } from './types';
import { calculateWorkforce } from './services/calculationService';
import { generateOperationalInsights } from './services/aiService';
import { useHistory } from './hooks/useHistory';
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
    
    // Use the new History Hook
    const { 
        history, 
        addRecord, 
        updateRecord, 
        deleteRecord, 
        isCloudEnabled, 
        isSyncing 
    } = useHistory();
    
    // AI State
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

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
    
    const handleSave = async () => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);

        // Determine if we should create a new record or update an existing one
        let finalId = data.id;
        let shouldCreateNew = false;
        let userMessage = "";

        if (!finalId) {
            finalId = crypto.randomUUID();
            shouldCreateNew = true;
            userMessage = "Zapisano nowy raport!";
        } else {
            const existingRecord = history.find(h => h.id === finalId);
            
            if (existingRecord) {
                if (existingRecord.data.date !== data.date) {
                    finalId = crypto.randomUUID();
                    shouldCreateNew = true;
                    userMessage = `Utworzono nowy zapis dla daty ${data.date}!`;
                } else {
                    shouldCreateNew = false;
                    userMessage = "Zaktualizowano istniejący zapis.";
                }
            } else {
                finalId = crypto.randomUUID();
                shouldCreateNew = true;
                userMessage = "Zapisano nowy raport!";
            }
        }

        const newRecord: HistoryRecord = {
            id: finalId,
            timestamp: Date.now(),
            data: { ...data, id: finalId },
            result: calculation,
            aiAnalysis: aiAnalysis || undefined
        };

        if (shouldCreateNew) {
            await addRecord(newRecord);
        } else {
            await updateRecord(newRecord);
        }

        // Update current state ID to match
        setData(prev => ({ ...prev, id: finalId }));
        
        alert(userMessage);
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

    const handleDeleteHistory = async (id: string) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten zapis?")) {
            await deleteRecord(id);
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
                isCloudEnabled={isCloudEnabled}
                isSyncing={isSyncing}
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