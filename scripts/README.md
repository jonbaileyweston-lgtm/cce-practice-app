# Drill Calibration Harness

Use `scripts/calibrate-drill.ts` to compare your hand ratings against the drill evaluator v2 output.

## Expected JSON input format

Place one or more `.json` files in a folder. Each file must match this shape:

```json
{
  "transcript": "1. Patient: ...\n2. Candidate: ...",
  "scenario": "Short scenario context for this transcript.",
  "my_ratings": {
    "axis_id": {
      "opening_engagement": "clear_pass",
      "concern_elicitation": "borderline",
      "prioritisation": "needs_work",
      "time_contracting": "borderline",
      "follow_up_planning": "needs_work"
    },
    "hard_fails_triggered": ["leading_or_closed_opening_question"],
    "overall": "needs_work"
  }
}
```

Notes:
- `axis_id` is a map keyed by rubric axis id.
- Axis levels must be one of: `clear_pass`, `borderline`, `needs_work`.
- `overall` must be one of: `pass`, `borderline`, `needs_work`.

## Run

Start the app locally first (default expected API: `http://localhost:3000`):

```bash
npm run dev
```

Then run calibration:

```bash
npx tsx scripts/calibrate-drill.ts <drill_id> <folder_path>
```

Example:

```bash
npx tsx scripts/calibrate-drill.ts agenda_setting scripts/calibration-fixtures/agenda_setting
```

Optional API base URL override:

```bash
CALIBRATION_API_BASE_URL=http://localhost:4000 npx tsx scripts/calibrate-drill.ts agenda_setting scripts/calibration-fixtures/agenda_setting
```

## Output

The script prints:
- per-axis agreement rate
- overall agreement rate
- per-transcript disagreements, including model `evidence_quote` and `evidence_reasoning` for each axis mismatch
