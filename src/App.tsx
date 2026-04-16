import { Button } from './components/Button';
import { ArrowButton } from './components/ArrowButton';
import PhysicsSpinner from './components/PhysicsSpinner';
import AnimatedTransferList from './components/AnimatedTransferList';
import RubberBandSlider from './components/RubberBandSlider';
import CustomButton from './components/CustomButton';
import CustomTextField from './components/CustomTextField';
import CustomSelectField from './components/CustomSelectField';
import CustomActionTile from './components/CustomActionTile';
import CustomAutocompleteMultiple from './components/CustomAutocompleteMultiple';
import CustomInPageMessaging from './components/CustomInPageMessaging';
import Icon from './components/IconMap';
import { AlertCircle, Sparkles, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const placeholders = [
  "What does this actually cost, and what's included at each price?",
  "Can I get my existing employee data into this system?",
  "How is this different from what I'm using now?",
  "How long does it take to get fully set up and running?",
  "Can I try the specific features my team needs before committing?",
  "What happens to the data I entered during the trial if I subscribe?",
];

const bffNames = [
  'Alex Thompson',
  'Jordan Rivera',
  'Sam Patel',
  'Casey Morgan',
  'Riley Chen',
  'Taylor Brooks',
  'Quinn Nakamura',
  'Avery Sullivan',
  'Morgan Davis',
  'Jamie Okafor',
];

const miButtons = [
  { id: 'trigger', label: 'Triggers', icon: 'sparkle-regular' as const },
  { id: 'rules', label: 'Rules', icon: 'pen-ruler-regular' as const },
  { id: 'feedback', label: 'Feedback', icon: 'face-smile-regular' as const },
  { id: 'loops', label: 'Loops & Modes', icon: 'rotate-right-regular' as const },
];

const employeeNames = [
  'Priya Sharma',
  'Marcus Webb',
  'Elena Vasquez',
  'David Okonkwo',
  'Lena Fischer',
  'Tomás Reyes',
  'Hana Kimura',
  'Owen Bradley',
  'Fatima Al-Rashid',
  'Nolan Cheng',
  'Sophie Lindgren',
  'Rafael Costa',
];

const initialEmployeeItems = employeeNames.map((name, i) => ({
  rowKey: `emp-${i}`,
  title: name,
  value: name,
  selected: false,
}));

const lightTheme = {
  background: '#ffffff',
  text: '#111111',
};

const darkTheme = {
  background: '#111111',
  text: '#ffffff',
};

function App() {
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clipOrigin, setClipOrigin] = useState({ x: 0, y: 0 });
  const transitionRef = useRef<HTMLDivElement>(null);
  const [tileHovered, setTileHovered] = useState(false);
  const [tileFlipped, setTileFlipped] = useState(false);
  const foldSize = tileHovered ? 32 : 24;
  const [tile2Hovered, setTile2Hovered] = useState(false);
  const [tile2Flipped, setTile2Flipped] = useState(false);
  const [partyHovered, setPartyHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [errorFieldValue, setErrorFieldValue] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bffValues, setBffValues] = useState<string[]>([]);
  const [miActiveIndex, setMiActiveIndex] = useState(0);
  const [miHoveredIndex, setMiHoveredIndex] = useState<number | null>(null);
  const [miPaused, setMiPaused] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [tlLeft, setTlLeft] = useState(initialEmployeeItems);
  const [tlRight, setTlRight] = useState<typeof initialEmployeeItems>([]);
  const miResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const miCycleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const miDisplayIndex = miHoveredIndex !== null ? miHoveredIndex : miActiveIndex;

  const miLastHovered = useRef<number>(0);

  function handleMiHoverStart(i: number) {
    setMiPaused(true);
    setMiHoveredIndex(i);
    miLastHovered.current = i;
    if (miResumeTimer.current) {
      clearTimeout(miResumeTimer.current);
      miResumeTimer.current = null;
    }
  }

  function handleMiHoverEnd() {
    setMiActiveIndex(miLastHovered.current);
    setMiHoveredIndex(null);
    if (miResumeTimer.current) {
      clearTimeout(miResumeTimer.current);
    }
    miResumeTimer.current = setTimeout(() => {
      setMiPaused(false);
      miResumeTimer.current = null;
    }, 8000);
  }


  const current = isDark ? darkTheme : lightTheme;
  const next = isDark ? lightTheme : darkTheme;

  function handleTransitionClick() {
    if (isAnimating) return;
    const rect = transitionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setClipOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setIsAnimating(true);
  }

  useEffect(() => {
    if (isFocused || value.length > 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isFocused, value]);

  useEffect(() => {
    if (miPaused) return;
    miCycleTimer.current = setInterval(() => {
      setMiActiveIndex((prev) => (prev + 1) % miButtons.length);
    }, 5000);
    return () => {
      if (miCycleTimer.current) clearInterval(miCycleTimer.current);
    };
  }, [miPaused]);

  useEffect(() => {
    return () => {
      if (miResumeTimer.current) clearTimeout(miResumeTimer.current);
      if (miCycleTimer.current) clearInterval(miCycleTimer.current);
    };
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: current.background, color: current.text, minHeight: '100vh', transition: 'background-color 0ms, color 0ms', position: 'relative', overflow: 'hidden' }}>
      <h1 style={{ color: 'inherit' }}>Animated Components</h1>
      <section style={{ marginTop: '84px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button label="Click Me" onClick={() => {}} />
          <ArrowButton label="Next" onClick={() => {}} />
          <div ref={transitionRef} style={{ display: 'inline-block' }}>
            <CustomButton onClick={handleTransitionClick}>Transition</CustomButton>
          </div>
          <motion.div
            onHoverStart={() => setPartyHovered(true)}
            onHoverEnd={() => setPartyHovered(false)}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'inline-block' }}
          >
            <CustomButton color="primary" onClick={() => {}}>
              <span style={{ display: 'flex', gap: '1px' }}>
                {"Party Time!".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    animate={partyHovered ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.04,
                      ease: 'easeInOut',
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </CustomButton>
          </motion.div>
          <motion.div
            onHoverStart={() => setTooltipVisible(true)}
            onHoverEnd={() => setTooltipVisible(false)}
            style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center' }}
          >
            <AnimatePresence>
              {tooltipVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
                  exit={{ opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.15, ease: 'easeOut' } }}
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Tooltip!
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid #111111',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <CustomButton color="secondary" onClick={() => {}}>Here's A Tip:</CustomButton>
          </motion.div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0' }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              backgroundColor: '#f0f0ee',
              borderRadius: 999,
              padding: 12,
            }}
          >
            {miButtons.map((btn, i) => {
              const isActive = miDisplayIndex === i;
              return (
                <motion.button
                  key={btn.id}
                  onHoverStart={() => handleMiHoverStart(i)}
                  onHoverEnd={() => handleMiHoverEnd()}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setMiActiveIndex(i);
                    setMiPaused(true);
                    if (miResumeTimer.current) clearTimeout(miResumeTimer.current);
                    miResumeTimer.current = setTimeout(() => {
                      setMiPaused(false);
                      miResumeTimer.current = null;
                    }, 8000);
                  }}
                  animate={{
                    backgroundColor: isActive ? '#2e7d32' : '#ffffff',
                    boxShadow: isActive
                      ? '0 2px 8px rgba(46,125,50,0.3)'
                      : '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 999,
                    padding: '8px 12px',
                    overflow: 'hidden',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#48413F' }}>
                    <Icon name={btn.icon} size={16} color={isActive ? 'neutral-forced-white' : undefined} />
                  </span>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        initial={{ width: 0, marginLeft: 0, opacity: 0 }}
                        animate={{ width: 'auto', marginLeft: 8, opacity: 1 }}
                        exit={{ width: 0, marginLeft: 0, opacity: 0 }}
                        transition={{
                          width: { type: 'spring', stiffness: 350, damping: 30 },
                          opacity: { duration: 0.15 },
                        }}
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          color: '#ffffff',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {btn.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 540 }}>
            <div
              style={{
                position: 'relative',
                background:
                  `linear-gradient(${current.background}, ${current.background}) padding-box, linear-gradient(93deg, #AFD6A3 0%, #A6D0F3 33.65%, #D5BAE3 66.83%, #F6C499 96.15%) border-box`,
                border: '1px solid transparent',
                borderRadius: 999,
              }}
            >
              <AnimatePresence mode="popLayout">
                {!isFocused && value.length === 0 && (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 48,
                      display: 'flex',
                      alignItems: 'center',
                      color: '#999',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      fontSize: 14,
                      zIndex: 1,
                    }}
                  >
                    {placeholders[index]}
                  </motion.span>
                )}
              </AnimatePresence>
              <CustomTextField
                variant="single"
                placeholder=""
                width={100}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                InputProps={{
                  startAdornment: (
                    <span style={{ color: '#00618B', display: 'flex' }}>
                      <Icon name="sparkles-regular" size={16} />
                    </span>
                  ),
                }}
              />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4 }}>
                <AnimatePresence>
                  {errorFieldValue.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: '20px' }}
                      exit={{ opacity: 0, scale: 0.5, width: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', color: '#B71C1C' }}
                    >
                      <AlertCircle size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.label
                  animate={{ x: errorFieldValue.length > 0 ? 6 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: errorFieldValue.length > 0 ? '#B71C1C' : '#555',
                    transition: 'color 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  Check out this error state
                </motion.label>
              </div>
              <CustomTextField
                placeholder="Type anything."
                width={100}
                status={errorFieldValue.length > 0 ? 'error' : undefined}
                value={errorFieldValue}
                onChange={(e) => setErrorFieldValue(e.target.value)}
              />
              <AnimatePresence>
                {errorFieldValue.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    style={{ overflow: 'hidden', marginTop: 4 }}
                  >
                    <div className="compact-message">
                      <CustomInPageMessaging
                        type="error"
                        body="Oh no, something went wrong!"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {selectOpen && (
                <motion.div
                  initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                  animate={{ backdropFilter: "blur(6px)", opacity: 1 }}
                  exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ position: "fixed", inset: 0, zIndex: 10, backgroundColor: "rgba(0,0,0,0.05)" }}
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={{
                scale: selectOpen ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{ position: "relative", zIndex: selectOpen ? 20 : 1, marginTop: '1.5rem' }}
            >
              <CustomSelectField
                canSelectMultiple
                items={[
                  { text: "Item 1", value: "1" },
                  { text: "Item 2", value: "2" },
                  { text: "Item 3", value: "3" },
                  { text: "Item 4", value: "4" },
                  { text: "Item 5", value: "5" },
                ]}
                label="Lets focus"
                placeholder="Select items..."
                width={100}
                value={selectedItems}
                onChange={(e: { target: { value: string[] } }) => setSelectedItems(e.target.value)}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
              />
            </motion.div>
            <div style={{ marginTop: '1.5rem' }}>
              <CustomAutocompleteMultiple
                label="My BFFs"
                options={bffNames}
                value={bffValues}
                placeholder="Search for friends..."
                isInputTextField
                onChange={({ value }) => setBffValues(value)}
                renderTags={(value, getTagProps) => (
                  <AnimatePresence>
                    {value.map((option, index) => {
                      const { key, onDelete, ...rest } = getTagProps({ index });
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                          {...rest}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            borderRadius: 999,
                            backgroundColor: '#F5F4F1',
                            color: '#38312F',
                            fontSize: 13,
                            fontWeight: 500,
                            margin: 2,
                          }}
                        >
                          {option}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onDelete}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: '#48413F',
                              lineHeight: 1,
                            }}
                          >
                            <XCircle size={14} />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                renderOption={(props, option, state) => {
                  const { key, onClick, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
                  return (
                    <motion.li
                      key={key}
                      onClick={onClick}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                        delay: state.index * 0.03,
                      }}
                      whileHover={{ backgroundColor: '#f5f5f5', x: 4 }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      {option}
                    </motion.li>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ perspective: 1000, display: 'inline-block' }}>
            <motion.div
              onClick={() => setTileFlipped((prev) => !prev)}
              onHoverStart={() => setTileHovered(true)}
              onHoverEnd={() => setTileHovered(false)}
              animate={{ rotateY: tileFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                position: 'relative',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
              }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'relative',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    clipPath: `polygon(
                      0% 0%,
                      calc(100% - ${foldSize}px) 0%,
                      100% ${foldSize}px,
                      100% 100%,
                      0% 100%
                    )`,
                    transition: 'clip-path 0.2s ease',
                  }}
                >
                  <CustomActionTile
                    icon="egg-solid"
                    title="Guess what?"
                    titleSize="small"
                    onClick={() => {}}
                  />
                </div>
                {/* Folded corner */}
                <motion.div
                  animate={{ width: foldSize, height: foldSize }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: `linear-gradient(225deg, #ffffff 0%, #fafafa 40%, #e8e8e8 48%, #f3f3f3 56%, #fdfdfd 100%)`,
                    borderRadius: '0 16px 0 16px',
                    boxShadow: '-1px 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRight: 'none',
                  }}
                />
              </div>
              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    clipPath: `polygon(
                      0% 0%,
                      calc(100% - ${foldSize}px) 0%,
                      100% ${foldSize}px,
                      100% 100%,
                      0% 100%
                    )`,
                    transition: 'clip-path 0.2s ease',
                  }}
                >
                  <CustomActionTile
                    icon="bird-solid"
                    title="Chicken Butt"
                    titleSize="small"
                    onClick={() => {}}
                    width="100%"
                    height="100%"
                  />
                </div>
                {/* Folded corner */}
                <motion.div
                  animate={{ width: foldSize, height: foldSize }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: `linear-gradient(225deg, #ffffff 0%, #fafafa 40%, #e8e8e8 48%, #f3f3f3 56%, #fdfdfd 100%)`,
                    borderRadius: '0 16px 0 16px',
                    boxShadow: '-1px 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRight: 'none',
                  }}
                />
              </div>
            </motion.div>
          </div>
          <div style={{ perspective: 1000, display: 'inline-block', minWidth: 150 }}>
            <motion.div
              onClick={() => setTile2Flipped((prev) => !prev)}
              onHoverStart={() => setTile2Hovered(true)}
              onHoverEnd={() => setTile2Hovered(false)}
              animate={{
                rotateY: tile2Flipped
                  ? tile2Hovered ? 195 : 180
                  : tile2Hovered ? -15 : 0,
              }}
              transition={
                tile2Hovered
                  ? { type: 'spring', stiffness: 300, damping: 10 }
                  : tile2Flipped
                  ? { type: 'spring', stiffness: 260, damping: 20 }
                  : { type: 'spring', stiffness: 200, damping: 12 }
              }
              style={{
                position: 'relative',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'relative',
                  backfaceVisibility: 'hidden',
                }}
              >
                <CustomActionTile
                  icon="hand-solid"
                  title="Up High"
                  titleSize="small"
                  onClick={() => {}}
                  width="100%"
                />
              </div>
              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CustomActionTile
                  icon="turtle-solid"
                  title={"Too\u00A0Slow"}
                  titleSize="small"
                  onClick={() => {}}
                  width="100%"
                  height="100%"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhysicsSpinner />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 216, position: 'relative' }}>
            <RubberBandSlider
              label="Stretchiness"
              min={0}
              max={100}
              value={sliderValue}
              onChange={setSliderValue}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3rem' }}>
          <div style={{ maxWidth: '100%' }}>
            <AnimatedTransferList
              leftItems={tlLeft}
              rightItems={tlRight}
              onLeftItemsChange={setTlLeft}
              onRightItemsChange={setTlRight}
            />
          </div>
        </div>
      </section>
      {/* Radial reveal overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{
              clipPath: `circle(0px at ${clipOrigin.x}px ${clipOrigin.y}px)`,
            }}
            animate={{
              clipPath: `circle(200vmax at ${clipOrigin.x}px ${clipOrigin.y}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              setIsDark((prev) => !prev);
              setIsAnimating(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: next.background,
              color: next.text,
              zIndex: 10,
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <h1 style={{ color: 'inherit' }}>Animated Components</h1>
            <section style={{ marginTop: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#888', fontWeight: 'bold', marginBottom: '1rem' }}>Buttons</h2>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button label="Click Me" onClick={() => {}} />
                <ArrowButton label="Next" onClick={() => {}} />
                <div style={{ display: 'inline-block' }}>
                  <CustomButton onClick={() => {}}>Transition</CustomButton>
                </div>
              </div>
            </section>
            <section style={{ marginTop: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#888', fontWeight: 'bold', marginBottom: '1rem' }}>Inputs</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 540 }}>
                  <div
                    style={{
                      position: 'relative',
                      background:
                        `linear-gradient(${next.background}, ${next.background}) padding-box, linear-gradient(93deg, #AFD6A3 0%, #A6D0F3 33.65%, #D5BAE3 66.83%, #F6C499 96.15%) border-box`,
                      border: '1px solid transparent',
                      borderRadius: 999,
                    }}
                  >
                    <CustomTextField
                      variant="single"
                      placeholder=""
                      width={100}
                      InputProps={{
                        startAdornment: (
                          <span style={{ color: '#00618B', display: 'flex' }}>
                            <Icon name="sparkles-regular" size={16} />
                          </span>
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
            <section style={{ marginTop: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#888', fontWeight: 'bold', marginBottom: '1rem' }}>Other</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 200, height: 120 }}>
                  <CustomActionTile
                    icon="sparkle-solid"
                    title="ActionTile"
                    titleSize="small"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
