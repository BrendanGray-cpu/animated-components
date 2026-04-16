import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CustomButtonProps {
  children: ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'default';
}

export default function CustomButton({ children, onClick, color = 'default' }: CustomButtonProps) {
  const colors = {
    primary: {
      background: '#2e7d32',
      color: '#ffffff',
      border: '#2e7d32',
    },
    secondary: {
      background: '#f5f5f5',
      color: '#333333',
      border: '#d0d0d0',
    },
    default: {
      background: '#ffffff',
      color: '#333333',
      border: '#d0d0d0',
    },
  };

  const style = colors[color];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: `1px solid ${style.border}`,
        background: style.background,
        color: style.color,
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </motion.button>
  );
}
