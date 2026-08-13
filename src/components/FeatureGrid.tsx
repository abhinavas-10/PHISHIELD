import { Fingerprint, Globe, Lock, ListX, ScanLine, EyeOff } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FEATURES = [
  {
    icon: ScanLine,
    title: "URL Intelligence",
    description: "Analyze URL structure and suspicious patterns such as look-alike paths and hidden redirects.",
  },
  {
    icon: Globe,
    title: "Domain Analysis",
    description: "Inspect domain age and reputation to surface newly registered or low-trust hosts.",
  },
  {
    icon: Lock,
    title: "SSL Verification",
    description: "Check whether the website uses a valid, correctly issued SSL certificate.",
  },
  {
    icon: ListX,
    title: "Blacklist Detection",
    description: "Check whether the domain appears on known threat and abuse lists.",
  },
  {
    icon: Fingerprint,
    title: "Phishing Detection",
    description: "Identify characteristics commonly associated with credential-harvesting pages.",
  },
  {
    icon: EyeOff,
    title: "Privacy First",
    description: "Minimize unnecessary storage of submitted URLs. Scans run without an account.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  );
}
