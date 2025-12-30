/**
 * SparklineGraph Component
 * 
 * A simple SVG sparkline for displaying CPU/RAM usage history
 */

import React from 'react';

interface SparklineGraphProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    fillColor?: string;
    showArea?: boolean;
    min?: number;
    max?: number;
    className?: string;
}

export const SparklineGraph: React.FC<SparklineGraphProps> = ({
    data,
    width = 100,
    height = 30,
    color = 'var(--accent-primary)',
    fillColor = 'rgba(93, 233, 182, 0.2)',
    showArea = true,
    min = 0,
    max = 100,
    className = '',
}) => {
    if (!data || data.length === 0) {
        return (
            <svg width={width} height={height} className={`sparkline ${className}`}>
                <line
                    x1={0}
                    y1={height / 2}
                    x2={width}
                    y2={height / 2}
                    stroke="var(--border-color)"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                />
            </svg>
        );
    }

    // Normalize data to fit within height
    const range = max - min;
    const normalizedData = data.map((value) => {
        const clamped = Math.max(min, Math.min(max, value));
        return ((clamped - min) / range) * height;
    });

    // Generate points for the polyline
    const stepX = width / (data.length - 1 || 1);
    const points = normalizedData.map((y, i) => {
        const x = i * stepX;
        const flippedY = height - y; // SVG y-axis is inverted
        return `${x},${flippedY}`;
    }).join(' ');

    // Generate area path (for filled area under the line)
    const areaPath = `M 0,${height} L ${normalizedData.map((y, i) => {
        const x = i * stepX;
        const flippedY = height - y;
        return `${x},${flippedY}`;
    }).join(' L ')} L ${width},${height} Z`;

    // Get current value for display
    const currentValue = data[data.length - 1];

    return (
        <svg
            width={width}
            height={height}
            className={`sparkline ${className}`}
            style={{ overflow: 'visible' }}
        >
            {/* Fill area */}
            {showArea && (
                <path
                    d={areaPath}
                    fill={fillColor}
                />
            )}

            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Current value dot */}
            {data.length > 0 && normalizedData.length > 0 && (
                <circle
                    cx={width}
                    cy={height - (normalizedData[normalizedData.length - 1] ?? 0)}
                    r={3}
                    fill={color}
                />
            )}
        </svg>
    );
};

/**
 * Format percentage for display
 */
export const formatPercent = (value: number): string => {
    return `${Math.round(value)}%`;
};

/**
 * Format memory (bytes) for display
 */
export const formatMemory = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default SparklineGraph;
