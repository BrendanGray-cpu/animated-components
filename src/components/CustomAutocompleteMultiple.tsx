import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface CustomAutocompleteMultipleProps {
  label?: string;
  options: string[];
  value: string[];
  placeholder?: string;
  isInputTextField?: boolean;
  onChange: (data: { value: string[] }) => void;
  renderTags?: (
    value: string[],
    getTagProps: (data: { index: number }) => {
      key: string;
      onDelete: () => void;
    }
  ) => ReactNode;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement> & { key: string },
    option: string,
    state: { index: number }
  ) => ReactNode;
}

export default function CustomAutocompleteMultiple({
  label,
  options,
  value,
  placeholder = 'Search...',
  onChange,
  renderTags,
  renderOption,
}: CustomAutocompleteMultipleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      !value.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange({ value: [...value, option] });
    setInputValue('');
    inputRef.current?.focus();
  };

  const getTagProps = ({ index }: { index: number }) => ({
    key: `tag-${index}`,
    onDelete: () => {
      onChange({ value: value.filter((_, i) => i !== index) });
    },
  });

  const handleOptionClick = (option: string) => {
    handleSelect(option);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
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
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #d0d0d0',
          borderRadius: '6px',
          padding: '6px 12px',
          backgroundColor: '#ffffff',
          cursor: 'text',
          minHeight: '38px',
          transition: 'border-color 0.2s ease',
          flexWrap: 'wrap',
          gap: '4px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#00618B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d0d0d0';
        }}
      >
        {renderTags && renderTags(value, getTagProps)}
        <input
          ref={inputRef}
          type="text"
          placeholder={value.length === 0 ? placeholder : ''}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          style={{
            flex: 1,
            minWidth: '120px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            color: '#333333',
            padding: '2px',
          }}
        />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}
        >
          <ChevronDown size={16} color="#666" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.ul
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
              listStyle: 'none',
              padding: '4px',
              margin: 0,
            }}
          >
            {filteredOptions.map((option, index) => {
              const props = {
                key: `option-${index}`,
                onClick: () => handleOptionClick(option),
                style: {
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#333',
                },
              };

              if (renderOption) {
                return renderOption(props, option, { index });
              }

              return (
                <li
                  {...props}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {option}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
