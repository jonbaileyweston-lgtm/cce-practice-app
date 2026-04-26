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
  problem_representation: {
    drill_id: "problem_representation",
    family: "structural",
    axes: [
      {
        id: "clinical_qualifiers",
        label: "Clinical qualifiers (who, when, severity, key features)",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Includes core qualifiers that frame risk and management: patient context, tempo/time course, severity signal, and defining positives/negatives.",
            example_phrase:
              "This is a 47-year-old woman with 6 weeks of worsening exertional breathlessness and intermittent chest tightness, now with tachycardia and reduced oxygen saturation.",
          },
          {
            level: "borderline",
            description:
              "Includes some qualifiers but misses one high-value domain (for example tempo, severity, or key discriminator), leaving an incomplete risk frame.",
            example_phrase:
              "She has breathlessness and chest tightness and has been unwell for a while.",
          },
          {
            level: "needs_work",
            description:
              "Gives a symptom list with minimal qualifiers, so the listener cannot infer acuity, trajectory, or risk level.",
            example_phrase: "She's short of breath and has chest symptoms.",
          },
        ],
      },
      {
        id: "problem_framing_not_final_diagnosis",
        label: "Problem framing rather than premature diagnosis certainty",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Frames the one-liner as a clinical problem with leading hypothesis and uncertainty boundaries, rather than asserting a fixed final diagnosis.",
            example_phrase:
              "This is likely evolving heart failure physiology, though pulmonary and ischemic causes remain active concerns.",
          },
          {
            level: "borderline",
            description:
              "States a likely diagnosis but uncertainty language is weak or alternatives are only implied.",
            example_phrase:
              "This sounds most consistent with heart failure, with other causes still possible.",
          },
          {
            level: "needs_work",
            description:
              "Declares a definitive diagnosis without acknowledging uncertainty in a context where key ambiguity remains.",
            example_phrase: "This is definitely heart failure.",
          },
        ],
      },
      {
        id: "management_relevance",
        label: "Representation links to immediate management direction",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Representation explicitly surfaces the risk signal that drives immediate next-step urgency or escalation.",
            example_phrase:
              "Given the worsening trajectory and objective instability, this needs urgent same-day escalation while we clarify cause.",
          },
          {
            level: "borderline",
            description:
              "Hints at risk but does not clearly connect the one-liner to urgency level or concrete immediate direction.",
            example_phrase:
              "This could be serious and we should investigate further.",
          },
          {
            level: "needs_work",
            description:
              "Representation does not signal urgency, making immediate safe management direction unclear.",
            example_phrase: "We'll organise some routine tests and see what turns up.",
          },
        ],
      },
      {
        id: "concise_single_sentence_synthesis",
        label: "Concise one-sentence synthesis",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Delivers one concise, information-dense sentence without drift into narrative retelling or management checklisting.",
            example_phrase:
              "A previously independent 78-year-old with progressive 12-month cognitive decline and new safety failures has probable major neurocognitive syndrome requiring urgent safety-oriented assessment.",
          },
          {
            level: "borderline",
            description:
              "Mostly concise but contains avoidable extra detail or mild run-on structure that dilutes the core synthesis.",
            example_phrase:
              "He has had memory issues for about a year and some safety concerns and mood changes and I think this is likely dementia needing workup.",
          },
          {
            level: "needs_work",
            description:
              "Long, unfocused recounting with no clear one-line synthesis point.",
            example_phrase:
              "So first he came in and then his daughter said a few things and there were bloods and a CT and a lot going on overall.",
          },
        ],
      },
    ],
    hard_fails: [
      {
        id: "asserts_final_diagnosis_without_uncertainty",
        description:
          "Presents a definitive final diagnosis in a clinically uncertain scenario, collapsing necessary diagnostic uncertainty.",
        detection_hint:
          "Trigger only when the candidate explicitly states certainty (e.g., 'This is definitely X') despite unresolved competing causes. Do not trigger when they state a leading diagnosis with clear uncertainty language.",
      },
      {
        id: "omits_management_changing_risk_qualifier",
        description:
          "Omits a critical qualifier that materially changes urgency or immediate management priority.",
        detection_hint:
          "Trigger only when transcript contains a clear risk/acuity discriminator (for example shock physiology, severe instability, red-flag progression) that is absent from the representation. Do not trigger for minor omitted descriptive details that do not alter urgency.",
      },
    ],
    pivotal_moment_prompt:
      "The inflection point in problem representation is usually where the candidate either crystallises risk and uncertainty into one line or defaults to vague symptom listing. Identify the moment in this transcript where synthesis quality most determined safety and clarity.",
  },
  differential_ranking: {
    drill_id: "differential_ranking",
    family: "structural",
    axes: [
      {
        id: "most_likely_with_reasoning",
        label: "Most-likely diagnosis with brief evidence-based reasoning",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Names a most-likely diagnosis and gives concise discriminating reasons tied to transcript findings.",
            example_phrase:
              "Most likely this is DVT given unilateral swelling, calf tenderness, and recent prolonged travel.",
          },
          {
            level: "borderline",
            description:
              "Names a likely diagnosis but reasoning is generic or only loosely tied to discriminating findings.",
            example_phrase: "DVT is probably the top diagnosis because it fits overall.",
          },
          {
            level: "needs_work",
            description:
              "Fails to identify a clear most-likely diagnosis or gives one with no usable reasoning.",
            example_phrase: "It could be many things, hard to say what's most likely.",
          },
        ],
      },
      {
        id: "alternative_differentials",
        label: "Reasonable less-likely alternatives",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Includes plausible alternatives and signals why they are lower probability than the lead diagnosis.",
            example_phrase:
              "Cellulitis and ruptured Baker's cyst are alternatives, but both are less likely given the current pattern and risk profile.",
          },
          {
            level: "borderline",
            description:
              "Lists alternatives but does not clearly distinguish their relative probability.",
            example_phrase:
              "Other possibilities are cellulitis or a Baker's cyst.",
          },
          {
            level: "needs_work",
            description:
              "Alternatives are absent, implausible, or presented as an unstructured list with no ranking intent.",
            example_phrase:
              "It could be infection, clot, muscle strain, heart failure, cancer, or just normal swelling.",
          },
        ],
      },
      {
        id: "cant_miss_with_safety_reasoning",
        label: "Can't-miss diagnosis with safety consequence",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Explicitly identifies a can't-miss diagnosis and states why missing it would create immediate safety risk.",
            example_phrase:
              "PE is the can't-miss here because delayed recognition could lead to sudden deterioration.",
          },
          {
            level: "borderline",
            description:
              "Names a serious diagnosis but safety consequence and urgency rationale are underdeveloped.",
            example_phrase: "PE is another concern and we should keep it in mind.",
          },
          {
            level: "needs_work",
            description:
              "Fails to identify a relevant can't-miss diagnosis for the presentation.",
            example_phrase: "I don't think there are any high-risk causes here.",
          },
        ],
      },
      {
        id: "ranking_logic_and_next_step_alignment",
        label: "Ranking logic aligned to immediate next-step plan",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Ranking clearly reflects both probability and consequence, and directly informs immediate investigation/escalation order.",
            example_phrase:
              "Because DVT is most likely and PE is can't-miss, I'd arrange urgent imaging and escalation thresholds today.",
          },
          {
            level: "borderline",
            description:
              "Ranking is present but linkage to immediate action is partial or non-specific.",
            example_phrase:
              "We'll do some tests next and then decide based on what they show.",
          },
          {
            level: "needs_work",
            description:
              "Ranking does not guide action, or action contradicts stated risk hierarchy.",
            example_phrase:
              "Even though PE is possible, we can just review routinely next week.",
          },
        ],
      },
    ],
    hard_fails: [
      {
        id: "omits_relevant_cant_miss_diagnosis",
        description:
          "Does not name a clinically relevant can't-miss diagnosis in a presentation with clear high-consequence alternatives.",
        detection_hint:
          "Trigger only when transcript contains red-flag context where a specific high-consequence diagnosis is expected (for example PE, ACS, sepsis, cauda equina) and candidate fails to identify any equivalent can't-miss. Do not trigger if they name one with imperfect wording.",
      },
      {
        id: "inverts_risk_priority_in_ranking",
        description:
          "Places low-consequence explanations above high-consequence plausible diagnoses without safety justification.",
        detection_hint:
          "Trigger only when the candidate explicitly deprioritises a plausible high-risk diagnosis while prioritising lower-risk causes and gives no mitigating safety rationale.",
      },
    ],
    pivotal_moment_prompt:
      "The inflection point in differential ranking is usually where the candidate commits to risk hierarchy under uncertainty. Identify the moment where their ranking most strongly shaped immediate safety direction.",
  },
  closing_summary: {
    drill_id: "closing_summary",
    family: "structural",
    axes: [
      {
        id: "diagnosis_or_working_impression_recap",
        label: "Diagnosis/working impression recap",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Closes with a clear plain-language recap of the working diagnosis or current clinical impression.",
            example_phrase:
              "To summarise, this looks most consistent with a viral chest infection rather than pneumonia at this stage.",
          },
          {
            level: "borderline",
            description:
              "Attempts recap but language is vague or overly technical, leaving partial uncertainty for the patient.",
            example_phrase:
              "So overall it's likely benign and we're treating conservatively.",
          },
          {
            level: "needs_work",
            description:
              "Ends without any diagnostic/clinical impression recap.",
            example_phrase: "Anyway, let's move to next steps.",
          },
        ],
      },
      {
        id: "plan_recap_with_patient_tasks",
        label: "Plan recap with explicit patient tasks",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Summarises agreed management clearly, including what the patient does now and what the clinic does next.",
            example_phrase:
              "From today you'll start the new inhaler twice daily, we'll organise the chest X-ray, and I'll review you after results.",
          },
          {
            level: "borderline",
            description:
              "Summarises plan partially but key ownership details or sequence remain unclear.",
            example_phrase:
              "We'll start treatment and arrange tests, then follow up.",
          },
          {
            level: "needs_work",
            description:
              "Plan summary is absent or so vague that neither tasks nor ownership are actionable.",
            example_phrase: "We'll just see how things go from here.",
          },
        ],
      },
      {
        id: "follow_up_arrangements",
        label: "Follow-up arrangement with concrete timing",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Provides concrete review timing and who will review, aligned to condition risk and expected trajectory.",
            example_phrase:
              "Let's book you back with me in 48 hours to reassess, sooner if anything worsens.",
          },
          {
            level: "borderline",
            description:
              "Mentions follow-up but timing or ownership is non-specific.",
            example_phrase:
              "We'll review you again soon.",
          },
          {
            level: "needs_work",
            description:
              "No follow-up arrangement is provided for an issue that requires active review.",
            example_phrase: "No need to book anything unless you feel like it.",
          },
        ],
      },
      {
        id: "safety_contingencies",
        label: "Safety contingencies and escalation advice",
        anchors: [
          {
            level: "clear_pass",
            description:
              "States clear red-flag deterioration features and what exact escalation action to take for each.",
            example_phrase:
              "If you develop chest pain at rest, worsening breathlessness, or fainting, call an ambulance immediately rather than waiting for review.",
          },
          {
            level: "borderline",
            description:
              "Gives some safety advice but with incomplete thresholds or unclear actions.",
            example_phrase:
              "If you're getting worse, seek urgent care.",
          },
          {
            level: "needs_work",
            description:
              "No meaningful safety contingency is provided despite a presentation requiring one.",
            example_phrase:
              "You should be fine - just wait for the follow-up.",
          },
        ],
      },
      {
        id: "concise_closure",
        label: "Concise closure under time pressure",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Delivers a focused close that covers recap, plan, follow-up, and contingencies without unnecessary drift.",
            example_phrase:
              "Quick recap: likely viral illness, start the treatment today, review in two days, and escalate immediately for breathing red flags.",
          },
          {
            level: "borderline",
            description:
              "Closure includes key elements but is wordy or disorganised, reducing clarity.",
            example_phrase:
              "So there are a few things and we'll do those and then maybe check in depending on how things go.",
          },
          {
            level: "needs_work",
            description:
              "Closing is rambling or abruptly cut off before core safety content is delivered.",
            example_phrase:
              "Anyway, that's probably enough for today, bye.",
          },
        ],
      },
    ],
    hard_fails: [
      {
        id: "no_safety_net_when_required",
        description:
          "Fails to provide safety-net escalation advice in a presentation where deterioration contingencies are clinically required.",
        detection_hint:
          "Trigger only when the transcript context includes plausible deterioration risk and the candidate gives no red flags plus no escalation action. Do not trigger when they provide at least one concrete threshold-action pair, even if incomplete.",
      },
      {
        id: "unsafe_false_reassurance_at_close",
        description:
          "Provides definitive reassurance that discourages urgent care despite unresolved risk.",
        detection_hint:
          "Trigger only when candidate uses explicit discouraging reassurance (e.g., 'You definitely don't need emergency care') in a context where urgent deterioration remains plausible.",
      },
    ],
    pivotal_moment_prompt:
      "The inflection point in closing summary is usually where the candidate either translates the consult into an actionable shared close or leaves unsafe ambiguity. Identify the moment in this transcript where closure quality most determined patient safety.",
  },
  safety_netting: {
    drill_id: "safety_netting",
    family: "structural",
    axes: [
      {
        id: "graded_urgency_thresholds",
        label: "Graded urgency thresholds",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Distinguishes at least two urgency tiers (routine review vs urgent same-day vs emergency) with explicit thresholds.",
            example_phrase:
              "If symptoms are steady, review with me tomorrow; if they worsen tonight, go to urgent care; if severe chest pain or collapse occurs, call an ambulance.",
          },
          {
            level: "borderline",
            description:
              "Mentions urgency levels but thresholds between tiers are blurred or incomplete.",
            example_phrase:
              "If it changes, get seen sooner, and if it's bad, go to emergency.",
          },
          {
            level: "needs_work",
            description:
              "Provides ungraded advice with no usable urgency thresholds.",
            example_phrase: "Come back if it gets worse.",
          },
        ],
      },
      {
        id: "specific_symptom_triggers",
        label: "Specific symptom triggers named",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Names concrete deterioration symptoms/signs relevant to the presentation, not generic 'worse' language.",
            example_phrase:
              "Come straight in if fever persists, breathing becomes hard at rest, or you're unable to keep fluids down.",
          },
          {
            level: "borderline",
            description:
              "Names at least one relevant trigger but list is incomplete or partially generic.",
            example_phrase:
              "If your breathing gets worse or anything unusual happens, seek care.",
          },
          {
            level: "needs_work",
            description:
              "Does not name specific triggers, so the patient cannot recognise escalation points.",
            example_phrase:
              "You'll know if it's bad - just use your judgment.",
          },
        ],
      },
      {
        id: "action_instructions_per_threshold",
        label: "Action instructions per threshold",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Pairs each threshold with a concrete action (book review, urgent clinic/ED, ambulance) and avoids ambiguous verbs.",
            example_phrase:
              "For mild persistence, book with me tomorrow; for marked worsening tonight, go to ED; for collapse or severe breathlessness, call 000.",
          },
          {
            level: "borderline",
            description:
              "Gives actions but one or more thresholds lack clear destination or timing.",
            example_phrase:
              "If worse, seek urgent help, and if severe call emergency.",
          },
          {
            level: "needs_work",
            description:
              "Action advice is vague or contradictory and cannot be followed safely.",
            example_phrase:
              "If really bad, maybe wait and see for a bit, then decide what to do.",
          },
        ],
      },
      {
        id: "written_or_repeat_back_reinforcement",
        label: "Written/repeat-back reinforcement",
        anchors: [
          {
            level: "clear_pass",
            description:
              "Reinforces safety-net advice with written instructions or explicit repeat-back confirmation.",
            example_phrase:
              "I'll write these red flags down now - can you read back what would make you call an ambulance?",
          },
          {
            level: "borderline",
            description:
              "Attempts reinforcement but without clear confirmation the patient understood escalation instructions.",
            example_phrase:
              "I'll give you some notes, have a look when you get home.",
          },
          {
            level: "needs_work",
            description:
              "Ends safety-netting without any reinforcement or understanding check.",
            example_phrase:
              "I've already explained it, so let's leave it there.",
          },
        ],
      },
    ],
    hard_fails: [
      {
        id: "vague_non_actionable_safety_advice",
        description:
          "Safety-net advice is too vague to guide action (for example only 'come back if worse' with no thresholds or destination).",
        detection_hint:
          "Trigger only when advice lacks both specific deterioration triggers and specific actions. Do not trigger if candidate provides at least one concrete threshold-action pair.",
      },
      {
        id: "gives_unsafe_deescalation_for_red_flags",
        description:
          "Advises watchful waiting or routine review for symptoms that should trigger urgent or emergency escalation.",
        detection_hint:
          "Trigger only when candidate explicitly directs low-urgency action despite naming or hearing high-risk red-flag features.",
      },
    ],
    pivotal_moment_prompt:
      "The inflection point in safety-netting is usually where the candidate converts uncertainty into concrete threshold-action instructions. Identify the moment in this transcript where escalation clarity was either secured or lost.",
  },
};
