import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { tableTradesColumns } from '../../constants/tradeConstants';

type ChartPanelProps = {
  data: any[];
};

const SUM_METRICS = new Set(['Обєм', 'Комісія', 'Маржа']);
const AVG_METRICS = new Set(['Кредитне_плече', 'Дельта']);

const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
  const numericCols = tableTradesColumns
    .filter(col => [...SUM_METRICS, ...AVG_METRICS].includes(col.key))
    .map(col => ({ key: col.key, label: col.header }));

  const [metric, setMetric] = useState(numericCols[0].key);

  // Підготовка відсортованих даних з __ts
  const sortedData = useMemo(() => {
    return data
      .map(item => ({
        ...item,
        __ts: new Date(item.Дата_створення.split('.').reverse().join('-')).getTime()
      }))
      .sort((a, b) => a.__ts - b.__ts);
  }, [data]);

  // Групування за датою (день) та агрегування
  const chartData = useMemo(() => {
    const map: Record<number, { __ts: number; sum: number; count: number }> = {};
    sortedData.forEach(item => {
      const day = Math.floor(item.__ts / 86400000) * 86400000; // початок дня
      if (!map[day]) {
        map[day] = { __ts: day, sum: 0, count: 0 };
      }
      map[day].sum += Number(item[metric]);
      map[day].count += 1;
    });
    return Object.values(map)
      .map(({ __ts, sum, count }) => ({
        __ts,
        [metric]: SUM_METRICS.has(metric) ? sum : sum / count
      }))
      .sort((a, b) => a.__ts - b.__ts);
  }, [sortedData, metric]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <div style={{ marginBottom: 10 }}>
        <label>Графік по:</label>
        <select value={metric} onChange={e => setMetric(e.target.value)}>
          {numericCols.map(c =>
            <option key={c.key} value={c.key}>{c.label}</option>
          )}
        </select>
      </div>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="__ts"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={ts => new Date(ts).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={ts => new Date(ts).toLocaleDateString()}
          />
          <Legend />
          <Line
            name={numericCols.find(c => c.key === metric)?.label}
            type="monotone"
            dataKey={metric}
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPanel;