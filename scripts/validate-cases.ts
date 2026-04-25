import { CASES } from "../data/cases";
import type { Case } from "../types";
import { validateCaseGenderConsistency } from "../lib/voicePersonas";

type ValidationError = {
  caseId: string;
  message: string;
};

function addError(errors: ValidationError[], c: Case, message: string): void {
  errors.push({ caseId: c.id, message });
}

function validateSingleCase(c: Case, errors: ValidationError[]): void {
  if (!c.id?.trim()) addError(errors, c, "Missing case id");
  if (!c.patientName?.trim()) addError(errors, c, "Missing patientName");
  if (!c.presentingComplaint?.trim()) addError(errors, c, "Missing presentingComplaint");
  if (!c.scenario?.trim()) addError(errors, c, "Missing scenario");
  if (!Array.isArray(c.questions) || c.questions.length === 0) {
    addError(errors, c, "questions must contain at least one question");
  }

  const qNums = c.questions.map((q) => q.number);
  const sorted = [...qNums].sort((a, b) => a - b);
  sorted.forEach((num, idx) => {
    if (num !== idx + 1) {
      addError(errors, c, `Question numbers must be sequential from 1 (found ${qNums.join(", ")})`);
    }
  });

  const validQuestionNumbers = new Set(qNums);
  const criteriaCodes = new Set(c.competentCandidateCriteria.map((cc) => cc.code));

  for (const r of c.markingRubric) {
    if (!criteriaCodes.has(r.code)) {
      addError(errors, c, `Rubric code ${r.code} has no matching competentCandidateCriteria entry`);
    }
    for (const qn of r.questions) {
      if (!validQuestionNumbers.has(qn)) {
        addError(errors, c, `Rubric code ${r.code} references missing question number ${qn}`);
      }
    }
  }

  for (const cc of c.competentCandidateCriteria) {
    for (const qn of cc.questions) {
      if (!validQuestionNumbers.has(qn)) {
        addError(errors, c, `Competency ${cc.code} references missing question number ${qn}`);
      }
    }
    if (!Array.isArray(cc.points) || cc.points.length === 0) {
      addError(errors, c, `Competency ${cc.code} has no behavioural points`);
    }
  }

  if (c.patientPersona) {
    const p = c.patientPersona;
    if (!p.openingStatement?.trim()) addError(errors, c, "patientPersona.openingStatement is required");
    if (!Array.isArray(p.volunteerHistory) || p.volunteerHistory.length === 0) {
      addError(errors, c, "patientPersona.volunteerHistory must contain at least one item");
    }
    if (!Array.isArray(p.withheldHistory) || p.withheldHistory.length === 0) {
      addError(errors, c, "patientPersona.withheldHistory must contain at least one item");
    }
    if (!p.ice?.ideas?.trim()) addError(errors, c, "patientPersona.ice.ideas is required");
    if (!p.ice?.concerns?.trim()) addError(errors, c, "patientPersona.ice.concerns is required");
    if (!p.ice?.expectations?.trim()) addError(errors, c, "patientPersona.ice.expectations is required");
    if (!p.demeanour?.trim()) addError(errors, c, "patientPersona.demeanour is required");
    if (!p.responseToJargon?.trim()) addError(errors, c, "patientPersona.responseToJargon is required");
  }
}

function main(): void {
  const errors: ValidationError[] = [];

  const ids = new Set<string>();
  for (const c of CASES) {
    if (ids.has(c.id)) {
      errors.push({ caseId: c.id, message: "Duplicate case id detected" });
    }
    ids.add(c.id);
    validateSingleCase(c, errors);
  }

  try {
    validateCaseGenderConsistency(CASES);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push({
      caseId: "GLOBAL",
      message: msg.replace(/^Case gender consistency checks failed:\s*/i, "").trim(),
    });
  }

  if (errors.length > 0) {
    console.error(`\nCase preflight failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
    for (const e of errors) {
      console.error(`- [${e.caseId}] ${e.message}`);
    }
    process.exit(1);
  }

  console.log(`Case preflight passed (${CASES.length} cases validated).`);
}

main();
