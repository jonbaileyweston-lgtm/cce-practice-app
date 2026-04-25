export interface Prompt {
  type: "prompt" | "probe" | "must-use";
  text: string;
}

export interface Question {
  number: number;
  text: string;
  timingMinutes: number;
  prompts: Prompt[];
}

export interface RubricItem {
  domain: string;
  domainNumber: number;
  code: string;
  description: string;
  questions: number[]; // which questions this rubric item applies to
}

export interface CompetentCandidateCriteria {
  code: string;
  title: string;
  questions: number[];
  points: string[];
}

export interface PatientRecord {
  name: string;
  age: number;
  gender: string;
  pronouns: string;
  sexAssignedAtBirth: string;
  indigenousStatus: string;
  allergies: string;
  medications: string[];
  pastHistory: string[];
  socialHistory: Record<string, string>;
  familyHistory: string[];
  smoking: string;
  alcohol: string;
  immunisations: string[];
}

/** RACGP curriculum domains used for case tagging and performance tracking */
export type RacgpDomain =
  | "undifferentiated"
  | "chronic_disease"
  | "mental_health"
  | "paediatrics"
  | "womens_health"
  | "older_patient"
  | "preventive"
  | "difficult_conversation"
  | "aboriginal_health"
  | "rural_remote";

export const RACGP_DOMAIN_LABELS: Record<RacgpDomain, string> = {
  undifferentiated: "Undifferentiated presentations",
  chronic_disease: "Chronic disease management",
  mental_health: "Mental health / Perinatal",
  paediatrics: "Paediatrics",
  womens_health: "Women's health",
  older_patient: "Older patients",
  preventive: "Preventive & Population health",
  difficult_conversation: "Difficult conversations",
  aboriginal_health: "Aboriginal & Torres Strait Islander health",
  rural_remote: "Rural & Remote medicine",
};

export type PerformancePattern =
  | "red_flag_triage"
  | "preventive_opportunism"
  | "shared_decision_making"
  | "safety_netting"
  | "ice_elicitation"
  | "explanation_plain_language";

export const PERFORMANCE_PATTERN_LABELS: Record<PerformancePattern, string> = {
  red_flag_triage: "Red-flag triage",
  preventive_opportunism: "Preventive opportunism",
  shared_decision_making: "Shared decision-making",
  safety_netting: "Safety-netting",
  ice_elicitation: "ICE elicitation",
  explanation_plain_language: "Plain-language explanation",
};

export type CaseDifficulty = "standard" | "challenging" | "complex";

export const DIFFICULTY_LABELS: Record<CaseDifficulty, string> = {
  standard: "Standard",
  challenging: "Challenging",
  complex: "Complex",
};

/**
 * Patient persona for Recorded Consultation simulation mode.
 * Not required for Case Discussion cases.
 */
export interface PatientPersona {
  /** Opening line the patient says when the candidate enters */
  openingStatement: string;
  /** History items the patient offers voluntarily when asked open questions */
  volunteerHistory: string[];
  /** Items the patient only reveals if specifically and directly asked */
  withheldHistory: string[];
  /** Patient's ideas, concerns, and expectations */
  ice: {
    ideas: string;
    concerns: string;
    expectations: string;
  };
  /** Emotional tone and manner (e.g. "anxious and tearful", "matter-of-fact") */
  demeanour: string;
  /** How the patient reacts to medical jargon */
  responseToJargon: string;
}

export interface Case {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "M" | "F";
  presentingComplaint: string;
  topics: string[];
  /** Primary RACGP curriculum domain this case tests */
  domain: RacgpDomain;
  /** Relative difficulty of this case */
  difficulty: CaseDifficulty;
  scenario: string;
  /**
   * Verbatim candidate-information sheet (as on the official PDF). When set,
   * the case prep screen shows only this text (plus standard headings). When
   * omitted, the prep screen uses {@link scenario} only so we do not duplicate
   * or accidentally surface structured data that may contain spoilers.
   */
  candidateInformation?: string;
  patientRecord: PatientRecord;
  questions: Question[];
  competentCandidateCriteria: CompetentCandidateCriteria[];
  markingRubric: RubricItem[];
  debriefNotes?: string;
  icpcCode?: string;
  year?: string;
  /**
   * Patient persona for Recorded Consultation simulation mode.
   * If not defined, only Case Discussion mode is available for this case.
   */
  patientPersona?: PatientPersona;
}

// Exam session state
export type ExamPhase =
  | "prep"
  | "active"
  | "complete";

export interface Message {
  role: "examiner" | "candidate";
  content: string;
  timestamp: number;
  questionNumber?: number;
}

export interface ExamSession {
  caseId: string;
  startedAt: number;
  endedAt?: number;
  messages: Message[];
  currentQuestionIndex: number;
  phase: ExamPhase;
}

// Marking / results
export type CompetencyRating =
  | "not_demonstrated"
  | "not_clearly_demonstrated"
  | "satisfactorily_demonstrated"
  | "fully_demonstrated";

export type OverallRating =
  | "clearly_below_standard"
  | "below_expected_standard"
  | "borderline"
  | "at_expected_standard"
  | "above_standard";

export interface RubricItemResult {
  rubricItem: RubricItem;
  rating: CompetencyRating;
  justification: string;
}

export interface QuestionFeedback {
  questionNumber: number;
  questionText: string;
  strengths: string[];
  gaps: string[];
  keyPointsMissed: string[];
}

export interface MarkingResult {
  caseId: string;
  completedAt: number;
  durationSeconds: number;
  rubricResults: RubricItemResult[];
  overallRating: OverallRating;
  overallJustification: string;
  strengths: string[];
  areasForImprovement: string[];
  topThreeChangesToPass: string[];
  perQuestionFeedback: QuestionFeedback[];
  studyTips: string[];
  transcript: Message[];
}

export const RATING_LABELS: Record<CompetencyRating, string> = {
  not_demonstrated: "NOT demonstrated",
  not_clearly_demonstrated: "NOT CLEARLY demonstrated",
  satisfactorily_demonstrated: "SATISFACTORILY demonstrated",
  fully_demonstrated: "FULLY demonstrated",
};

export const OVERALL_RATING_LABELS: Record<OverallRating, string> = {
  clearly_below_standard: "CLEARLY BELOW STANDARD",
  below_expected_standard: "BELOW EXPECTED STANDARD",
  borderline: "BORDERLINE",
  at_expected_standard: "AT EXPECTED STANDARD",
  above_standard: "ABOVE STANDARD",
};

export const RATING_COLORS: Record<CompetencyRating, string> = {
  not_demonstrated: "bg-red-100 text-red-800 border-red-200",
  not_clearly_demonstrated: "bg-orange-100 text-orange-800 border-orange-200",
  satisfactorily_demonstrated: "bg-yellow-100 text-yellow-800 border-yellow-200",
  fully_demonstrated: "bg-green-100 text-green-800 border-green-200",
};

export const OVERALL_RATING_COLORS: Record<OverallRating, string> = {
  clearly_below_standard: "bg-red-600 text-white",
  below_expected_standard: "bg-orange-500 text-white",
  borderline: "bg-yellow-500 text-white",
  at_expected_standard: "bg-blue-600 text-white",
  above_standard: "bg-green-600 text-white",
};
