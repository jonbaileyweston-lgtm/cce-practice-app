import type { Case } from "@/types";

export type Sex = "M" | "F";

export type ExaminerSpeakerRole = "examiner_male" | "examiner_female";
export type PatientSpeakerRole = "patient_male" | "patient_female";

interface ExaminerPersona {
  name: string;
  sex: Sex;
  speakerRole: ExaminerSpeakerRole;
}

const EXAMINER_PERSONAS: ExaminerPersona[] = [
  { name: "Dr James Carter", sex: "M", speakerRole: "examiner_male" },
  { name: "Dr Daniel Hughes", sex: "M", speakerRole: "examiner_male" },
  { name: "Dr Matthew Singh", sex: "M", speakerRole: "examiner_male" },
  { name: "Dr Sarah Bennett", sex: "F", speakerRole: "examiner_female" },
  { name: "Dr Emily Foster", sex: "F", speakerRole: "examiner_female" },
  { name: "Dr Priya Nair", sex: "F", speakerRole: "examiner_female" },
];

const FEMALE_FIRST_NAMES = new Set([
  "angela",
  "susan",
  "ava",
  "amiel",
  "linh",
  "adaeze",
  "dorothy",
  "sophie",
  "nola",
]);

const MALE_FIRST_NAMES = new Set([
  "evan",
  "wei",
  "rohan",
  "thomas",
  "graham",
  "dean",
  "robert",
]);

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function firstToken(name: string): string {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

function toGenderLabel(gender: Sex): "Male" | "Female" {
  return gender === "M" ? "Male" : "Female";
}

function expectedNameGender(firstName: string): Sex | null {
  const isFemale = FEMALE_FIRST_NAMES.has(firstName);
  const isMale = MALE_FIRST_NAMES.has(firstName);
  if (isFemale && !isMale) return "F";
  if (isMale && !isFemale) return "M";
  return null;
}

export function getExaminerPersonaForCase(caseId: string): ExaminerPersona {
  const idx = hashString(caseId) % EXAMINER_PERSONAS.length;
  return EXAMINER_PERSONAS[idx];
}

export function getPatientSpeakerRole(gender: Sex): PatientSpeakerRole {
  return gender === "M" ? "patient_male" : "patient_female";
}

export function validateCaseGenderConsistency(cases: Case[]): void {
  const errors: string[] = [];

  for (const c of cases) {
    const expectedGenderLabel = toGenderLabel(c.patientGender);
    const firstName = firstToken(c.patientName);
    const nameGender = expectedNameGender(firstName);

    if (nameGender === null) {
      errors.push(
        `${c.id}: first name "${firstName}" is not in the gender registry`
      );
    } else if (nameGender !== c.patientGender) {
      errors.push(
        `${c.id}: patientName "${c.patientName}" suggests ${toGenderLabel(
          nameGender
        )}, but patientGender is ${expectedGenderLabel}`
      );
    }

    if (c.patientRecord.name !== c.patientName) {
      errors.push(
        `${c.id}: patientRecord.name "${c.patientRecord.name}" does not match patientName "${c.patientName}"`
      );
    }

    if (c.patientRecord.gender !== expectedGenderLabel) {
      errors.push(
        `${c.id}: patientRecord.gender "${c.patientRecord.gender}" does not match patientGender "${expectedGenderLabel}"`
      );
    }

    if (c.patientRecord.sexAssignedAtBirth !== expectedGenderLabel) {
      errors.push(
        `${c.id}: patientRecord.sexAssignedAtBirth "${c.patientRecord.sexAssignedAtBirth}" does not match patientGender "${expectedGenderLabel}"`
      );
    }

    const pronouns = c.patientRecord.pronouns.toLowerCase();
    if (c.patientGender === "F" && !pronouns.includes("she")) {
      errors.push(
        `${c.id}: patientRecord.pronouns "${c.patientRecord.pronouns}" is inconsistent with female patientGender`
      );
    }
    if (c.patientGender === "M" && !pronouns.includes("he")) {
      errors.push(
        `${c.id}: patientRecord.pronouns "${c.patientRecord.pronouns}" is inconsistent with male patientGender`
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Case gender consistency checks failed:\n- ${errors.join("\n- ")}`
    );
  }
}
