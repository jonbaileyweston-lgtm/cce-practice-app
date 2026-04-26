export type AnchorLevel = "clear_pass" | "borderline" | "needs_work";

export interface Anchor {
  level: AnchorLevel;
  description: string;
  example_phrase?: string;
}

type AnchoredAtLevel<TLevel extends AnchorLevel> = Anchor & { level: TLevel };

export type AxisAnchors = [
  AnchoredAtLevel<"clear_pass">,
  AnchoredAtLevel<"borderline">,
  AnchoredAtLevel<"needs_work">,
];

export interface Axis {
  id: string;
  label: string;
  anchors: AxisAnchors;
}

export interface HardFail {
  id: string;
  description: string;
  detection_hint: string;
}

export type DrillRubricFamily =
  | "structural"
  | "process"
  | "communication_quality";

export type DrillRubricAxes = [Axis, Axis, Axis] | [Axis, Axis, Axis, Axis] | [Axis, Axis, Axis, Axis, Axis];

export interface DrillRubric {
  drill_id: string;
  family: DrillRubricFamily;
  axes: DrillRubricAxes;
  hard_fails: HardFail[];
  pivotal_moment_prompt?: string;
}

export interface AxisJudgment {
  axis_id: string;
  level: AnchorLevel;
  evidence_quote: string;
  evidence_reasoning: string;
}

export type EvaluationOverall = "pass" | "borderline" | "needs_work";

export interface EvaluationResult {
  axis_judgments: AxisJudgment[];
  hard_fails_triggered: string[];
  overall: EvaluationOverall;
  pivotal_moment: string;
  retry_sentence: string;
  retry_anchor_quote: string;
}
