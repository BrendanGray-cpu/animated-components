import React from 'react';
import * as LucideIcons from 'lucide-react';

// Map of Fabric icon names to lucide-react icons
const iconMap: Record<string, any> = {
  'egg-solid': LucideIcons.Egg,
  'bird-solid': LucideIcons.Bird,
  'hand-solid': LucideIcons.Hand,
  'turtle-solid': LucideIcons.Turtle,
  'sparkle-solid': LucideIcons.Sparkles,
};

interface CustomActionTileProps {
  icon: string;
  title: string;
  titleSize?: 'small' | 'medium' | 'large';
  onClick: () => void;
  width?: string | number;
  height?: string | number;
}

export default function CustomActionTile({
  icon,
  title,
  titleSize = 'medium',
  onClick,
  width = 150,
  height = 120,
}: CustomActionTileProps) {
  const IconComponent = iconMap[icon] || LucideIcons.Circle;

  const titleSizes = {
    small: '16px',
    medium: '18px',
    large: '20px',
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #d0d0d0',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00618B';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#d0d0d0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#f5f5f5',
          color: '#2e7d32',
        }}
      >
        <IconComponent size={28} />
      </div>
      <span
        style={{
          fontSize: titleSizes[titleSize],
          fontWeight: 600,
          color: '#333333',
          textAlign: 'center',
        }}
      >
        {title}
      </span>
    </div>
  );
}
