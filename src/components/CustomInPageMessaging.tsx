import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface CustomInPageMessagingProps {
  type: 'error' | 'warning' | 'info' | 'success';
  body: string;
}

export default function CustomInPageMessaging({ type, body }: CustomInPageMessagingProps) {
  const config = {
    error: {
      icon: AlertCircle,
      backgroundColor: '#FEE',
      borderColor: '#FCC',
      iconColor: '#B71C1C',
      textColor: '#B71C1C',
    },
    warning: {
      icon: AlertTriangle,
      backgroundColor: '#FFF8E1',
      borderColor: '#FFECB3',
      iconColor: '#F57C00',
      textColor: '#E65100',
    },
    info: {
      icon: Info,
      backgroundColor: '#E3F2FD',
      borderColor: '#BBDEFB',
      iconColor: '#1976D2',
      textColor: '#0D47A1',
    },
    success: {
      icon: CheckCircle,
      backgroundColor: '#E8F5E9',
      borderColor: '#C8E6C9',
      iconColor: '#388E3C',
      textColor: '#1B5E20',
    },
  };

  const style = config[type];
  const IconComponent = style.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: style.backgroundColor,
        border: `1px solid ${style.borderColor}`,
        borderRadius: '6px',
      }}
    >
      <IconComponent size={16} color={style.iconColor} />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: style.textColor,
        }}
      >
        {body}
      </span>
    </div>
  );
}
