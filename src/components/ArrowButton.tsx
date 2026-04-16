import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomButton from './CustomButton';
import { ArrowRight } from 'lucide-react';

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
}

export function ArrowButton({ label, onClick }: ArrowButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ display: 'inline-block' }}
    >
      <CustomButton color="primary" onClick={onClick}>
        <motion.span
          animate={{ x: hovered ? 0 : 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {label}
          <motion.span
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 4, width: 20, flexShrink: 0 }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </motion.span>
      </CustomButton>
    </motion.div>
  );
}
