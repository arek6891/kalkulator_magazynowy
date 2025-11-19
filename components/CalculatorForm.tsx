
import React, { useState } from 'react';
import { WarehouseData } from '../types';
import InputField from './InputField';
import Button from './Button';
import SmartImportModal from './SmartImportModal';
import { Package, Truck, Download, Settings, Calendar, Save, Play, Sparkles, ClipboardList } from 'lucide-react';

interface CalculatorFormProps {
    data: WarehouseData;
    setData: React.Dispatch<React.SetStateAction<WarehouseData>>;
    onCalculate: () => void;
    onImport: () => void;
    onSave: () => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ data, setData, onCalculate, onImport, onSave }) => {
    const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: (name === 'date' || name === 'id') ? value : (value === '' ? '' : Number(value))
        }));
    };

    const handleParsedData = (parsed: Partial<WarehouseData>) => {
        setData(prev => ({
            ...prev,
            ...parsed
        }));
        // Optional: Auto trigger calculate if enough data
        // onCalculate(); 
    };

    return (
        <div className="p-5 bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            
            <SmartImportModal 
                isOpen={isSmartImportOpen} 
                onClose={() => setIsSmartImportOpen(false)} 
                onDataParsed={handleParsedData} 
            />

            <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-primary">
                        <ClipboardList size={20} />
                    </div>
                    Dane wejściowe
                </h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="date" className="sr-only">Data</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                        <input 
                            type="date" 
                            name="date"
                            id="date"
                            value={data.date || ''}
                            onChange={handleChange}
                            className="pl-9 pr-3 py-1.5 bg-background border border-gray-300 dark:border-gray-600 rounded-md text-sm text-text focus:ring-2 focus:ring-primary outline-none w-36 sm:w-auto"
                        />
                    </div>
                </div>
            </div>
            
            <div className="mb-4">
                 <button 
                    onClick={() => setIsSmartImportOpen(true)}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm group"
                 >
                    <Sparkles size={16} className="group-hover:animate-pulse" />
                    Inteligentny Import (Wklej Tekst)
                 </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="space-y-5 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                
                <fieldset className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 pt-4 relative">
                    <legend className="text-sm font-semibold flex items-center gap-2 px-2 text-text bg-card absolute -top-3 left-2">
                        <span className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                            <Truck size={16} />
                        </span>
                        Dostawy
                    </legend>
                    <div className="space-y-3 mt-1">
                        <InputField label="Ilość dostaw (dziennie)" name="deliveries" value={data.deliveries} onChange={handleChange} />
                        <InputField label="Śr. ilość art. w dostawie" name="itemsPerDelivery" value={data.itemsPerDelivery} onChange={handleChange} />
                        <InputField label="Dostaw na godz./pracownika" name="deliveriesPerHour" value={data.deliveriesPerHour} onChange={handleChange} />
                    </div>
                </fieldset>
                
                <fieldset className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 pt-4 relative">
                     <legend className="text-sm font-semibold flex items-center gap-2 px-2 text-text bg-card absolute -top-3 left-2">
                        <span className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                            <Package size={16} />
                        </span>
                        Zlecenia
                    </legend>
                    <div className="space-y-3 mt-1">
                        <InputField label="Ilość zleceń (dziennie)" name="orders" value={data.orders} onChange={handleChange} />
                        <InputField label="Śr. ilość art. w zleceniu" name="itemsPerOrder" value={data.itemsPerOrder} onChange={handleChange} />
                        <InputField label="Sztuk zebranych / h / os." name="itemsPickedPerHour" value={data.itemsPickedPerHour} onChange={handleChange} />
                        <InputField label="Zleceń spakowanych / h / os." name="ordersPackedPerHour" value={data.ordersPackedPerHour} onChange={handleChange} />
                    </div>
                </fieldset>
                
                <fieldset className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 pt-4 relative">
                     <legend className="text-sm font-semibold flex items-center gap-2 px-2 text-text bg-card absolute -top-3 left-2">
                        <span className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                            <Settings size={16} />
                        </span>
                        Standardy Logistyczne
                    </legend>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <InputField label="Czas zmiany (h)" name="workHours" value={data.workHours} onChange={handleChange} />
                        <InputField label="Pracownicy (ob.)" name="currentEmployees" value={data.currentEmployees} onChange={handleChange} />
                        <InputField label="Przerwy (min)" name="breakTime" value={data.breakTime} onChange={handleChange} />
                        <InputField label="Wydajność (%)" name="processEfficiency" value={data.processEfficiency} onChange={handleChange} />
                    </div>
                </fieldset>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3 shrink-0">
                <Button 
                    type="submit" 
                    onClick={onCalculate} 
                    fullWidth 
                    className="py-3 text-lg shadow-md"
                >
                    <Play size={20} className="mr-2 fill-current" />
                    Oblicz Zapotrzebowanie
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        onClick={onSave} 
                        variant="secondary" 
                        fullWidth 
                        className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                        <Save size={18} className="mr-2" />
                        {data.id ? 'Aktualizuj' : 'Zapisz'}
                    </Button>

                    <Button onClick={onImport} variant="secondary" fullWidth>
                        <Download size={18} className="mr-2"/>
                        Demo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CalculatorForm;
