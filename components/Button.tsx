
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
    
    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
        secondary: 'bg-card text-text-secondary border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-primary'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
