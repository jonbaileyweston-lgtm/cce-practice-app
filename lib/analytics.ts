/**
 * Client-side analytics utilities for CCE session history.
 * All data is stored in localStorage under the key "cce-session-history-v2".
 * The old "cce-session-history" key (completion-count-only) is migrated on first read.
 */

import type {
  CompetencyRating,
  MarkingResult,
  OverallRating,
  PerformancePattern,
  RacgpDomain,
} from "@/types";
import { CASES } from "@/data/cases";

const HISTORY_KEY = "cce-session-history-v3";
const V2_KEY = "cce-session-history-v2";
const LEGACY_KEY = "cce-session-history";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionRecord {
  caseId: string;
  completedAt: number;
  durationSeconds: number;
  domain: RacgpDomain;
  overallRating: OverallRating;
  /** Domain-number → best rating in that domain for this session */
  domainScores: Record<string, CompetencyRating>;
  /** Performance-pattern summary for this session */
  patternScores: Partial<Record<PerformancePattern, CompetencyRating>>;
  missedDiagnosis: boolean;
}

export interface DomainSummary {
  domain: RacgpDomain;
  attemptCount: number;
  /** Average numeric score (0–3) across all criteria in this domain */
  averageScore: number;
  /** Worst rating seen — drives spaced repetition urgency */
  worstRating: CompetencyRating;
  isWeak: boolean;
}

export interface PatternSummary {
  pattern: PerformancePattern;
  attemptCount: number;
  averageScore: number;
  worstRating: CompetencyRating;
  isWeak: boolean;
}

// ─── Rating helpers ───────────────────────────────────────────────────────────

const RATING_SCORE: Record<CompetencyRating, number> = {
  not_demonstrated: 0,
  not_clearly_demonstrated: 1,
  satisfactorily_demonstrated: 2,
  fully_demonstrated: 3,
};

const OVERALL_IS_FAIL: Record<OverallRating, boolean> = {
  clearly_below_standard: true,
  below_expected_standard: true,
  borderline: true,
  at_expected_standard: false,
  above_standard: false,
};

const ALL_PATTERNS: PerformancePattern[] = [
  "red_flag_triage",
  "preventive_opportunism",
  "shared_decision_making",
  "safety_netting",
  "ice_elicitation",
  "explanation_plain_language",
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadHistory(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw) as SessionRecord[];

    const v2Raw = localStorage.getItem(V2_KEY);
    if (v2Raw) {
      const v2 = JSON.parse(v2Raw) as Array<
        Omit<SessionRecord, "patternScores"> & {
          patternScores?: Partial<Record<PerformancePattern, CompetencyRating>>;
        }
      >;
      const migratedV2: SessionRecord[] = v2.map((s) => ({
        ...s,
        patternScores: s.patternScores ?? {},
      }));
      saveHistory(migratedV2);
      return migratedV2;
    }

    // Migrate from legacy format (no domain scores)
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const legacyEntries = JSON.parse(legacy) as { caseId: string; completedAt: number }[];
      const migrated: SessionRecord[] = legacyEntries.map((e) => {
        const c = CASES.find((c) => c.id === e.caseId);
        return {
          caseId: e.caseId,
          completedAt: e.completedAt,
          durationSeconds: 0,
          domain: c?.domain ?? "undifferentiated",
          overallRating: "borderline",
          domainScores: {},
          patternScores: {},
          missedDiagnosis: false,
        };
      });
      saveHistory(migrated);
      return migrated;
    }
  } catch {
    // ignore corrupt storage
  }
  return [];
}

