import React from 'react';
import './ForestDisplay.css';

interface ForestDisplayProps {
    progress: number; // 0 to 1
    isWithered?: boolean;
}

const ForestDisplay: React.FC<ForestDisplayProps> = ({ progress, isWithered = false }) => {
    // Clamp progress between 0 and 1
    const growth = Math.min(Math.max(progress, 0), 1);
    const scale = 0.3 + (growth * 0.7); // Start at 30% size, grow to 100%

    return (
        <div className={`forest-container ${isWithered ? 'withered' : ''}`}>
            <svg
                viewBox="0 0 100 100"
                className="tree-svg"
                style={{ transform: `scale(${scale})` }}
            >
                {/* Trunk */}
                <path
                    d="M45,100 L55,100 L50,80 Z"
                    fill="#5D4037"
                    className="trunk"
                />
                <path
                    d="M50,85 L50,100"
                    stroke="#3E2723"
                    strokeWidth="2"
                />

                {/* Foliage Layers - appearing as progress increases */}
                <g className="foliage" style={{ opacity: growth > 0.1 ? 1 : 0.5 }}>
                    <path d="M50,85 L20,85 L50,45 L80,85 Z" fill="#2E7D32" />
                </g>

                <g className="foliage" style={{ opacity: growth > 0.4 ? 1 : 0, transform: 'translateY(-15px) scale(0.9)', transformOrigin: '50% 65px' }}>
                    <path d="M50,85 L20,85 L50,45 L80,85 Z" fill="#388E3C" />
                </g>

                <g className="foliage" style={{ opacity: growth > 0.7 ? 1 : 0, transform: 'translateY(-30px) scale(0.8)', transformOrigin: '50% 65px' }}>
                    <path d="M50,85 L20,85 L50,45 L80,85 Z" fill="#43A047" />
                </g>
            </svg>
            {isWithered && <span className="wither-text">Soldu</span>}
        </div>
    );
};

export default ForestDisplay;
