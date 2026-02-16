import React from 'react';

const BronzeMedalIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-label="Bronze Medal, 3rd Place">
        <defs>
            <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#cd7f32', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#a0522d', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#bronze-gradient)" stroke="#8b4513" strokeWidth="1.5" />
        <text x="12" y="15" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">3</text>
    </svg>
);

export default BronzeMedalIcon;
