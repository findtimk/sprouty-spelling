import { motion } from 'framer-motion';

interface StarCounterProps {
  count: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarCounter({ count, animate, size = 'md' }: StarCounterProps) {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-lg gap-1.5',
    lg: 'text-2xl gap-2',
  };

  return (
    <motion.div
      className={`flex items-center ${sizeClasses[size]} font-display font-bold text-amber-500`}
      animate={animate ? { scale: [1, 1.3, 1] } : undefined}
      transition={{ duration: 0.4 }}
    >
      <span className="text-amber-400">⭐</span>
      <span>{count}</span>
    </motion.div>
  );
}
