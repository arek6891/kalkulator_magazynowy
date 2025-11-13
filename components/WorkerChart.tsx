
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WorkerChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

const WorkerChart: React.FC<WorkerChartProps> = ({ data }) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = <T extends { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number; }> (
        { cx, cy, midAngle, innerRadius, outerRadius, percent, index }: T
    ) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        if (percent * 100 < 5) return null;

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--card-color)',
                        borderColor: 'var(--primary-color)'
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default WorkerChart;
