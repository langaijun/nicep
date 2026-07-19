import { useMemo } from 'react';
import type { PathType } from '@/types';

interface BreathBackgroundProps {
  currentPath: PathType;
  variant?: 'full' | 'subtle';
}

export default function BreathBackground({ currentPath, variant = 'full' }: BreathBackgroundProps) {
  const isAccept = currentPath === 'accept' || currentPath === '';

  const layers = useMemo(
    () => [
      { size: 600, duration: 8, delay: 0, opacity: isAccept ? 0.15 : 0.12 },
      { size: 450, duration: 7, delay: 2, opacity: isAccept ? 0.12 : 0.1 },
      { size: 350, duration: 9, delay: 4, opacity: isAccept ? 0.08 : 0.07 },
      { size: 250, duration: 6, delay: 1, opacity: isAccept ? 0.06 : 0.05 },
    ],
    [isAccept]
  );

  const accentColor = isAccept ? '196, 168, 130' : '140, 154, 175';

  if (variant === 'subtle') {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 400,
            height: 400,
            background: `radial-gradient(circle, rgba(${accentColor}, 0.08) 0%, transparent 70%)`,
            animation: 'breathe 10s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: layer.size,
            height: layer.size,
            background: `radial-gradient(circle, rgba(${accentColor}, ${layer.opacity}) 0%, transparent 70%)`,
            animation: `breathe ${layer.duration}s ease-in-out ${layer.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
