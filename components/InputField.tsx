
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-text-secondary mb-1">
                {label}
            </label>
            <input
                id={props.name}
                type="number"
                min="0"
                {...props}
                className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
            />
        </div>
    );
};

export default InputField;
