import type { Case } from "@/types";

/** Body text for the candidate prep screen — official sheet override or scenario only. */
export function getCandidatePrepBody(caseData: Case): string {
  return caseData.candidateInformation ?? caseData.scenario;
}
