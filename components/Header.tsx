
import React from 'react';
import { Warehouse, HelpCircle, Calculator, History, Settings } from 'lucide-react';

interface HeaderProps {
    onOpenInfo?: () => void;
    currentView: 'calculator' | 'history' | 'settings';
    onNavigate: (view: 'calculator' | 'history' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenInfo, currentView, onNavigate }) => {
    
    const getButtonClass = (viewName: string) => {
        return `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentView === viewName 
                ? 'bg-card text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text'
        }`;
    };

    return (
        <header className="bg-card shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center cursor-pointer" onClick={() => onNavigate('calculator')}>
                    <Warehouse className="w-8 h-8 text-primary" />
                    <h1 className="ml-3 text-xl md:text-2xl font-bold text-text hidden sm:block">
                        Kalkulator Pracowników
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto">
                    <button
                        onClick={() => onNavigate('calculator')}
                        className={getButtonClass('calculator')}
                    >
                        <Calculator size={18} />
                        Kalkulator
                    </button>
                    <button
                        onClick={() => onNavigate('history')}
                        className={getButtonClass('history')}
                    >
                        <History size={18} />
                        Historia
                    </button>
                    <button
                        onClick={() => onNavigate('settings')}
                        className={getButtonClass('settings')}
                    >
                        <Settings size={18} />
                        <span className="hidden md:inline">Ustawienia</span>
                    </button>
                </div>

                {onOpenInfo && (
                    <button 
                        onClick={onOpenInfo}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors ml-auto md:ml-0"
                    >
                        <HelpCircle size={18} />
                        <span className="hidden md:inline">Jak to działa?</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
