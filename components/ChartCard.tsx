
import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-text">{title}</h3>
            <div className="h-64 md:h-80">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
