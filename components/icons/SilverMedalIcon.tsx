import React from 'react';

const SilverMedalIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-label="Silver Medal, 2nd Place">
        <defs>
            <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#e0e0e0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#c0c0c0', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#silver-gradient)" stroke="#a9a9a9" strokeWidth="1.5" />
        <text x="12" y="15" textAnchor="middle" fontSize="12" fill="#4a4a4a" fontWeight="bold">2</text>
    </svg>
);

export default SilverMedalIcon;
