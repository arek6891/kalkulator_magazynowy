
import React, { useState, useCallback } from 'react';
import { CalculationResult, WarehouseData } from './types';
import { calculateWorkforce } from './services/calculationService';
import CalculatorForm from './components/CalculatorForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { Sun, Moon } from 'lucide-react';

const mockData: WarehouseData = {
    deliveries: 25,
    itemsPerDelivery: 100,
    timePerDelivery: 45,
    orders: 150,
    itemsPerOrder: 5,
    timePerItemPick: 2,
    timePerOrderPack: 10,
    workHours: 8,
};

const initialWarehouseData: WarehouseData = {
    deliveries: 0,
    itemsPerDelivery: 0,
    timePerDelivery: 0,
    orders: 0,
    itemsPerOrder: 0,
    timePerItemPick: 0,
    timePerOrderPack: 0,
    workHours: 8,
};

function App() {
    const [data, setData] = useState<WarehouseData>(initialWarehouseData);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleCalculate = useCallback(() => {
        const calculation = calculateWorkforce(data);
        setResult(calculation);
    }, [data]);

    const handleImport = useCallback(() => {
        setData(mockData);
        const calculation = calculateWorkforce(mockData);
        setResult(calculation);
    }, []);
    
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
        document.body.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-background text-text font-sans transition-colors duration-300">
            <Header />
             <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 z-50 p-2 rounded-full bg-card text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <CalculatorForm
                            data={data}
                            setData={setData}
                            onCalculate={handleCalculate}
                            onImport={handleImport}
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <Dashboard result={result} inputData={data} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
