import React from 'react';
import { Warehouse, HelpCircle, Calculator, History, Settings, Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface HeaderProps {
    onOpenInfo?: () => void;
    currentView: 'calculator' | 'history' | 'settings';
    onNavigate: (view: 'calculator' | 'history' | 'settings') => void;
    isCloudEnabled?: boolean;
    isSyncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenInfo, currentView, onNavigate, isCloudEnabled, isSyncing }) => {
    
    const getButtonClass = (viewName: string) => {
        const isActive = currentView === viewName;
        return `flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-all ${
            isActive 
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                : 'text-text-secondary hover:text-text hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
        }`;
    };

    return (
        <header className="bg-card shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                <div 
                    className="flex items-center cursor-pointer group" 
                    onClick={() => onNavigate('calculator')}
                >
                    <Warehouse className="w-8 h-8 text-primary transition-transform group-hover:scale-105" />
                    <h1 className="ml-3 text-xl md:text-2xl font-bold text-text hidden sm:block">
                        kalkulator_magazynowy
                    </h1>
                </div>
                
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => onNavigate('calculator')}
                        className={getButtonClass('calculator')}
                    >
                        <Calculator size={18} />
                        <span>Kalkulator</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('history')}
                        className={getButtonClass('history')}
                    >
                        <History size={18} />
                        <span>Historia</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('settings')}
                        className={getButtonClass('settings')}
                    >
                        <Settings size={18} />
                        <span className="hidden sm:inline">Ustawienia</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 ml-auto md:ml-0">
                    {/* Cloud Status Indicator */}
                    <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                        isCloudEnabled 
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                            : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                    }`}>
                        {isSyncing ? (
                             <RefreshCw size={14} className="animate-spin" />
                        ) : isCloudEnabled ? (
                            <Cloud size={14} />
                        ) : (
                            <CloudOff size={14} />
                        )}
                        <span>{isCloudEnabled ? (isSyncing ? 'Sync...' : 'Online') : 'Lokalnie'}</span>
                    </div>

                    {onOpenInfo && (
                        <button 
                            type="button"
                            onClick={onOpenInfo}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                            <HelpCircle size={18} />
                            <span className="hidden md:inline">Pomoc</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;