import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { parseWarehouseText } from '../services/aiService';
import { WarehouseData } from '../types';
import Button from './Button';

interface SmartImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataParsed: (data: Partial<WarehouseData>) => void;
}

const SmartImportModal: React.FC<SmartImportModalProps> = ({ isOpen, onClose, onDataParsed }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const parsedData = await parseWarehouseText(text);
            onDataParsed(parsedData);
            onClose();
            setText('');
        } catch (err) {
            setError("Nie udało się odczytać danych. Spróbuj sformułować tekst inaczej.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                        <Sparkles className="text-primary fill-primary/20" />
                        Inteligentny Import (AI)
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-text-secondary">
                        Wklej treść e-maila, wiadomości Slack lub notatki (np. <i>"Jutro mamy 30 dostaw po 100 palet i 5000 zamówień"</i>). AI automatycznie uzupełni formularz.
                    </p>
                    
                    <textarea
                        className="w-full h-32 p-3 bg-background border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text resize-none"
                        placeholder="Wklej tekst tutaj..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>

                <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Anuluj
                    </Button>
                    <Button onClick={handleAnalyze} disabled={isLoading || !text.trim()}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" size={18} />
                                Analizowanie...
                            </>
                        ) : (
                            <>
                                Przetwórz
                                <ArrowRight className="ml-2" size={18} />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SmartImportModal;