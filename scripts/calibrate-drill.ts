import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type AxisLevel = "clear_pass" | "borderline" | "needs_work";
type OverallLevel = "pass" | "borderline" | "needs_work";

interface CalibrationInput {
  transcript: string;
  scenario: string;
  my_ratings: {
    axis_id: Record<string, AxisLevel>;
    hard_fails_triggered: string[];
    overall: OverallLevel;
  };
}

interface AxisJudgment {
  axis_id: string;
  level: AxisLevel;
  evidence_quote: string;
  evidence_reasoning: string;
}

interface EvaluationResult {
  axis_judgments: AxisJudgment[];
  hard_fails_triggered: string[];
  overall: OverallLevel;
  pivotal_moment: string;
  retry_sentence: string;
  retry_anchor_quote: string;
}

interface TranscriptReport {
  fileName: string;
  expected: CalibrationInput["my_ratings"];
  actual: EvaluationResult;
  axisDisagreements: Array<{
    axisId: string;
    expected: AxisLevel;
    actual: AxisLevel;
    evidenceQuote: string;
    evidenceReasoning: string;
  }>;
  hardFailMismatch: {
    expectedOnly: string[];
    actualOnly: string[];
  } | null;
  overallMatch: boolean;
}

function printUsage(): void {
  console.log("Usage: tsx scripts/calibrate-drill.ts <drill_id> <folder_path>");
}

function isAxisLevel(value: unknown): value is AxisLevel {
  return value === "clear_pass" || value === "borderline" || value === "needs_work";
}

function isOverallLevel(value: unknown): value is OverallLevel {
  return value === "pass" || value === "borderline" || value === "needs_work";
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function arrayDiff(lhs: string[], rhs: string[]): string[] {
  const rhsSet = new Set(rhs);
  return lhs.filter((item) => !rhsSet.has(item));
}

function parseAndValidateInput(raw: string, fileName: string): CalibrationInput {
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(`[${fileName}] Root JSON must be an object.`);
  }

  const record = parsed as Record<string, unknown>;
  const transcript = record.transcript;
  const scenario = record.scenario;
  const myRatings = record.my_ratings;

  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    throw new Error(`[${fileName}] "transcript" must be a non-empty string.`);
  }
  if (typeof scenario !== "string") {
    throw new Error(`[${fileName}] "scenario" must be a string.`);
  }
  if (typeof myRatings !== "object" || myRatings === null) {
    throw new Error(`[${fileName}] "my_ratings" must be an object.`);
  }

  const ratings = myRatings as Record<string, unknown>;
  const axisId = ratings.axis_id;
  const hardFailsTriggered = ratings.hard_fails_triggered;
  const overall = ratings.overall;

  if (typeof axisId !== "object" || axisId === null) {
    throw new Error(`[${fileName}] "my_ratings.axis_id" must be an object.`);
  }
  const axisRatings = axisId as Record<string, unknown>;
  const normalizedAxisRatings: Record<string, AxisLevel> = {};
  for (const [axisKey, axisValue] of Object.entries(axisRatings)) {
    if (!isAxisLevel(axisValue)) {
      throw new Error(
        `[${fileName}] "my_ratings.axis_id.${axisKey}" must be one of clear_pass | borderline | needs_work.`
      );
    }
    normalizedAxisRatings[axisKey] = axisValue;
  }
  if (Object.keys(normalizedAxisRatings).length === 0) {
    throw new Error(`[${fileName}] "my_ratings.axis_id" must include at least one axis.`);
  }

  if (!Array.isArray(hardFailsTriggered) || !hardFailsTriggered.every((item) => typeof item === "string")) {
    throw new Error(`[${fileName}] "my_ratings.hard_fails_triggered" must be string[].`);
  }
  if (!isOverallLevel(overall)) {
    throw new Error(
      `[${fileName}] "my_ratings.overall" must be one of pass | borderline | needs_work.`
    );
  }

  return {
    transcript,
    scenario,
    my_ratings: {
      axis_id: normalizedAxisRatings,
      hard_fails_triggered: uniqueSorted(hardFailsTriggered),
      overall,
    },
  };
}

