export type Verdict =
  | "safe"
  | "suspicious"
  | "malicious";

export type SignalState =
  | "good"
  | "neutral"
  | "warn";

export interface SecuritySignal {
  label: string;
  value: string;
  state: SignalState;
  detail?: string;
}

export interface ScanResult {
  url: string;
  host: string;
  verdict: Verdict;
  score: number;
  signals: SecuritySignal[];
  headline: string;
  message: string;
  scannedAt: string;
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  safe: "SAFE",
  suspicious: "SUSPICIOUS",
  malicious: "PHISHING",
};

export function normalizeUrl(input: string): string {
  const value = input.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

export function extractHost(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return url;
  }
}

function countOccurrences(
  value: string,
  character: string,
): number {
  return [...value].filter(
    (item) => item === character,
  ).length;
}

function hasIpAddress(host: string): boolean {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

function getSubdomainCount(host: string): number {
  const parts = host.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return 0;
  }

  return parts.length - 2;
}

function containsSuspiciousKeyword(
  url: string,
): boolean {
  const keywords = [
    "login",
    "signin",
    "verify",
    "verification",
    "account",
    "update",
    "secure",
    "security",
    "password",
    "credential",
    "wallet",
    "payment",
    "bank",
    "confirm",
    "unlock",
    "recover",
    "support",
  ];

  const lowerUrl = url.toLowerCase();

  return keywords.some(
    (keyword) => lowerUrl.includes(keyword),
  );
}

/**
 * Local URL analysis.
 *
 * This is only used to provide frontend
 * presentation data when required.
 *
 * The real prediction comes from Flask.
 */
export function analyzeUrl(
  input: string,
): ScanResult {
  const url = normalizeUrl(input);
  const host = extractHost(url);

  const signals: SecuritySignal[] = [];

  let riskPoints = 0;

  const isHttps =
    url.toLowerCase().startsWith("https://");

  const ipAddress = hasIpAddress(host);

  const subdomainCount =
    getSubdomainCount(host);

  const urlLength = url.length;

  const specialCharacters =
    countOccurrences(url, "@") +
    countOccurrences(url, "=") +
    countOccurrences(url, "&") +
    countOccurrences(url, "%");

  const suspiciousKeyword =
    containsSuspiciousKeyword(url);

  /*
   * HTTPS
   */
  if (isHttps) {
    signals.push({
      label: "HTTPS",
      value: "Enabled",
      state: "good",
      detail:
        "The URL uses an encrypted HTTPS connection.",
    });
  } else {
    signals.push({
      label: "HTTPS",
      value: "Not detected",
      state: "warn",
      detail:
        "The URL does not use HTTPS.",
    });

    riskPoints += 2;
  }

  /*
   * IP address
   */
  if (ipAddress) {
    signals.push({
      label: "IP Address",
      value: "Detected",
      state: "warn",
      detail:
        "The URL uses an IP address instead of a normal domain.",
    });

    riskPoints += 4;
  } else {
    signals.push({
      label: "Domain",
      value: host || "Unknown",
      state: "good",
      detail:
        "The URL uses a domain name.",
    });
  }

  /*
   * Subdomains
   */
  if (subdomainCount >= 3) {
    signals.push({
      label: "Subdomains",
      value: String(subdomainCount),
      state: "warn",
      detail:
        "Multiple subdomain levels may require additional verification.",
    });

    riskPoints += 2;
  } else {
    signals.push({
      label: "Subdomains",
      value: String(subdomainCount),
      state: "good",
      detail:
        "The domain structure is relatively simple.",
    });
  }

  /*
   * URL length
   */
  if (urlLength > 150) {
    signals.push({
      label: "URL Length",
      value: `${urlLength} characters`,
      state: "warn",
      detail:
        "The URL is unusually long.",
    });

    riskPoints += 2;
  } else {
    signals.push({
      label: "URL Length",
      value: `${urlLength} characters`,
      state: "good",
      detail:
        "The URL length is within a normal range.",
    });
  }

  /*
   * Special characters
   */
  if (specialCharacters > 8) {
    signals.push({
      label: "Special Characters",
      value: String(specialCharacters),
      state: "warn",
      detail:
        "The URL contains a high number of special characters.",
    });

    riskPoints += 2;
  } else {
    signals.push({
      label: "Special Characters",
      value: String(specialCharacters),
      state: "good",
      detail:
        "No unusually high concentration of special characters was detected.",
    });
  }

  /*
   * Suspicious keywords
   */
  if (suspiciousKeyword) {
    signals.push({
      label: "Suspicious Keywords",
      value: "Detected",
      state: "warn",
      detail:
        "The URL contains words commonly associated with account or payment actions.",
    });

    riskPoints += 2;
  } else {
    signals.push({
      label: "Suspicious Keywords",
      value: "None detected",
      state: "good",
      detail:
        "No common phishing-related keywords were detected.",
    });
  }

  let score = Math.round(
    Math.min(100, riskPoints * 12),
  );

  if (riskPoints === 0) {
    score = 5;
  }

  let verdict: Verdict;

  if (riskPoints >= 7) {
    verdict = "malicious";
  } else if (riskPoints >= 4) {
    verdict = "suspicious";
  } else {
    verdict = "safe";
  }

  let headline: string;
  let message: string;

  if (verdict === "malicious") {
    headline =
      "Potential phishing threat detected.";

    message =
      "Several suspicious URL characteristics were detected.";
  } else if (verdict === "suspicious") {
    headline =
      "This URL shows suspicious characteristics.";

    message =
      "Some URL characteristics require additional caution.";
  } else {
    headline =
      "This URL appears to be safe.";

    message =
      "No obvious suspicious URL characteristics were detected.";
  }

  return {
    url,
    host,
    verdict,
    score,
    signals,
    headline,
    message,
    scannedAt: new Date().toISOString(),
  };
}

/**
 * Basic URL validation.
 */
export function isProbablyUrl(
  input: string,
): boolean {
  const value = input.trim();

  if (!value || value.length > 2048) {
    return false;
  }

  const normalized = normalizeUrl(value);

  try {
    const parsed = new URL(normalized);

    return (
      (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      ) &&
      Boolean(parsed.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Format scan timestamp for the history page.
 */
export function formatWhen(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

/**
 * Send URL to the real Flask backend.
 *
 * Flask:
 * POST http://127.0.0.1:5000/api/predict
 */
export async function scanUrl(
  input: string,
): Promise<{
  result: ScanResult;
  warning?: string;
}> {
  const { predictUrl } = await import(
    "./predict-api"
  );

  const result = await predictUrl(input);

  return {
    result,
  };
}