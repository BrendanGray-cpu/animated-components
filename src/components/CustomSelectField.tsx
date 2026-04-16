import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectItem {
  text: string;
  value: string;
}

interface CustomSelectFieldProps {
  canSelectMultiple?: boolean;
  items: SelectItem[];
  label?: string;
  placeholder?: string;
  width?: number;
  value?: string[];
  onChange?: (e: { target: { value: string[] } }) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function CustomSelectField({
  canSelectMultiple,
  items,
  label,
  placeholder = 'Select...',
  width = 100,
  value = [],
  onChange,
  onOpen,
  onClose,
}: CustomSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onClose?.();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleSelect = (itemValue: string) => {
    if (!onChange) return;

    let newValue: string[];
    if (canSelectMultiple) {
      if (value.includes(itemValue)) {
        newValue = value.filter((v) => v !== itemValue);
      } else {
        newValue = [...value, itemValue];
      }
    } else {
      newValue = [itemValue];
      setIsOpen(false);
      onClose?.();
    }

    onChange({ target: { value: newValue } });
  };

  const handleRemove = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChange) return;
    onChange({ target: { value: value.filter((v) => v !== itemValue) } });
  };

  const selectedItems = items.filter((item) => value.includes(item.value));

  return (
    <div ref={containerRef} style={{ width: `${width}%`, position: 'relative' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#555',
            marginBottom: '4px',
          }}
        >
          {label}
        </label>
      )}
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #d0d0d0',
          borderRadius: '6px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          minHeight: '38px',
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#00618B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d0d0d0';
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.value}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: '#F5F4F1',
                  color: '#38312F',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {item.text}
                {canSelectMultiple && (
                  <button
                    onClick={(e) => handleRemove(item.value, e)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#48413F',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span style={{ color: '#999', fontSize: '14px' }}>{placeholder}</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}
        >
          <ChevronDown size={16} color="#666" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: '#ffffff',
              border: '1px solid #d0d0d0',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {items.map((item) => {
              const isSelected = value.includes(item.value);
              return (
                <div
                  key={item.value}
                  onClick={() => handleSelect(item.value)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? '#e8e8e8' : '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? '#f0f0f0' : 'transparent';
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#333' }}>{item.text}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
