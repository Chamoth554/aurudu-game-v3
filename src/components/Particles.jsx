import { useEffect, useRef } from 'react';

const COLORS = ['#F5A623', '#C0392B', '#1A7A4A', '#FFD700', '#FF6B6B'];

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create 15 particles
    const particles = Array.from({ length: 15 }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${COLORS[i % COLORS.length]};
        animation-duration: ${8 + Math.random() * 12}s;
        animation-delay: ${Math.random() * -10}s;
        opacity: ${0.3 + Math.random() * 0.4};
      `;
      container.appendChild(el);
      return el;
    });

    return () => { particles.forEach(p => p.remove()); };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}
