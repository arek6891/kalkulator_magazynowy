
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { Save, RotateCcw, Settings, CheckCircle2 } from 'lucide-react';
import InputField from './InputField';
import Button from './Button';

interface SettingsViewProps {
    settings: AppSettings;
    onSave: (newSettings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleSave = () => {
        onSave(localSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleReset = () => {
        const defaults: AppSettings = {
            defaultWorkHours: 8,
            defaultBreakTime: 30,
            defaultEfficiency: 85
        };
        setLocalSettings(defaults);
        onSave(defaults);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="flex justify-center h-full">
            <div className="w-full max-w-2xl bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-2xl font-bold text-text flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-primary">
                            <Settings size={24} />
                        </div>
                        Ustawienia Aplikacji
                    </h2>
                    <p className="text-text-secondary mt-1 ml-11">
                        Zdefiniuj domyślne wartości, które będą używane przy każdym nowym obliczeniu.
                    </p>
                </div>

                <div className="p-8 space-y-8 flex-grow">
                    
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-text border-b border-gray-100 dark:border-gray-700 pb-2">
                            Domyślne Parametry Zmiany
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Domyślny czas zmiany (h)" 
                                name="defaultWorkHours" 
                                value={localSettings.defaultWorkHours} 
                                onChange={handleChange} 
                            />
                            <InputField 
                                label="Domyślny czas przerw (min)" 
                                name="defaultBreakTime" 
                                value={localSettings.defaultBreakTime} 
                                onChange={handleChange} 
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-text border-b border-gray-100 dark:border-gray-700 pb-2">
                            Domyślne Parametry Wydajności
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Domyślna wydajność procesu (%)" 
                                name="defaultEfficiency" 
                                value={localSettings.defaultEfficiency} 
                                onChange={handleChange} 
                            />
                        </div>
                        <p className="text-sm text-text-secondary bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <strong>Wskazówka:</strong> Standard logistyczny OEE zakłada wydajność na poziomie 85%. Zmieniając tę wartość, wpływasz na to, jak agresywnie system wylicza "Efektywny czas pracy".
                        </p>
                    </section>

                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button variant="secondary" onClick={handleReset} className="text-red-600 hover:bg-red-50 w-full sm:w-auto">
                        <RotateCcw size={18} className="mr-2" />
                        Przywróć Domyślne
                    </Button>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {showSuccess && (
                            <span className="text-green-600 font-medium flex items-center gap-1 animate-fade-in">
                                <CheckCircle2 size={18} />
                                Zapisano!
                            </span>
                        )}
                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            <Save size={18} className="mr-2" />
                            Zapisz Ustawienia
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