function parseAndValidateEvaluation(raw: unknown, fileName: string): EvaluationResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`[${fileName}] API response was not an object.`);
  }
  const record = raw as Record<string, unknown>;
  const axisJudgmentsRaw = record.axis_judgments;
  const hardFailsRaw = record.hard_fails_triggered;
  const overallRaw = record.overall;

  if (!Array.isArray(axisJudgmentsRaw)) {
    throw new Error(`[${fileName}] API response missing axis_judgments array.`);
  }
  if (!Array.isArray(hardFailsRaw) || !hardFailsRaw.every((item) => typeof item === "string")) {
    throw new Error(`[${fileName}] API response hard_fails_triggered must be string[].`);
  }
  if (!isOverallLevel(overallRaw)) {
    throw new Error(`[${fileName}] API response overall is invalid.`);
  }

  const axisJudgments: AxisJudgment[] = axisJudgmentsRaw.map((item, idx) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`[${fileName}] axis_judgments[${idx}] must be an object.`);
    }
    const axisRecord = item as Record<string, unknown>;
    const axisId = axisRecord.axis_id;
    const level = axisRecord.level;
    const evidenceQuote = axisRecord.evidence_quote;
    const evidenceReasoning = axisRecord.evidence_reasoning;
    if (typeof axisId !== "string" || axisId.length === 0) {
      throw new Error(`[${fileName}] axis_judgments[${idx}].axis_id must be non-empty string.`);
    }
    if (!isAxisLevel(level)) {
      throw new Error(`[${fileName}] axis_judgments[${idx}].level is invalid.`);
    }
    if (typeof evidenceQuote !== "string" || evidenceQuote.length === 0) {
      throw new Error(`[${fileName}] axis_judgments[${idx}].evidence_quote must be non-empty string.`);
    }
    if (typeof evidenceReasoning !== "string" || evidenceReasoning.length === 0) {
      throw new Error(
        `[${fileName}] axis_judgments[${idx}].evidence_reasoning must be non-empty string.`
      );
    }
    return {
      axis_id: axisId,
      level,
      evidence_quote: evidenceQuote,
      evidence_reasoning: evidenceReasoning,
    };
  });

  if (typeof record.pivotal_moment !== "string" || typeof record.retry_sentence !== "string") {
    throw new Error(`[${fileName}] API response missing expected v2 string fields.`);
  }

  return {
    axis_judgments: axisJudgments,
    hard_fails_triggered: uniqueSorted(hardFailsRaw),
    overall: overallRaw,
    pivotal_moment: record.pivotal_moment,
    retry_sentence: record.retry_sentence,
    retry_anchor_quote: typeof record.retry_anchor_quote === "string" ? record.retry_anchor_quote : "",
  };
}

