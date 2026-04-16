import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import CustomButton from "../CustomButton"

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
}

export function ArrowButton({ label, onClick }: ArrowButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ display: "inline-block" }}
    >
      <CustomButton color="primary" onClick={onClick}>
        <span style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}>
          <motion.span
            animate={{ x: hovered ? -8 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {label}
          </motion.span>

          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{ display: "flex", alignItems: "center", position: "absolute", right: 0 }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </span>
      </CustomButton>
    </motion.div>
  )
}

export default ArrowButton
