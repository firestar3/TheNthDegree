import React from 'react';

const GoldMedalIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-label="Gold Medal, 1st Place">
        <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f7b500', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#gold-gradient)" stroke="#b8860b" strokeWidth="1.5" />
        <text x="12" y="15" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">1</text>
    </svg>
);

export default GoldMedalIcon;
