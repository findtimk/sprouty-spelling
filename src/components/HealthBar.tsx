import { motion } from 'framer-motion';

interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  color?: 'red' | 'green';
}

export default function HealthBar({ current, max, label, color = 'red' }: HealthBarProps) {
  const hearts = Array.from({ length: max }, (_, i) => i < current);
  const colorClass = color === 'red' ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-gray-500 font-display">{label}</span>
      <div className="flex gap-0.5">
        {hearts.map((filled, i) => (
          <motion.span
            key={i}
            className={`text-lg ${colorClass}`}
            animate={!filled ? { scale: 0.7, opacity: 0.3 } : { scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {filled ? '❤️' : '🖤'}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
