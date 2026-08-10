import { motion } from "framer-motion";

// Premium cinematic easing curve (Apple-like ease-out-expo)
export const premiumEase = [0.22, 1, 0.36, 1];

export function RevealText({ children, delay = 0 }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: premiumEase, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function RevealBreath({ children, delay = 0, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.2, ease: premiumEase, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.8, ease: premiumEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