async function main(): Promise<void> {
  const [, , drillIdArg, folderArg] = process.argv;
  if (!drillIdArg || !folderArg) {
    printUsage();
    process.exit(1);
  }

  const baseUrl = process.env.CALIBRATION_API_BASE_URL ?? "http://localhost:3000";
  const folderPath = path.resolve(folderArg);
  const entries = await readdir(folderPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    console.log(`No JSON fixtures found in ${folderPath}`);
    console.log("Nothing to calibrate yet. Add fixture JSON files and re-run.");
    return;
  }

  const reports: TranscriptReport[] = [];
  const axisTotals = new Map<string, { correct: number; total: number }>();
  let overallCorrect = 0;

  for (const fileName of files) {
    const fullPath = path.join(folderPath, fileName);
    const input = parseAndValidateInput(await readFile(fullPath, "utf8"), fileName);
    const response = await fetch(`${baseUrl}/api/drills/evaluate-v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drill_id: drillIdArg,
        transcript: input.transcript,
        scenario_context: input.scenario,
      }),
    });

    const raw = (await response.json()) as unknown;
    if (!response.ok) {
      const errorMessage =
        typeof raw === "object" && raw !== null && "error" in (raw as Record<string, unknown>)
          ? String((raw as Record<string, unknown>).error)
          : "Unknown evaluate-v2 API error";
      throw new Error(`[${fileName}] evaluate-v2 failed (${response.status}): ${errorMessage}`);
    }

    const actual = parseAndValidateEvaluation(raw, fileName);
    const expected = input.my_ratings;
    const modelAxisById = new Map(actual.axis_judgments.map((judgment) => [judgment.axis_id, judgment]));
    const axisDisagreements: TranscriptReport["axisDisagreements"] = [];

    for (const [axisId, expectedLevel] of Object.entries(expected.axis_id)) {
      const tally = axisTotals.get(axisId) ?? { correct: 0, total: 0 };
      tally.total += 1;
      const modelJudgment = modelAxisById.get(axisId);
      if (modelJudgment?.level === expectedLevel) {
        tally.correct += 1;
      } else {
        axisDisagreements.push({
          axisId,
          expected: expectedLevel,
          actual: modelJudgment?.level ?? "needs_work",
          evidenceQuote:
            modelJudgment?.evidence_quote ??
            "(axis missing from model output; no evidence quote returned)",
          evidenceReasoning:
            modelJudgment?.evidence_reasoning ??
            "(axis missing from model output; no evidence reasoning returned)",
        });
      }
      axisTotals.set(axisId, tally);
    }

    const expectedHardFails = uniqueSorted(expected.hard_fails_triggered);
    const actualHardFails = uniqueSorted(actual.hard_fails_triggered);
    const expectedOnly = arrayDiff(expectedHardFails, actualHardFails);
    const actualOnly = arrayDiff(actualHardFails, expectedHardFails);
    const hardFailMismatch =
      expectedOnly.length === 0 && actualOnly.length === 0
        ? null
        : { expectedOnly, actualOnly };

    const overallMatch = expected.overall === actual.overall;
    if (overallMatch) overallCorrect += 1;

    reports.push({
      fileName,
      expected,
      actual,
      axisDisagreements,
      hardFailMismatch,
      overallMatch,
    });
  }

  console.log(`\nCalibration results for drill_id="${drillIdArg}"`);
  console.log(`Transcripts processed: ${reports.length}`);
  console.log(`API base URL: ${baseUrl}`);

  console.log("\nPer-axis agreement:");
  const axisIds = [...axisTotals.keys()].sort();
  for (const axisId of axisIds) {
    const tally = axisTotals.get(axisId)!;
    const rate = (100 * tally.correct) / tally.total;
    console.log(
      `- ${axisId}: ${tally.correct}/${tally.total} (${rate.toFixed(1)}%)`
    );
  }

  const overallRate = (100 * overallCorrect) / reports.length;
  console.log(`\nOverall agreement: ${overallCorrect}/${reports.length} (${overallRate.toFixed(1)}%)`);

  console.log("\nPer-transcript disagreement breakdown:");
  for (const report of reports) {
    const hasAxisDisagreement = report.axisDisagreements.length > 0;
    const hasHardFailMismatch = report.hardFailMismatch !== null;
    const hasOverallMismatch = !report.overallMatch;

    console.log(`\n- ${report.fileName}`);
    if (!hasAxisDisagreement && !hasHardFailMismatch && !hasOverallMismatch) {
      console.log("  All ratings match.");
      continue;
    }

    if (hasOverallMismatch) {
      console.log(
        `  Overall mismatch: expected=${report.expected.overall} model=${report.actual.overall}`
      );
    }

    if (hasHardFailMismatch && report.hardFailMismatch) {
      const expectedOnly = report.hardFailMismatch.expectedOnly.join(", ") || "(none)";
      const actualOnly = report.hardFailMismatch.actualOnly.join(", ") || "(none)";
      console.log(`  Hard fail mismatch: expected-only=[${expectedOnly}] model-only=[${actualOnly}]`);
    }

    if (hasAxisDisagreement) {
      console.log("  Axis disagreements:");
      for (const disagreement of report.axisDisagreements) {
        console.log(
          `    * ${disagreement.axisId}: expected=${disagreement.expected} model=${disagreement.actual}`
        );
        console.log(`      evidence_quote: "${disagreement.evidenceQuote}"`);
        console.log(`      evidence_reasoning: ${disagreement.evidenceReasoning}`);
      }
    }
  }
}

main().catch((error) => {
  console.error("\nCalibration run failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
