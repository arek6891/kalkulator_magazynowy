
import React from 'react';
import { Warehouse } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-card shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4 flex items-center">
                <Warehouse className="w-8 h-8 text-primary" />
                <h1 className="ml-3 text-2xl font-bold text-text">
                    Kalkulator Pracowników Magazynu
                </h1>
            </div>
        </header>
    );
};

export default Header;
