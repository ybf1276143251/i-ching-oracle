"use client";

export default function YinYangAnimation() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30 animate-glowPulse" />

      {/* Rotating outer ring with trigrams */}
      <div className="absolute inset-[-20px] rounded-full animate-spin" style={{ animationDuration: "60s" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const trigrams = ["☰", "☷", "☲", "☵", "☳", "☶", "☴", "☱"];
          const rad = (deg * Math.PI) / 180;
          const r = 160;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          return (
            <span
              key={i}
              className="absolute text-[var(--gold)]/40 text-lg"
              style={{
                left: `calc(50% + ${x}px - 0.5em)`,
                top: `calc(50% + ${y}px - 0.5em)`,
                transform: `rotate(${-deg}deg)`,
              }}
            >
              {trigrams[i]}
            </span>
          );
        })}
      </div>

      {/* Yin Yang */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0A0A0A" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </radialGradient>
        </defs>
        {/* Main circle */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#g1)" strokeWidth="2" />
        {/* Yin half (dark) */}
        <path d="M50,2 A48,48 0 0,0 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2" fill="#D4AF37" opacity="0.85">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Yang half (light) — actually we use bg color for the dark half */}
        <circle cx="50" cy="26" r="8" fill="#0A0A0A">
          <animate attributeName="r" values="8;9;8" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="74" r="8" fill="#D4AF37">
          <animate attributeName="r" values="8;9;8" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[var(--gold)]/60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
