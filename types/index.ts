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

export interface Case {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "M" | "F";
  presentingComplaint: string;
  topics: string[];
  scenario: string;
  patientRecord: PatientRecord;
  questions: Question[];
  competentCandidateCriteria: CompetentCandidateCriteria[];
  markingRubric: RubricItem[];
  debriefNotes?: string;
  icpcCode?: string;
  year?: string;
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
