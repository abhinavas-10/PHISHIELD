/**
 * Frontend adapter for the Flask REST API.
 *
 * Flask endpoint:
 * POST http://127.0.0.1:5000/api/predict
 *
 * Request:
 * {
 *   "url": "https://example.com"
 * }
 *
 * The Flask backend returns:
 * {
 *   "status": "success",
 *   "data": {
 *     "url": "https://example.com",
 *     "prediction": "Safe" | "Phishing",
 *     "confidence": 98.5,
 *     "risk": "Low" | "Medium" | "High",
 *     "summary": "...",
 *     "reasons": [],
 *     "warnings": []
 *   }
 * }
 */

import {
  analyzeUrl,
  extractHost,
  normalizeUrl,
  type ScanResult,
  type SecuritySignal,
  type SignalState,
  type Verdict,
} from "./scan";

export const PREDICT_ENDPOINT =
  (import.meta.env["VITE_PREDICT_API_URL"] as string | undefined)?.trim() ||
  "/api/predict";

const REQUEST_TIMEOUT_MS = 15_000;

export class PredictApiError extends Error {}

interface RawSignal {
  label?: unknown;
  value?: unknown;
  state?: unknown;
  detail?: unknown;
}

interface BackendData {
  id?: unknown;
  url?: unknown;
  prediction?: unknown;
  confidence?: unknown;
  risk?: unknown;
  model?: unknown;
  summary?: unknown;
  reasons?: unknown;
  warnings?: unknown;
  features?: unknown;
  created_at?: unknown;
}

interface RawResponse {
  status?: unknown;
  message?: unknown;
  data?: BackendData;
  error?: unknown;
  detail?: unknown;
}

function toVerdict(value: unknown): Verdict | null {
  if (typeof value === "number") {
    return value >= 1 ? "malicious" : "safe";
  }

  if (typeof value === "boolean") {
    return value ? "malicious" : "safe";
  }

  if (typeof value !== "string") {
    return null;
  }

  const verdict = value.trim().toLowerCase();

  if (
    [
      "safe",
      "legitimate",
      "legit",
      "benign",
      "clean",
      "0",
      "good",
    ].includes(verdict)
  ) {
    return "safe";
  }

  if (
    [
      "suspicious",
      "warning",
      "caution",
      "medium",
    ].includes(verdict)
  ) {
    return "suspicious";
  }

  if (
    [
      "malicious",
      "phishing",
      "phish",
      "bad",
      "danger",
      "1",
    ].includes(verdict)
  ) {
    return "malicious";
  }

  return null;
}

function toScore(
  data: BackendData,
  fallback: number,
): number {
  const confidence = data.confidence;

  if (
    typeof confidence === "number" &&
    Number.isFinite(confidence)
  ) {
    return Math.max(
      0,
      Math.min(100, Math.round(confidence)),
    );
  }

  return fallback;
}

const SIGNAL_STATES: SignalState[] = [
  "good",
  "neutral",
  "warn",
];

function toSignals(
  reasons: unknown,
  warnings: unknown,
): SecuritySignal[] | null {
  const signals: SecuritySignal[] = [];

  if (Array.isArray(reasons)) {
    for (const reason of reasons) {
      if (typeof reason === "string" && reason.trim()) {
        signals.push({
          label: "Security Signal",
          value: reason,
          state: "good",
        });
      }
    }
  }

  if (Array.isArray(warnings)) {
    for (const warning of warnings) {
      if (typeof warning === "string" && warning.trim()) {
        signals.push({
          label: "Warning",
          value: warning,
          state: "warn",
        });
      }
    }
  }

  return signals.length > 0 ? signals : null;
}

/**
 * Calls the real Flask prediction API.
 */
export async function predictUrl(
  input: string,
): Promise<ScanResult> {
  const url = normalizeUrl(input);

  if (!url) {
    throw new PredictApiError(
      "Please enter a URL to scan.",
    );
  }

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  let response: Response;

  try {
    response = await fetch(
      PREDICT_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url,
        }),
        signal: controller.signal,
      },
    );
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new PredictApiError(
        "Detection service timed out.",
      );
    }

    throw new PredictApiError(
      "Detection service is unreachable. Make sure Flask is running.",
    );
  } finally {
    clearTimeout(timeout);
  }

  let payload: RawResponse;

  try {
    payload =
      (await response.json()) as RawResponse;
  } catch {
    throw new PredictApiError(
      `Detection service returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    const provided =
      typeof payload.error === "string"
        ? payload.error
        : typeof payload.message === "string"
          ? payload.message
          : typeof payload.detail === "string"
            ? payload.detail
            : null;

    const isValidation =
      response.status === 400 ||
      response.status === 422;

    throw new PredictApiError(
      isValidation && provided
        ? provided
        : `Detection service error (${response.status}).`,
    );
  }

  if (
    payload.status !== "success" ||
    !payload.data
  ) {
    throw new PredictApiError(
      "Detection service returned an invalid response.",
    );
  }

  const data = payload.data;

  const verdict = toVerdict(
    data.prediction,
  );

  if (!verdict) {
    throw new PredictApiError(
      "Detection service returned an unknown verdict.",
    );
  }

  /*
   * Keep the existing frontend presentation system.
   * The Flask backend remains the source of truth
   * for the actual prediction and confidence.
   */
  const local = analyzeUrl(url);

  const backendSignals = toSignals(
    data.reasons,
    data.warnings,
  );

  const score = toScore(
    data,
    local.score,
  );

  const backendUrl =
    typeof data.url === "string" &&
    data.url.trim()
      ? data.url
      : url;

  const backendSummary =
    typeof data.summary === "string"
      ? data.summary
      : undefined;

  return {
    ...local,

    url: backendUrl,

    host: extractHost(backendUrl),

    verdict,

    score,

    signals:
      backendSignals ?? local.signals,

    headline:
      verdict === "safe"
        ? "This URL appears to be safe."
        : verdict === "malicious"
          ? "Potential phishing threat detected."
          : "This URL shows suspicious characteristics.",

    message:
      backendSummary ??
      (
        verdict === "safe"
          ? "No phishing threats detected across the analyzed security signals."
          : verdict === "malicious"
            ? "Potential phishing indicators were detected. Do not enter passwords or payment information."
            : "Proceed with caution and verify the website before entering sensitive information."
      ),

    scannedAt:
      typeof data.created_at === "string"
        ? data.created_at
        : new Date().toISOString(),
  };
}