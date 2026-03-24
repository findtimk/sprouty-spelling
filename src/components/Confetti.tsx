import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

interface ConfettiProps {
  active: boolean;
  count?: number;
}

const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc', '#fb923c', '#34d399'];

export default function Confetti({ active, count = 40 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: '-10px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
