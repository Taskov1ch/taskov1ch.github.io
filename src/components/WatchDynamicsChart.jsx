import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const processChartData = (dynamics) => {
  if (!dynamics || dynamics.length === 0) {
    return [];
  }

  const sortedDynamics = [...dynamics].sort((a, b) => a.timestamp - b.timestamp);

  return sortedDynamics.map((item) => {
    const date = new Date(item.timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("ru-RU", { month: "short" });

    return {
      name: `${day} ${month.replace('.', '')}`,
      "Просмотрено серий": item.count,
    };
  });
};

const WatchDynamicsChart = ({ data }) => {
  const chartData = processChartData(data);

  if (chartData.length === 0) {
    return <p>Недостаточно данных для построения графика.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--dark-bg)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
          labelStyle={{ color: "var(--primary-blue)" }}
        />
        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}/>
        <Bar dataKey="Просмотрено серий" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WatchDynamicsChart;