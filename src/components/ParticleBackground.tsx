"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 3 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 12 + 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }, []);

  return <div ref={ref} className="particles" />;
}
