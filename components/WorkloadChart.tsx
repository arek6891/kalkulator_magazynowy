
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WorkloadChartProps {
    data: { name: string; dostawy: number; zlecenia: number }[];
}

const WorkloadChart: React.FC<WorkloadChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: '#1f2937'
                    }}
                    itemStyle={{ color: '#1f2937' }}
                 />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                {/* Updated colors: Deliveries (Sky-500), Orders (Indigo-600) */}
                <Bar dataKey="dostawy" fill="#0ea5e9" name="Dostawy" radius={[4, 4, 0, 0]} />
                <Bar dataKey="zlecenia" fill="#4f46e5" name="Zlecenia" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default WorkloadChart;
