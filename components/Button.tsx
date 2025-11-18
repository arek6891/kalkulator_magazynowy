
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, className, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm',
        secondary: 'bg-card text-text-secondary border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    
    // Correctly merge classes so passed className extends base styles instead of replacing them
    const computedClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className || ''}`;

    return (
        <button className={computedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
