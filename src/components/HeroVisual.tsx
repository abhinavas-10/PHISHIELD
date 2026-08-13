import shieldImage from "@/assets/shield.png";

const LABELS = [
  { text: "AI Detection", className: "left-0 top-[12%]" },
  { text: "Threat Intelligence", className: "right-0 top-[26%]" },
  { text: "Real-time Scan", className: "left-[2%] bottom-[30%]" },
  { text: "Safe Browsing", className: "right-[2%] bottom-[26%]" },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div className="absolute inset-[12%] rounded-full border border-border" />
      <div className="absolute inset-[24%] rounded-full border border-border" />

      <img
        src={shieldImage}
        alt="Monochrome security shield resting on a dark platform"
        width={1024}
        height={1024}
        className="relative size-full object-contain opacity-95 mix-blend-lighten"
      />

      {LABELS.map((label) => (
        <span
          key={label.text}
          className={`absolute ${label.className} rounded-xl border border-border-strong bg-background/70 px-3.5 py-2 text-xs font-medium backdrop-blur-md`}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
