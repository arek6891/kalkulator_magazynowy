
import React from 'react';
import { Warehouse, HelpCircle, Calculator, History } from 'lucide-react';

interface HeaderProps {
    onOpenInfo?: () => void;
    currentView: 'calculator' | 'history';
    onNavigate: (view: 'calculator' | 'history') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenInfo, currentView, onNavigate }) => {
    return (
        <header className="bg-card shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center cursor-pointer" onClick={() => onNavigate('calculator')}>
                    <Warehouse className="w-8 h-8 text-primary" />
                    <h1 className="ml-3 text-xl md:text-2xl font-bold text-text hidden sm:block">
                        Kalkulator Pracowników
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => onNavigate('calculator')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            currentView === 'calculator' 
                                ? 'bg-card text-primary shadow-sm' 
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        <Calculator size={18} />
                        Kalkulator
                    </button>
                    <button
                        onClick={() => onNavigate('history')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            currentView === 'history' 
                                ? 'bg-card text-primary shadow-sm' 
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        <History size={18} />
                        Historia
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
