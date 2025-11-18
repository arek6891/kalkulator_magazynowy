
import React from 'react';
import { X, Calculator, Clock, Zap, Users, AlertTriangle } from 'lucide-react';

interface CalculationInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CalculationInfoModal: React.FC<CalculationInfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                        <Calculator className="text-primary" />
                        Metodologia Obliczeń
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 text-text">
                    
                    {/* Section 1: Effective Time */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
                            <Clock size={20} />
                            1. Efektywny Czas Pracy (Net Available Time)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Najpierw obliczamy, ile czasu realnie pracownik spędza na procesie, odejmując przerwy i uwzględniając współczynnik wydajności (OEE/zmęczenie).
                        </p>
                        <div className="bg-background p-4 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700">
                            <div className="mb-2">
                                <span className="font-bold text-blue-500">Czas Netto</span> = Czas Zmiany - Czas Przerw
                            </div>
                            <div>
                                <span className="font-bold text-green-500">Efektywny Czas (h)</span> = Czas Netto × (Wydajność / 100)
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary mt-2">
                            Np. 8h zmiany - 30 min przerwy = 7.5h. Przy wydajności 85%, efektywny czas to <strong>6.375h</strong>.
                        </p>
                    </section>

                    {/* Section 2: Workload */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
                            <Zap size={20} />
                            2. Pracochłonność (Workload)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Obliczamy ile roboczogodzin (man-hours) potrzeba na wykonanie zadań przy założonych normach.
                        </p>
                        <div className="bg-background p-4 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700">
                            <span className="font-bold text-purple-500">Roboczogodziny</span> = Wolumen / Norma na godzinę
                        </div>
                    </section>

                    {/* Section 3: FTE */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
                            <Users size={20} />
                            3. Zapotrzebowanie (FTE)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Dzielimy pracochłonność przez efektywny czas pracy pojedynczego człowieka. Wynik zaokrąglamy w górę (sufit), aby zapewnić pokrycie procesu.
                        </p>
                        <div className="bg-background p-4 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700">
                            <span className="font-bold text-orange-500">FTE</span> = Roboczogodziny / Efektywny Czas (h)
                        </div>
                    </section>

                    {/* Section 4: Shortages (Braki) */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
                            <AlertTriangle size={20} />
                            4. Braki (Luka Kadrowa)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Jest to kluczowy wskaźnik operacyjny pokazujący, ilu pracowników brakuje do zrealizowania planu przy założonych standardach.
                        </p>
                        <div className="bg-background p-4 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700">
                            <span className="font-bold text-red-500">Braki</span> = Wymagane FTE - Obecni Pracownicy
                        </div>
                        <p className="text-xs text-text-secondary mt-2">
                            Jeśli wynik jest dodatni (np. +3), oznacza to konieczność dołożenia 3 osób (lub nadgodzin).<br/>
                            Jeśli wynik jest 0 lub ujemny, obsada jest wystarczająca.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-background/50">
                    <button 
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Rozumiem
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalculationInfoModal;
