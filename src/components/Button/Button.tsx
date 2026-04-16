import { motion } from "framer-motion"
import CustomButton from "../CustomButton"

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{ display: "inline-block" }}
    >
      <CustomButton onClick={onClick}>{label}</CustomButton>
    </motion.div>
  )
}

export default Button
