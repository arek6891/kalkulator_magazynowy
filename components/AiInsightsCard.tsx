
import React from 'react';
import { Sparkles, Loader2, RefreshCcw } from 'lucide-react';

interface AiInsightsCardProps {
    analysis: string | null;
    isLoading: boolean;
    onGenerate: () => void;
}

const AiInsightsCard: React.FC<AiInsightsCardProps> = ({ analysis, isLoading, onGenerate }) => {
    return (
        // Changed to white background with indigo border for maximum readability
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-50 relative overflow-hidden h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Sparkles className="text-indigo-600" size={20} />
                    </div>
                    Analityk AI
                </h3>
                <button 
                    onClick={onGenerate}
                    disabled={isLoading}
                    // High contrast button: Indigo background, white text
                    className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                    {analysis ? 'Odśwież analizę' : 'Generuj analizę'}
                </button>
            </div>

            <div className="relative z-10 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-indigo-500 animate-pulse">
                        <Sparkles size={32} className="mb-3" />
                        <p className="text-sm font-medium">Analizuję wydajność procesu...</p>
                    </div>
                ) : analysis ? (
                    <div className="prose prose-sm text-gray-700 max-w-none">
                         {/* Simple markdown rendering for bolding and lists */}
                         {analysis.split('\n').map((line, i) => {
                            if (line.startsWith('- ') || line.startsWith('* ')) {
                                return <li key={i} className="ml-4 list-disc marker:text-indigo-500">{line.replace(/[-*] /, '')}</li>;
                            }
                            if (line.trim().length === 0) return <br key={i}/>;
                            // Bold parsing simple
                            const parts = line.split('**');
                            return (
                                <p key={i} className="mb-2 leading-relaxed">
                                    {parts.map((part, idx) => 
                                        idx % 2 === 1 ? <strong key={idx} className="text-indigo-900 font-bold bg-indigo-50 px-1 rounded">{part}</strong> : part
                                    )}
                                </p>
                            );
                         })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center h-full min-h-[100px]">
                        <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                            "Kliknij <strong>Generuj</strong>, aby otrzymać porady operacyjne oparte na Twoich wynikach."
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiInsightsCard;
