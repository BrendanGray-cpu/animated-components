import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface RubberBandSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 20;
const TRACK_HEIGHT = 4;
const RUBBER_BAND_LIMIT = 50;

function rubberBand(distance: number, limit: number): number {
  const d = Math.abs(distance);
  return Math.sign(distance) * limit * (1 - Math.exp(-d / limit));
}

export default function RubberBandSlider({ label, min, max, value, onChange }: RubberBandSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const trackLeftRef = useRef(0);
  const trackWidthRef = useRef(0);

  const overshoot = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);

  const stretchLeft = useTransform(overshoot, (v) => (v < 0 ? v : 0));
  const stretchRight = useTransform(overshoot, (v) => (v > 0 ? -v : 0));

  const fraction = (value - min) / (max - min);

  const measureTrack = useCallback(() => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      trackLeftRef.current = rect.left;
      trackWidthRef.current = rect.width;
    }
  }, []);

  useEffect(() => {
    measureTrack();
    window.addEventListener('resize', measureTrack);
    return () => window.removeEventListener('resize', measureTrack);
  }, [measureTrack]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    measureTrack();

    const x = e.clientX - trackLeftRef.current;
    const width = trackWidthRef.current;
    const frac = Math.max(0, Math.min(1, x / width));
    onChange(Math.round(min + frac * (max - min)));
    overshoot.set(0);
  }, [min, max, onChange, overshoot, measureTrack]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const x = e.clientX - trackLeftRef.current;
    const width = trackWidthRef.current;

    const frac = Math.max(0, Math.min(1, x / width));
    onChange(Math.round(min + frac * (max - min)));

    let raw = 0;
    if (x < 0) raw = x;
    else if (x > width) raw = x - width;
    overshoot.set(rubberBand(raw, RUBBER_BAND_LIMIT));
  }, [min, max, onChange, overshoot]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    animate(overshoot, 0, {
      type: 'spring',
      stiffness: 500,
      damping: 18,
    });
  }, [overshoot]);

  return (
    <div style={{ userSelect: 'none' }}>
      <label style={{
        display: 'block',
        fontSize: 14,
        fontWeight: 700,
        color: '#555',
        marginBottom: 8,
        textAlign: 'left',
      }}>
        {label}
      </label>

      {/* Hit area — stays in place for stable pointer coordinate math */}
      <div
        ref={trackRef}
        onPointerDown={(e) => { setIsActive(true); handlePointerDown(e); }}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => { setIsActive(false); handlePointerUp(e); }}
        onPointerCancel={(e) => { setIsActive(false); handlePointerUp(e); }}
        style={{
          position: 'relative',
          height: THUMB_SIZE,
          cursor: 'pointer',
          touchAction: 'none',
          overflow: 'visible',
        }}
      >
        {/* Stretching visual track */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: stretchLeft,
            right: stretchRight,
            willChange: 'left, right',
          }}
        >
          {/* Track rail (unfilled) */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: TRACK_HEIGHT,
            marginTop: -TRACK_HEIGHT / 2,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: '#c4c4c4',
          }} />

          {/* Track fill */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            height: TRACK_HEIGHT,
            marginTop: -TRACK_HEIGHT / 2,
            width: `${fraction * 100}%`,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: '#2e7d32',
          }} />

          {/* Thumb — use x/y for centering so framer-motion scale doesn't clobber it */}
          <motion.div
            animate={{ scale: isActive ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{
              position: 'absolute',
              left: `${fraction * 100}%`,
              top: '50%',
              x: '-50%',
              y: '-50%',
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: '50%',
              backgroundColor: '#2e7d32',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>

      {/* Value display — wrapper centers, inner motion.div handles overshoot */}
      <div style={{ position: 'relative', height: 24, marginTop: 4 }}>
        <div
          style={{
            position: 'absolute',
            left: `${fraction * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#2e7d32',
              x: overshoot,
            }}
          >
            {value}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
