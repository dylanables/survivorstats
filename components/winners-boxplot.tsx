"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Customized,
  Bar,
} from "recharts";
import React from "react";

export default function WinnersBoxPlot() {
  const winners = [
    39, 39, 27, 36, 34, 21, 29, 25, 33, 41, 30, 24, 31, 35, 22, 25, 57, 24, 26,
    35, 21, 34, 22, 29, 41, 25, 34, 39, 28, 38, 37, 24, 25, 32, 34, 33, 27, 25,
    26, 45, 32, 24, 52,
  ];

  const sorted = [...winners].sort((a, b) => a - b);

  const getMedian = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0
      ? arr[mid]
      : (arr[mid - 1] + arr[mid]) / 2;
  };

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const q1 = getMedian(sorted.slice(0, Math.floor(sorted.length / 2)));
  const q3 = getMedian(sorted.slice(Math.ceil(sorted.length / 2)));
  const median = getMedian(sorted);

  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter((age) => age < lowerFence || age > upperFence);

  const boxplotData = [
    {
      name: "Winner Ages",
      value: median, // used to trigger tooltip
      min,
      q1,
      median,
      q3,
      max,
      outliers,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded border border-gray-300 bg-white/90 p-3 shadow text-sm leading-relaxed">
          <p><strong>{data.name}</strong></p>
          <p>Min: {data.min}</p>
          <p>Q1: {data.q1}</p>
          <p>Median: {data.median}</p>
          <p>Q3: {data.q3}</p>
          <p>Max: {data.max}</p>
          {data.outliers.length > 0 && <p>Outliers: {data.outliers.join(", ")}</p>}
        </div>
      );
    }
    return null;
  };

  const CustomBoxPlot = (props: any) => {
    const { xAxisMap, yAxisMap, data } = props;
    const xScale = xAxisMap[0].scale;
    const yScale = yAxisMap[0].scale;
    const yBandwidth = yScale.bandwidth();
    const yCenter = yScale("Winner Ages") + yBandwidth / 2;

    const item = data[0];
    const toX = (v: number) => xScale(v);

    return (
      <g>
        {/* IQR box */}
        <rect
          x={toX(item.q1)}
          y={yCenter - 10}
          width={toX(item.q3) - toX(item.q1)}
          height={20}
          fill="#4682B4"
          stroke="black"
        />
        {/* Median line */}
        <line
          x1={toX(item.median)}
          x2={toX(item.median)}
          y1={yCenter - 10}
          y2={yCenter + 10}
          stroke="black"
          strokeWidth={2}
        />
        {/* Whiskers */}
        <line
          x1={toX(item.min)}
          x2={toX(item.q1)}
          y1={yCenter}
          y2={yCenter}
          stroke="black"
        />
        <line
          x1={toX(item.max)}
          x2={toX(item.q3)}
          y1={yCenter}
          y2={yCenter}
          stroke="black"
        />
        {/* Whisker caps */}
        <line x1={toX(item.min)} x2={toX(item.min)} y1={yCenter - 5} y2={yCenter + 5} stroke="black" />
        <line x1={toX(item.max)} x2={toX(item.max)} y1={yCenter - 5} y2={yCenter + 5} stroke="black" />

        {/* Outliers */}
        {item.outliers.map((o: number, i: number) => (
          <circle key={`o-${i}`} cx={toX(o)} cy={yCenter} r={4} fill="red" />
        ))}
      </g>
    );
  };

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          layout="vertical"
          data={boxplotData}
          margin={{ top: 20, right: 30, bottom: 20, left: 80 }}
        >
          <XAxis type="number" domain={[20, 60]}>
            <Label value="Age" position="insideBottom" offset={-10} />
          </XAxis>
          <YAxis type="category" dataKey="name" />

          {/* Invisible bar to enable tooltip */}
          <Bar dataKey="value" fill="transparent" />

          <Tooltip content={<CustomTooltip />} />
          <Customized component={CustomBoxPlot} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
