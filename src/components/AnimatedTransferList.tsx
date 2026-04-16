import CustomTransferList, { CustomTransferListItem } from './CustomTransferList';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement } from 'react';
import { useRef, useEffect } from 'react';
import { ChevronRight, ChevronsRight, ChevronLeft, ChevronsLeft } from 'lucide-react';

interface TransferItem {
  rowKey: string;
  title: string;
  value: string;
  selected: boolean;
}

interface AnimatedTransferListProps {
  leftItems: TransferItem[];
  rightItems: TransferItem[];
  onLeftItemsChange: React.Dispatch<React.SetStateAction<TransferItem[]>>;
  onRightItemsChange: React.Dispatch<React.SetStateAction<TransferItem[]>>;
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 28 };

const circleBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '1.5px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  color: '#888',
  padding: 0,
};

function makeListRenderer(side: 'left' | 'right') {
  return (
    list: any[],
    onClick: any,
    props: Record<string, unknown>,
    focusedIndex: number,
  ): ReactElement[] | undefined => {
    if (!list || list.length === 0) return undefined;

    const exitX = side === 'left' ? 50 : -50;
    const enterX = side === 'left' ? -30 : 30;

    return [
      <AnimatePresence key={`ap-${side}`} mode="popLayout" initial={false}>
        {list.map((item, index) => (
          <motion.div
            key={item.rowKey}
            layout
            initial={{ opacity: 0, x: enterX }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: exitX }}
            transition={spring}
          >
            <CustomTransferListItem
              {...props}
              rowKey={item.rowKey}
              title={item.title}
              value={item.value}
              selected={item.selected}
              disabled={item.disabled}
              listIndex={index}
              isFocused={index === focusedIndex}
              tabIndex={index === focusedIndex ? 0 : -1}
              onClick={onClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>,
    ] as unknown as ReactElement[];
  };
}

const leftListRenderer = makeListRenderer('left');
const rightListRenderer = makeListRenderer('right');

export default function AnimatedTransferList({
  leftItems,
  rightItems,
  onLeftItemsChange,
  onRightItemsChange,
}: AnimatedTransferListProps) {
  const transferTimers = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    transferTimers.current.forEach((timer) => clearTimeout(timer));
    transferTimers.current = [];
  };

  const staggeredTransfer = (
    items: TransferItem[],
    fromSetter: React.Dispatch<React.SetStateAction<TransferItem[]>>,
    toSetter: React.Dispatch<React.SetStateAction<TransferItem[]>>,
    delay: number = 60,
  ) => {
    clearAllTimers();
    items.forEach((item, index) => {
      const timer = setTimeout(() => {
        fromSetter((prev) => prev.filter((i) => i.rowKey !== item.rowKey));
        toSetter((prev) => [...prev, { ...item, selected: false }]);
      }, index * delay);
      transferTimers.current.push(timer);
    });
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <CustomTransferList
      leftListItems={leftItems}
      rightListItems={rightItems}
      onLeftRowSelect={({ key }) => {
        onLeftItemsChange((prev) =>
          prev.map((item) =>
            item.rowKey === key ? { ...item, selected: !item.selected } : item,
          ),
        );
        return leftItems;
      }}
      onRightRowSelect={({ key }) => {
        onRightItemsChange((prev) =>
          prev.map((item) =>
            item.rowKey === key ? { ...item, selected: !item.selected } : item,
          ),
        );
        return rightItems;
      }}
      renderButtonControls={() => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '0 12px',
            justifyContent: 'center',
          }}
        >
          <button
            style={circleBtn}
            onClick={() => {
              if (leftItems.length === 0) return;
              staggeredTransfer(leftItems, onLeftItemsChange, onRightItemsChange);
            }}
            aria-label="Transfer all right"
          >
            <ChevronsRight size={16} />
          </button>
          <button
            style={circleBtn}
            onClick={() => {
              const selected = leftItems.filter((item) => item.selected);
              if (selected.length === 0) return;
              onLeftItemsChange((prev) => prev.filter((item) => !item.selected));
              onRightItemsChange((prev) => [
                ...prev,
                ...selected.map((item) => ({ ...item, selected: false })),
              ]);
            }}
            aria-label="Transfer selected right"
          >
            <ChevronRight size={16} />
          </button>
          <button
            style={circleBtn}
            onClick={() => {
              const selected = rightItems.filter((item) => item.selected);
              if (selected.length === 0) return;
              onRightItemsChange((prev) =>
                prev.filter((item) => !item.selected),
              );
              onLeftItemsChange((prev) => [
                ...prev,
                ...selected.map((item) => ({ ...item, selected: false })),
              ]);
            }}
            aria-label="Transfer selected left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            style={circleBtn}
            onClick={() => {
              if (rightItems.length === 0) return;
              staggeredTransfer(rightItems, onRightItemsChange, onLeftItemsChange);
            }}
            aria-label="Transfer all left"
          >
            <ChevronsLeft size={16} />
          </button>
        </div>
      )}
      LeftTransferListBaseProps={{
        ariaLabel: 'Available employees',
        title: 'Available',
        listRenderer: leftListRenderer,
      }}
      RightTransferListBaseProps={{
        ariaLabel: 'Selected employees',
        title: 'Selected',
        listRenderer: rightListRenderer,
      }}
    />
  );
}
