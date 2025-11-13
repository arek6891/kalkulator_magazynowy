
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary-color)" strokeOpacity={0.2}/>
                <XAxis dataKey="name" stroke="var(--text-secondary-color)" />
                <YAxis stroke="var(--text-secondary-color)" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--card-color)',
                        borderColor: 'var(--primary-color)'
                    }}
                 />
                <Legend />
                <Bar dataKey="dostawy" fill="#3b82f6" name="Dostawy"/>
                <Bar dataKey="zlecenia" fill="#8b5cf6" name="Zlecenia"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default WorkloadChart;