function saveHistory(records: SessionRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch {
    // storage quota — ignore
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Check whether the candidate missed the primary diagnosis in a session.
 * Looks for any Domain-3 rubric item (clinical reasoning) rated not_demonstrated
 * or not_clearly_demonstrated, which indicates the correct diagnosis was likely
 * not reached.
 */
export function hasMissedDiagnosis(result: MarkingResult): boolean {
  return result.rubricResults.some(
    (r) =>
      (r.rubricItem.code.startsWith("3.") ||
        r.rubricItem.code === "3.3" ||
        r.rubricItem.code === "3.6") &&
      (r.rating === "not_demonstrated" || r.rating === "not_clearly_demonstrated")
  );
}

/**
 * Persist a completed session to history.
 * Call this from the results page after evaluation succeeds.
 */
export function recordSession(result: MarkingResult, caseId: string): void {
  const caseData = CASES.find((c) => c.id === caseId);
  if (!caseData) return;

  // Build per-domain-number score map
  const domainScores: Record<string, CompetencyRating> = {};
  for (const r of result.rubricResults) {
    const domainNum = String(r.rubricItem.domainNumber);
    const existing = domainScores[domainNum];
    if (!existing || RATING_SCORE[r.rating] < RATING_SCORE[existing]) {
      domainScores[domainNum] = r.rating;
    }
  }

  const record: SessionRecord = {
    caseId,
    completedAt: result.completedAt,
    durationSeconds: result.durationSeconds,
    domain: caseData.domain,
    overallRating: result.overallRating,
    domainScores,
    patternScores: derivePatternScores(result),
    missedDiagnosis: hasMissedDiagnosis(result),
  };

  const history = loadHistory();
  history.push(record);
  saveHistory(history);
}

function derivePatternScores(
  result: MarkingResult
): Partial<Record<PerformancePattern, CompetencyRating>> {
  const buckets: Record<PerformancePattern, CompetencyRating[]> = {
    red_flag_triage: [],
    preventive_opportunism: [],
    shared_decision_making: [],
    safety_netting: [],
    ice_elicitation: [],
    explanation_plain_language: [],
  };

  for (const rr of result.rubricResults) {
    const code = rr.rubricItem.code;
    const domainNumber = rr.rubricItem.domainNumber;

    if (code === "3.7" || code === "10.1" || code === "9.2") {
      buckets.red_flag_triage.push(rr.rating);
    }
    if (domainNumber === 5) {
      buckets.preventive_opportunism.push(rr.rating);
    }
    if (code === "1.10" || code === "4.7" || code === "4.8") {
      buckets.shared_decision_making.push(rr.rating);
    }
    if (code === "1.11" || code === "4.7") {
      buckets.safety_netting.push(rr.rating);
    }
    if (code === "2.1") {
      buckets.ice_elicitation.push(rr.rating);
    }
    if (code === "1.3" || code === "4.8") {
      buckets.explanation_plain_language.push(rr.rating);
    }
  }

  const patternScores: Partial<Record<PerformancePattern, CompetencyRating>> = {};
  for (const pattern of ALL_PATTERNS) {
    const ratings = buckets[pattern];
    if (ratings.length === 0) continue;
    // Use worst rating as the session pattern score to keep remediation-oriented behaviour.
    const worst = ratings.reduce((a, b) =>
      RATING_SCORE[b] < RATING_SCORE[a] ? b : a
    );
    patternScores[pattern] = worst;
  }
  return patternScores;
}

/**
 * Get the full session history.
 */
export function getSessionHistory(): SessionRecord[] {
  return loadHistory();
}

/**
 * Get the last completed session for a specific case.
 */
export function getLastSessionForCase(caseId: string): SessionRecord | undefined {
  const history = loadHistory();
  const sessions = history.filter((s) => s.caseId === caseId);
  return sessions.length > 0 ? sessions[sessions.length - 1] : undefined;
}

/**
 * Get per-RACGP-domain performance summaries across all sessions.
 */
export function getDomainSummaries(): DomainSummary[] {
  const history = loadHistory();
  const domainMap: Record<RacgpDomain, { scores: number[]; worstRating: CompetencyRating }> = {} as never;

  for (const session of history) {
    if (!domainMap[session.domain]) {
      domainMap[session.domain] = { scores: [], worstRating: "fully_demonstrated" };
    }

    // Use overall rating as a proxy if no domain scores exist
    const scores = Object.values(session.domainScores);
    if (scores.length === 0) continue;

    for (const rating of scores) {
      domainMap[session.domain].scores.push(RATING_SCORE[rating]);
      if (RATING_SCORE[rating] < RATING_SCORE[domainMap[session.domain].worstRating]) {
        domainMap[session.domain].worstRating = rating;
      }
    }
  }

  return Object.entries(domainMap).map(([domain, data]) => {
    const avgScore =
      data.scores.length > 0
        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
        : 3;

    return {
      domain: domain as RacgpDomain,
      attemptCount: history.filter((s) => s.domain === domain).length,
      averageScore: avgScore,
      worstRating: data.worstRating,
      isWeak: avgScore < 2, // below "satisfactorily_demonstrated" average
    };
  });
}

/**
 * Returns domains with below-satisfactory average performance, sorted worst first.
 */
export function getDomainWeaknesses(): DomainSummary[] {
  return getDomainSummaries()
    .filter((d) => d.isWeak)
    .sort((a, b) => a.averageScore - b.averageScore);
}

export function getPatternSummaries(): PatternSummary[] {
  const history = loadHistory();
  const patternMap: Record<
    PerformancePattern,
    { scores: number[]; worstRating: CompetencyRating; attemptCount: number }
  > = {
    red_flag_triage: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
    preventive_opportunism: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
    shared_decision_making: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
    safety_netting: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
    ice_elicitation: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
    explanation_plain_language: { scores: [], worstRating: "fully_demonstrated", attemptCount: 0 },
  };

  for (const session of history) {
    const patternEntries = Object.entries(session.patternScores ?? {}) as Array<
      [PerformancePattern, CompetencyRating]
    >;
    for (const [pattern, rating] of patternEntries) {
      patternMap[pattern].scores.push(RATING_SCORE[rating]);
      patternMap[pattern].attemptCount += 1;
      if (RATING_SCORE[rating] < RATING_SCORE[patternMap[pattern].worstRating]) {
        patternMap[pattern].worstRating = rating;
      }
    }
  }

  return ALL_PATTERNS.map((pattern) => {
    const p = patternMap[pattern];
    const averageScore =
      p.scores.length > 0
        ? p.scores.reduce((a, b) => a + b, 0) / p.scores.length
        : 3;
    return {
      pattern,
      attemptCount: p.attemptCount,
      averageScore,
      worstRating: p.worstRating,
      isWeak: averageScore < 2,
    };
  });
}

/**
 * Returns cases due for spaced repetition review.
 * Priority: cases where the last attempt was a fail/borderline, sorted by
 * oldest attempt first (longest since last practice).
 */
export function getCasesForSpacedRepetition(): typeof CASES {
  const history = loadHistory();

  return CASES.filter((c) => {
    const sessions = history.filter((s) => s.caseId === c.id);
    if (sessions.length === 0) return false;
    const last = sessions[sessions.length - 1];
    return OVERALL_IS_FAIL[last.overallRating];
  }).sort((a, b) => {
    const lastA = history.filter((s) => s.caseId === a.id).pop()?.completedAt ?? 0;
    const lastB = history.filter((s) => s.caseId === b.id).pop()?.completedAt ?? 0;
    return lastA - lastB; // oldest first
  });
}

/**
 * Completion count per case (used by the legacy home page path).
 */
export function getCompletedCountForCase(caseId: string): number {
  return loadHistory().filter((s) => s.caseId === caseId).length;
}

/**
 * Clear all history (for dev/testing).
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(V2_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}
