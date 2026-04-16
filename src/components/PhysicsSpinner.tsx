import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Matter from 'matter-js';
import CustomSpinner from './CustomSpinner';

const AREA_WIDTH = 400;
const AREA_HEIGHT = 300;
const SPINNER_RADIUS = 40;
const WALL_THICKNESS = 50;

function PhysicsSpinner() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodyRef = useRef<Matter.Body | null>(null);
  const activatedRef = useRef(false);
  const [pos, setPos] = useState({ x: AREA_WIDTH / 2, y: AREA_HEIGHT / 2 });
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    const { Engine, Bodies, World, Runner, Events } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    const spinner = Bodies.circle(
      AREA_WIDTH / 2,
      AREA_HEIGHT / 2,
      SPINNER_RADIUS,
      {
        restitution: 0.85,
        friction: 0.01,
        frictionAir: 0.008,
        label: 'spinner',
      }
    );
    bodyRef.current = spinner;

    const walls = [
      Bodies.rectangle(AREA_WIDTH / 2, AREA_HEIGHT + WALL_THICKNESS / 2, AREA_WIDTH, WALL_THICKNESS, { isStatic: true }),
      Bodies.rectangle(-WALL_THICKNESS / 2, AREA_HEIGHT / 2, WALL_THICKNESS, AREA_HEIGHT, { isStatic: true }),
      Bodies.rectangle(AREA_WIDTH + WALL_THICKNESS / 2, AREA_HEIGHT / 2, WALL_THICKNESS, AREA_HEIGHT, { isStatic: true }),
      Bodies.rectangle(AREA_WIDTH / 2, -WALL_THICKNESS / 2, AREA_WIDTH, WALL_THICKNESS, { isStatic: true }),
    ];

    World.add(engine.world, [spinner, ...walls]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => {
      const { x, y } = spinner.position;
      setPos({ x, y });
      rotationRef.current += 0.05;
      setRotation(rotationRef.current);
    });

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!bodyRef.current || !sceneRef.current || !engineRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = bodyRef.current.position.x - mouseX;
    const dy = bodyRef.current.position.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < SPINNER_RADIUS + 30) {
      if (!activatedRef.current) {
        activatedRef.current = true;
        engineRef.current.gravity.y = 1.5;
      }

      const forceMag = 0.015;
      const fx = (dx / dist) * forceMag;
      const fy = (dy / dist) * forceMag;
      Matter.Body.applyForce(
        bodyRef.current,
        bodyRef.current.position,
        { x: fx, y: fy }
      );
    }
  }

  return (
    <div
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      style={{
        width: AREA_WIDTH,
        height: AREA_HEIGHT,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        borderRadius: 16,
        border: '1px solid #d0d0d0',
        background: 'rgba(0,0,0,0.03)',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          left: pos.x - SPINNER_RADIUS,
          top: pos.y - SPINNER_RADIUS,
          width: SPINNER_RADIUS * 2,
          height: SPINNER_RADIUS * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          rotate: rotation * (180 / Math.PI),
        }}
      >
        <div style={{ transform: 'scale(2.5)' }}>
          <CustomSpinner size={24} />
        </div>
      </motion.div>
    </div>
  );
}

export default PhysicsSpinner;
