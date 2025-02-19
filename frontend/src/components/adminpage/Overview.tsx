import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as BarLegend } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
import { ResponsiveContainer } from 'recharts';

// Frequency data for trays
const frequencyData = [
  { date: '2025-02-15', 'Tray 01': 2, 'Tray 02': 1, 'Tray 03': 3, 'Tray 04': 0 },
  { date: '2025-02-16', 'Tray 01': 0, 'Tray 02': 2, 'Tray 03': 1, 'Tray 04': 3 },
  { date: '2025-02-17', 'Tray 01': 1, 'Tray 02': 3, 'Tray 03': 2, 'Tray 04': 1 },
  { date: '2025-02-18', 'Tray 01': 3, 'Tray 02': 0, 'Tray 03': 1, 'Tray 04': 2 },
  { date: '2025-02-19', 'Tray 01': 2, 'Tray 02': 1, 'Tray 03': 0, 'Tray 04': 3 },
];

// Pie chart data (Assuming total trays and loaned out/in bay trays for the last date in the data)
const pieData = [
  { name: 'Loaned Out', value: 7 }, // Loaned out trays (sum of tray loaned out in the last date)
  { name: 'In Bay', value: 3 },    // Trays remaining in the bay (sum of remaining trays in the last date)
];

export function Overview() {
  return (
    <div style={{ maxWidth: 1400, margin: 'auto', padding: '16px' }}>
      {/* Title */}
      <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Statistic Overview</h3>

      {/* Side-by-side layout for Bar Chart and Pie Chart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {/* Bar Chart inside ResponsiveContainer */}
        <div style={{ width: '48%' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '16px' }}>Tray Loan Frequency Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData} margin={{ top: 30, right: 30, left: 40, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              />
              <YAxis label={{ value: 'Duration (hr)', angle: -90, position: 'insideLeft', offset: 0 }} />
              <Tooltip />
              <BarLegend verticalAlign="bottom" align="center" />
              {/* Bars for each tray */}
              <Bar dataKey="Tray 01" name="Tray 01" fill="purple" />
              <Bar dataKey="Tray 02" name="Tray 02" fill="blue" />
              <Bar dataKey="Tray 03" name="Tray 03" fill="teal" />
              <Bar dataKey="Tray 04" name="Tray 04" fill="orange" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart inside ResponsiveContainer */}
        <div style={{ width: '48%' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '16px' }}>Current Tray Loaned</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                <Cell fill="#ff8042" />
                <Cell fill="#82ca9d" />
              </Pie>
              {/* Add Legend to Pie Chart */}
              <PieLegend verticalAlign="top" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
