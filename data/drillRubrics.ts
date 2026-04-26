import type { DrillId } from "@/data/drills";
import type { DrillRubric } from "@/types/drillRubric";

export const DRILL_RUBRICS: Partial<Record<DrillId, DrillRubric>> = {
  agenda_setting: {
    drill_id: "agenda_setting",
    family: "structural",
    axes: [
      {
        id: "opening_engagement",
        label: "Opening engagement",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Introduces self with name and role, and adds either preferred-name confirmation or permission to proceed in a warm opening.",
            example_phrase:
              "Hi Sam, I'm Dr Lee, one of the GPs - is it okay if we start with what you'd like us to focus on today?",
          },
          {
            level: "borderline",
            description:
              "Greets and starts appropriately but the opening is flat or rushed, with reduced warmth and/or role clarity.",
            example_phrase:
              "Hi, good to see you - tell me what brought you in.",
          },
          {
            level: "needs_work",
            description:
              "Starts abruptly with task-focused questions or instructions without introduction, consent to proceed, or personal acknowledgement.",
            example_phrase:
              "What's the main symptom? We only have a few minutes.",
          },
        ],
      },
      {
        id: "concern_elicitation",
        label: "Concern elicitation",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Uses an open first question, actively elicits all concerns, and reflects the full list back to confirm nothing is missed.",
            example_phrase:
              "Before we choose where to start, what are all the things you wanted us to cover today?",
          },
          {
            level: "borderline",
            description:
              "Elicits more than one concern but does not clearly confirm the complete list or misses a late-added concern.",
            example_phrase:
              "Okay, headaches and sleep. Anything else quickly?",
          },
          {
            level: "needs_work",
            description:
              "Accepts only the first issue or redirects early, leaving additional concerns unexplored and unacknowledged.",
            example_phrase: "Let's just do the headache; we'll ignore the rest for now.",
          },
        ],
      },
      {
        id: "prioritisation",
        label: "Prioritisation",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Negotiates priority with the patient by naming urgency criteria, agreeing what to address now, and explicitly parking lower-priority items.",
            example_phrase:
              "The chest symptom is the one I'd most like to make sure we have time for today - would it be okay if we started there and came back to the others?",
          },
          {
            level: "borderline",
            description:
              "Sets an order of topics but with limited shared decision language or without clear rationale for why this order is safest.",
            example_phrase:
              "Let's do the chest symptom first, then we can see what else we get through.",
          },
          {
            level: "needs_work",
            description:
              "Begins assessment or management without agreeing priorities, or chooses order unilaterally without acknowledging patient priorities or risk.",
            example_phrase:
              "We'll do scripts first because that's easiest. The other issues can wait.",
          },
        ],
      },
      {
        id: "time_contracting",
        label: "Time contracting",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Early in the consult, states realistic time limits and agrees what scope fits this visit.",
            example_phrase:
              "We've got about 15 minutes today, so let's agree what we can safely cover in that time.",
          },
          {
            level: "borderline",
            description:
              "Mentions time pressure but does not clearly define what will and will not fit this consult.",
            example_phrase:
              "We're a bit tight for time today, so let's just get through what we can.",
          },
          {
            level: "needs_work",
            description:
              "Provides no time boundary for this visit or makes unrealistic promises about what can be completed now.",
            example_phrase: "We'll sort everything today somehow.",
          },
        ],
      },
      {
        id: "follow_up_planning",
        label: "Follow-up planning for deferred concerns",
        anchors: [
          {
            level: "clear_pass",
            description:
              "For concerns not addressed today, sets concrete follow-up arrangements including timing, ownership, and safety-net triggers.",
            example_phrase:
              "Let's book you back with me next Tuesday for the sleep and blood pressure, and if the chest pain worsens before then, please seek urgent care straight away.",
          },
          {
            level: "borderline",
            description:
              "Acknowledges deferred concerns and suggests review, but leaves one key element unclear (specific timing, responsible clinician, or safety-net trigger).",
            example_phrase:
              "We'll book another appointment for the other concerns and keep an eye on things in the meantime.",
          },
          {
            level: "needs_work",
            description:
              "Defers concerns without a concrete review arrangement, with no clear timing, ownership, or safety-net advice for parked items.",
            example_phrase:
              "We'll deal with the rest another time - just book in whenever.",
          },
        ],
      },
    ],
    hard_fails: [
      {
        id: "premature_planning_before_agenda_bounded",
        description:
          "Starts diagnosis, prescribing, or management before the full agenda is elicited and bounded.",
        detection_hint:
          "Candidate offers plan/treatment while only one concern is known and other concerns are not listed or acknowledged.",
      },
      {
        id: "leading_or_closed_opening_question",
        description:
          "Uses a closed or leading opening that pre-frames the consultation and suppresses broader concerns.",
        detection_hint:
          "Trigger only when the candidate's first substantive question is explicitly closed yes/no or agenda-narrowing (e.g., 'You're just here for scripts, right?' or 'Is this about the headaches?'). Do not trigger for open starts (e.g., 'Tell me what brought you in') or for transcripts where the candidate asks no opening question and moves straight from introduction to treatment/planning.",
      },
    ],
    pivotal_moment_prompt:
      "The inflection point in agenda-setting is usually the candidate's response when more than one concern surfaces, or the transition from elicitation to action. Identify the moment in this specific transcript where the consult's trajectory was most determined - do not assume it must involve multiple concerns.",
  },
};
