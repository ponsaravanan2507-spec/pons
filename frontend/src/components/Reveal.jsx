import { motion } from 'framer-motion';
// Scroll-triggered fade-up. Wrap any block or card.
export default function Reveal({ children, delay = 0, x = 0 }) {
  return <motion.div initial={{ opacity: 0, y: 26, x }} whileInView={{ opacity: 1, y: 0, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}
