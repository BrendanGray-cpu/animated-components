import React, { ReactNode, useState } from 'react';

interface TransferListItem {
  rowKey: string;
  title: string;
  value: string;
  selected: boolean;
  disabled?: boolean;
}

interface CustomTransferListProps {
  leftListItems: TransferListItem[];
  rightListItems: TransferListItem[];
  onLeftRowSelect: (data: { key: string }) => TransferListItem[];
  onRightRowSelect: (data: { key: string }) => TransferListItem[];
  renderButtonControls: () => ReactNode;
  LeftTransferListBaseProps: {
    ariaLabel: string;
    title: string;
    listRenderer: (
      list: TransferListItem[],
      onClick: (key: string) => void,
      props: Record<string, unknown>,
      focusedIndex: number
    ) => ReactNode;
  };
  RightTransferListBaseProps: {
    ariaLabel: string;
    title: string;
    listRenderer: (
      list: TransferListItem[],
      onClick: (key: string) => void,
      props: Record<string, unknown>,
      focusedIndex: number
    ) => ReactNode;
  };
}

export default function CustomTransferList({
  leftListItems,
  rightListItems,
  onLeftRowSelect,
  onRightRowSelect,
  renderButtonControls,
  LeftTransferListBaseProps,
  RightTransferListBaseProps,
}: CustomTransferListProps) {
  const [leftFocusedIndex, setLeftFocusedIndex] = useState(0);
  const [rightFocusedIndex, setRightFocusedIndex] = useState(0);

  const handleLeftClick = (key: string) => {
    onLeftRowSelect({ key });
  };

  const handleRightClick = (key: string) => {
    onRightRowSelect({ key });
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
      <TransferListBase
        items={leftListItems}
        title={LeftTransferListBaseProps.title}
        ariaLabel={LeftTransferListBaseProps.ariaLabel}
        listRenderer={LeftTransferListBaseProps.listRenderer}
        onClick={handleLeftClick}
        focusedIndex={leftFocusedIndex}
        onFocusedIndexChange={setLeftFocusedIndex}
      />
      {renderButtonControls()}
      <TransferListBase
        items={rightListItems}
        title={RightTransferListBaseProps.title}
        ariaLabel={RightTransferListBaseProps.ariaLabel}
        listRenderer={RightTransferListBaseProps.listRenderer}
        onClick={handleRightClick}
        focusedIndex={rightFocusedIndex}
        onFocusedIndexChange={setRightFocusedIndex}
      />
    </div>
  );
}

interface TransferListBaseProps {
  items: TransferListItem[];
  title: string;
  ariaLabel: string;
  listRenderer: (
    list: TransferListItem[],
    onClick: (key: string) => void,
    props: Record<string, unknown>,
    focusedIndex: number
  ) => ReactNode;
  onClick: (key: string) => void;
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
}

function TransferListBase({
  items,
  title,
  ariaLabel,
  listRenderer,
  onClick,
  focusedIndex,
}: TransferListBaseProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #d0d0d0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        minWidth: '240px',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
          fontWeight: 600,
          fontSize: '14px',
          color: '#333',
        }}
      >
        {title}
      </div>
      <div
        role="listbox"
        aria-label={ariaLabel}
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '320px',
        }}
      >
        {listRenderer(items, onClick, {}, focusedIndex)}
      </div>
    </div>
  );
}

interface TransferListItemProps {
  rowKey: string;
  title: string;
  value: string;
  selected: boolean;
  disabled?: boolean;
  listIndex: number;
  isFocused: boolean;
  tabIndex: number;
  onClick: (key: string) => void;
}

export function CustomTransferListItem({
  rowKey,
  title,
  selected,
  disabled,
  onClick,
}: TransferListItemProps) {
  return (
    <div
      onClick={() => !disabled && onClick(rowKey)}
      style={{
        padding: '10px 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: selected ? '#e3f2fd' : 'transparent',
        borderLeft: selected ? '3px solid #2e7d32' : '3px solid transparent',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        fontSize: '14px',
        color: '#333',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = selected ? '#bbdefb' : '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = selected ? '#e3f2fd' : 'transparent';
        }
      }}
    >
      {title}
    </div>
  );
}
