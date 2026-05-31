import { useState, useEffect } from 'react';

/**
 * Returns the current viewport height in px, updating on resize/orientation
 * change. Used to scale the Sprouty character gently with available vertical
 * space so it doesn't look tiny on tall phones / large screens.
 */
export function useViewportHeight(): number {
  const [h, setH] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );

  useEffect(() => {
    const onResize = () => setH(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return h;
}
