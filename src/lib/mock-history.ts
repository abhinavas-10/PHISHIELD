import { analyzeUrl, type ScanResult } from "./scan";

/** Demonstration data. Replace with backend history once the API is connected. */
const SEEDS: Array<{ url: string; hoursAgo: number }> = [
  { url: "https://www.example.com", hoursAgo: 2 },
  { url: "https://suspicious-site-login.xyz", hoursAgo: 26 },
  { url: "https://paypal-secure-verify.top/login", hoursAgo: 30 },
  { url: "https://github.com/phishield", hoursAgo: 52 },
  { url: "https://bit.ly/example", hoursAgo: 76 },
  { url: "https://apple-id-confirm-billing.click", hoursAgo: 98 },
  { url: "https://wikipedia.org", hoursAgo: 120 },
  { url: "https://my-bank-account-update.tk/secure", hoursAgo: 144 },
];

export const MOCK_HISTORY: ScanResult[] = SEEDS.map(({ url, hoursAgo }) => {
  const result = analyzeUrl(url);
  return { ...result, scannedAt: new Date(Date.now() - hoursAgo * 3600_000).toISOString() };
});

export const LATEST_SCAN: ScanResult = MOCK_HISTORY[0]!;

export const PLATFORM_STATS = [
  { value: "1M+", label: "URLs Scanned" },
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "24/7", label: "Real-time Protection" },
  { value: "0", label: "Data Stored" },
];
