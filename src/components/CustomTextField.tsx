import React, { ReactNode } from 'react';

interface CustomTextFieldProps {
  variant?: 'single' | 'default';
  placeholder?: string;
  width?: number;
  value?: string;
  status?: 'error';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  InputProps?: {
    startAdornment?: ReactNode;
    sx?: any;
  };
}

export default function CustomTextField({
  variant,
  placeholder = '',
  width = 100,
  value,
  status,
  onChange,
  onFocus,
  onBlur,
  InputProps,
}: CustomTextFieldProps) {
  const isError = status === 'error';
  const borderColor = isError ? '#B71C1C' : '#d0d0d0';
  const focusBorderColor = isError ? '#B71C1C' : '#00618B';

  return (
    <div style={{ width: `${width}%`, position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${borderColor}`,
          borderRadius: variant === 'single' ? '999px' : '6px',
          padding: variant === 'single' ? '10px 16px' : '8px 12px',
          backgroundColor: '#ffffff',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => {
          const container = e.currentTarget;
          container.style.borderColor = focusBorderColor;
        }}
        onBlur={(e) => {
          const container = e.currentTarget;
          container.style.borderColor = borderColor;
        }}
      >
        {InputProps?.startAdornment && (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
            {InputProps.startAdornment}
          </div>
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            color: '#333333',
          }}
        />
      </div>
    </div>
  );
}
