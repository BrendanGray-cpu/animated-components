import React from 'react';
import { Loader2 } from 'lucide-react';

interface CustomSpinnerProps {
  size?: number;
}

export default function CustomSpinner({ size = 24 }: CustomSpinnerProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader2
        size={size}
        color="#2e7d32"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
