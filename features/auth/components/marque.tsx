const items = [
  "Diff-aware reviews",
  "Security flags",
  "Auto summaries",
  "Inline suggestions",
  "One-click fixes",
  "Zero config",
  "GitHub native",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div
      data-testid="brand-marquee"
      className="relative z-10 overflow-hidden border-t border-white/10 py-4"
    >
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center text-[11px] uppercase tracking-[0.3em] text-white/35"
          >
            <span className="px-8">{item}</span>
            <span className="text-chart-3">{"//"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
