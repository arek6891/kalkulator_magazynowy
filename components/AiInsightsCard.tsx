
import React from 'react';
import { Zap, Loader2, RefreshCcw } from 'lucide-react';

interface AiInsightsCardProps {
    analysis: string | null;
    isLoading: boolean;
    onGenerate: () => void;
}

const AiInsightsCard: React.FC<AiInsightsCardProps> = ({ analysis, isLoading, onGenerate }) => {
    return (
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-indigo-50 dark:border-gray-700 relative overflow-hidden h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-xl font-bold text-text flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-primary">
                        <Zap size={20} />
                    </div>
                    Analityk AI
                </h3>
                <button 
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                    {analysis ? 'Odśwież analizę' : 'Generuj analizę'}
                </button>
            </div>

            <div className="relative z-10 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-primary animate-pulse">
                        <Zap size={32} className="mb-3" />
                        <p className="text-sm font-medium">Analizuję wydajność procesu...</p>
                    </div>
                ) : analysis ? (
                    <div className="prose prose-sm text-text max-w-none dark:prose-invert">
                         {/* Simple markdown rendering for bolding and lists */}
                         {analysis.split('\n').map((line, i) => {
                            if (line.startsWith('- ') || line.startsWith('* ')) {
                                return <li key={i} className="ml-4 list-disc marker:text-primary">{line.replace(/[-*] /, '')}</li>;
                            }
                            if (line.trim().length === 0) return <br key={i}/>;
                            // Bold parsing simple
                            const parts = line.split('**');
                            return (
                                <p key={i} className="mb-2 leading-relaxed">
                                    {parts.map((part, idx) => 
                                        idx % 2 === 1 ? <strong key={idx} className="text-primary font-bold bg-indigo-50 dark:bg-indigo-900/20 px-1 rounded">{part}</strong> : part
                                    )}
                                </p>
                            );
                         })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center h-full min-h-[100px]">
                        <p className="text-text-secondary italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                            "Kliknij <strong>Generuj</strong>, aby otrzymać porady operacyjne oparte na Twoich wynikach."
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiInsightsCard;
