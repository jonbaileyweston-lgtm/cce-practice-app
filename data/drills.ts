export type DrillId =
  | "agenda_setting"
  | "ice_elicitation"
  | "focused_hypothesis_history"
  | "red_flag_triage"
  | "problem_representation"
  | "differential_ranking"
  | "investigation_justification"
  | "shared_decision_disagreement"
  | "risk_communication_plain_language"
  | "chunk_and_check"
  | "safety_netting"
  | "uncertainty_language"
  | "closing_summary"
  | "opportunistic_prevention";

export interface DrillVariant {
  id: string;
  scenario: string;
  openingPrompt: string;
  followUpPrompts: string[];
}

export interface DrillDefinition {
  id: DrillId;
  title: string;
  targetSkill: string;
  estimatedMinutes: string;
  passCriteria: string[];
  variants: DrillVariant[];
}

export const DRILLS: DrillDefinition[] = [
  {
    id: "agenda_setting",
    title: "Agenda Setting (First 30 Seconds)",
    targetSkill: "Set a clear shared agenda early to prevent time drift.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Acknowledges all concerns without dismissing",
      "Negotiates and prioritises a clear agenda",
      "Signposts a plan for deferred items and follow-up",
    ],
    variants: [
      {
        id: "as_1",
        scenario: "A patient opens with multiple concerns and seems worried about being rushed.",
        openingPrompt: "I've got a few things today — headaches, poor sleep, and my blood pressure tablets.",
        followUpPrompts: [
          "Can we cover everything today?",
          "What should we prioritise first?",
          "How will we handle the other concerns?",
        ],
      },
      {
        id: "as_2",
        scenario: "A parent brings their child for a rash, then raises two unrelated family concerns.",
        openingPrompt: "While we're here, can I ask about my daughter's rash, my migraines, and my husband's scripts?",
        followUpPrompts: [
          "What can we safely do today?",
          "Which issue needs priority right now?",
          "Can we make a plan for the rest?",
        ],
      },
      {
        id: "as_3",
        scenario: "A patient with diabetes arrives late and wants to discuss five problems at once.",
        openingPrompt: "Sorry I'm late — quick one: sugars, feet pain, forms, cholesterol, and my sleep tablets.",
        followUpPrompts: [
          "How do we choose what to do first?",
          "Can we still get through enough today?",
          "When do we review the remaining items?",
        ],
      },
      {
        id: "as_4",
        scenario: "A new patient starts with chest discomfort but quickly shifts to unrelated preventive requests.",
        openingPrompt: "I've had some chest discomfort, and also need a skin check and vaccine advice.",
        followUpPrompts: [
          "What should we focus on immediately?",
          "Can the other items wait safely?",
          "How do we make sure they're not missed?",
        ],
      },
      {
        id: "as_5",
        scenario: "A patient appears distressed and jumps between symptoms and social stressors.",
        openingPrompt: "Everything's a mess — my stomach, my anxiety, and work is falling apart.",
        followUpPrompts: [
          "How will you structure this with me?",
          "What do we tackle first today?",
          "How do we make a follow-up plan?",
        ],
      },
    ],
  },
  {
    id: "ice_elicitation",
    title: "ICE Elicitation",
    targetSkill: "Identify ideas, concerns, and expectations quickly and naturally.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Elicits all ICE elements explicitly",
      "Uses empathic and non-judgemental language",
      "Summarises ICE back to patient clearly",
    ],
    variants: [
      {
        id: "ice_1",
        scenario: "A 34-year-old presents with intermittent headaches and visible anxiety.",
        openingPrompt: "Doctor, I keep getting these headaches and it's starting to worry me.",
        followUpPrompts: [
          "What do you think might be causing this?",
          "What are you most worried this could be?",
          "What were you hoping I'd do for you today?",
        ],
      },
      {
        id: "ice_2",
        scenario: "A 29-year-old with palpitations after stress at work.",
        openingPrompt: "My heart keeps racing and I can't stop thinking something's wrong.",
        followUpPrompts: [
          "Do you think this is anxiety or something dangerous?",
          "I'm scared this could be my heart.",
          "I was hoping you'd do a test today.",
        ],
      },
      {
        id: "ice_3",
        scenario: "A 42-year-old with persistent fatigue and brain fog.",
        openingPrompt: "I'm exhausted all the time and it's affecting everything.",
        followUpPrompts: [
          "Could this be thyroid or cancer?",
          "I'm worried I'm missing something serious.",
          "I want to leave with a clear plan.",
        ],
      },
      {
        id: "ice_4",
        scenario: "A 51-year-old with episodic dizziness and normal previous tests.",
        openingPrompt: "The dizziness keeps coming back and no one has explained it properly.",
        followUpPrompts: [
          "What do you think this is?",
          "I'm worried I'll collapse at work.",
          "Can we do something concrete today?",
        ],
      },
      {
        id: "ice_5",
        scenario: "A parent presents with concern about teen mood change.",
        openingPrompt: "My son isn't himself and I'm really worried.",
        followUpPrompts: [
          "What do you think is going on?",
          "I'm scared he's depressed or using drugs.",
          "I want to know what we should do next.",
        ],
      },
    ],
  },
  {
    id: "focused_hypothesis_history",
    title: "Focused Hypothesis-Driven History",
    targetSkill: "Ask discriminating questions that narrow likely diagnoses quickly.",
    estimatedMinutes: "4-5",
    passCriteria: [
      "Uses focused, discriminating questions early",
      "Covers key positives and negatives efficiently",
      "Avoids exhaustive low-yield checklisting",
    ],
    variants: [
      {
        id: "fh_1",
        scenario: "A 57-year-old with intermittent chest discomfort and mild breathlessness.",
        openingPrompt: "I've had this pressure in my chest on and off this week.",
        followUpPrompts: [
          "What details are most important to ask first?",
          "How do your questions change your working diagnosis?",
          "What can wait until later?",
        ],
      },
      {
        id: "fh_2",
        scenario: "A 26-year-old with acute lower abdominal pain.",
        openingPrompt: "The pain started suddenly this morning and it's getting worse.",
        followUpPrompts: [
          "Which discriminating questions do you ask first?",
          "What urgent causes are you trying to exclude?",
          "Which details are lower priority initially?",
        ],
      },
      {
        id: "fh_3",
        scenario: "A 68-year-old with new unilateral calf swelling.",
        openingPrompt: "My left calf is swollen and sore since yesterday.",
        followUpPrompts: [
          "What high-yield risk questions come first?",
          "How do you assess DVT probability quickly?",
          "What can be deferred until after triage?",
        ],
      },
      {
        id: "fh_4",
        scenario: "A 40-year-old with persistent cough for 5 weeks.",
        openingPrompt: "This cough just won't go away.",
        followUpPrompts: [
          "Which questions narrow infective vs non-infective causes?",
          "What red flags do you screen first?",
          "Which broad questions are less useful now?",
        ],
      },
      {
        id: "fh_5",
        scenario: "A 73-year-old with recurrent falls and lightheadedness.",
        openingPrompt: "I've had two falls this month and I feel dizzy standing up.",
        followUpPrompts: [
          "What are your first discriminating questions?",
          "How do you separate cardiac, neuro, and medication causes?",
          "What information can wait until follow-up?",
        ],
      },
    ],
  },
  {
    id: "red_flag_triage",
    title: "Red-Flag Triage Language",
    targetSkill: "Recognise high-risk features and communicate immediate escalation safely.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Identifies and states red flags explicitly",
      "Gives clear immediate escalation plan",
      "Uses calm but urgent safety language",
    ],
    variants: [
      {
        id: "rt_1",
        scenario: "Severe headache with visual change and vomiting.",
        openingPrompt: "I thought it was migraine, but now my vision went blurry and I vomited.",
        followUpPrompts: [
          "Do I really need hospital right now?",
          "Can I just go home and rest first?",
          "What exactly are you worried about?",
        ],
      },
      {
        id: "rt_2",
        scenario: "Chest pain at rest with diaphoresis.",
        openingPrompt: "It's crushing in my chest and I'm sweating — but it might pass.",
        followUpPrompts: [
          "Can I drive myself home first?",
          "Do I have to call an ambulance?",
          "Why can't we just do tablets here?",
        ],
      },
      {
        id: "rt_3",
        scenario: "Possible cauda equina symptoms in back pain presentation.",
        openingPrompt: "My back is awful and now I've had numbness in the saddle area.",
        followUpPrompts: [
          "Is this really urgent?",
          "Can it wait until tomorrow morning?",
          "What are you worried I might lose function-wise?",
        ],
      },
      {
        id: "rt_4",
        scenario: "Fever, confusion and low blood pressure in older patient.",
        openingPrompt: "Mum is confused and shivering, and she looks much worse than yesterday.",
        followUpPrompts: [
          "Can't we monitor her at home?",
          "Do we need emergency transfer now?",
          "What signs suggest this is severe?",
        ],
      },
      {
        id: "rt_5",
        scenario: "Paediatric breathing difficulty with increased work of breathing.",
        openingPrompt: "My son is breathing fast and sucking in under the ribs.",
        followUpPrompts: [
          "Can we just use his inhaler and watch him?",
          "What makes this dangerous now?",
          "What should I do while waiting for help?",
        ],
      },
    ],
  },
  {
    id: "problem_representation",
    title: "Problem Representation",
    targetSkill: "Summarise the case in one high-quality diagnostic statement.",
    estimatedMinutes: "3-5",
    passCriteria: [
      "Produces a concise one-sentence synthesis",
      "Includes demographics, timeframe, key positives/negatives, and severity/risk signal",
      "Links representation logically to next diagnostic/management step",
    ],
    variants: [
      {
        id: "pr_1",
        scenario: "Mid-consultation synthesis request before selecting next steps.",
        openingPrompt: "Can you summarise your current problem representation in one sentence?",
        followUpPrompts: [
          "What key features make this case distinctive?",
          "What is your leading diagnosis and why?",
          "What uncertainty still remains in your representation?",
        ],
      },
      {
        id: "pr_2",
        scenario: "Undifferentiated febrile illness with hypotension in primary care.",
        openingPrompt: "Give me your one-line problem representation before management.",
        followUpPrompts: [
          "Which key positives/negatives are essential?",
          "What risk signal must be included?",
          "How does this representation guide your immediate plan?",
        ],
      },
      {
        id: "pr_3",
        scenario: "Progressive cognitive decline with functional change in older adult.",
        openingPrompt: "Summarise this case in one sentence as you would in the CCE.",
        followUpPrompts: [
          "What timeline details are critical?",
          "How do you include functional impact succinctly?",
          "What is still uncertain and why?",
        ],
      },
      {
        id: "pr_4",
        scenario: "Young adult with thyroid nodule and suspicious ultrasound findings.",
        openingPrompt: "Provide your one-sentence problem representation now.",
        followUpPrompts: [
          "What diagnostic qualifiers belong in the sentence?",
          "What cannot-miss possibility should be signposted?",
          "What immediate next step follows from your representation?",
        ],
      },
      {
        id: "pr_5",
        scenario: "Child with polyuria, weight loss and abdominal pain in rural setting.",
        openingPrompt: "Before treatment, summarise the problem representation in one line.",
        followUpPrompts: [
          "What red-flag elements must appear?",
          "How do you show likely diagnosis and severity together?",
          "How does that summary drive urgent action?",
        ],
      },
    ],
  },
  {
    id: "differential_ranking",
    title: "Differential Diagnosis Ranking",
    targetSkill: "State most likely, alternatives, and cannot-miss diagnoses clearly.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Ranks differential by probability and risk",
      "Explicitly identifies cannot-miss diagnosis",
      "Connects ranking to safe next steps",
    ],
    variants: [
      {
        id: "dd_1",
        scenario: "Acute unilateral leg swelling after travel.",
        openingPrompt: "What are you thinking this could be, in order?",
        followUpPrompts: [
          "What's your most likely diagnosis and why?",
          "What are your cannot-miss alternatives?",
          "How does your ranking guide immediate action?",
        ],
      },
      {
        id: "dd_2",
        scenario: "Acute chest pain with normal initial observations.",
        openingPrompt: "Give me your ranked differential from most likely to cannot-miss.",
        followUpPrompts: [
          "Which diagnosis is most likely right now?",
          "Which diagnosis is highest risk if missed?",
          "How does this ranking change urgency?",
        ],
      },
      {
        id: "dd_3",
        scenario: "Postpartum behavioural change and reduced sleep.",
        openingPrompt: "How would you rank your differential diagnoses here?",
        followUpPrompts: [
          "What is the leading diagnosis and reasoning?",
          "What severe alternatives must be considered?",
          "What immediate safeguarding steps follow?",
        ],
      },
      {
        id: "dd_4",
        scenario: "Episodic palpitations, weight loss and tremor.",
        openingPrompt: "State your ranked differential clearly.",
        followUpPrompts: [
          "What diagnosis best fits currently?",
          "What less-likely but serious alternatives exist?",
          "How does your ranking guide first investigations?",
        ],
      },
      {
        id: "dd_5",
        scenario: "Older patient with recurrent presyncope and falls.",
        openingPrompt: "Please rank your differential, including cannot-miss causes.",
        followUpPrompts: [
          "What is your most likely diagnosis?",
          "Which high-risk alternatives remain?",
          "How does ranking direct your management priority?",
        ],
      },
    ],
  },
  {
    id: "investigation_justification",
    title: "Investigation Justification and Sequencing",
    targetSkill: "Choose and justify first-line tests without over-investigating.",
    estimatedMinutes: "3-5",
    passCriteria: [
      "Selects evidence-based first-line investigations",
      "Explains test rationale in patient-friendly terms",
      "Avoids shotgun testing while preserving safety",
    ],
    variants: [
      {
        id: "ij_1",
        scenario: "Fatigue and weight gain with request for every possible test.",
        openingPrompt: "Can we just do all the tests to be safe?",
        followUpPrompts: [
          "Which tests are first-line and why?",
          "What tests are low-yield right now?",
          "How will results change management?",
        ],
      },
      {
        id: "ij_2",
        scenario: "Intermittent abdominal pain with no red flags on initial review.",
        openingPrompt: "I want a CT, MRI and full bloods today.",
        followUpPrompts: [
          "What is your first investigation set?",
          "What can safely wait and why?",
          "How will you review if symptoms persist?",
        ],
      },
      {
        id: "ij_3",
        scenario: "Thyroid nodule workup discussion.",
        openingPrompt: "Should we just do every thyroid test and a full body scan now?",
        followUpPrompts: [
          "What sequence of tests is evidence-based?",
          "Which test is not first-line and why?",
          "How do results determine referral urgency?",
        ],
      },
      {
        id: "ij_4",
        scenario: "New-onset dizziness in older patient with polypharmacy.",
        openingPrompt: "Can we order every heart and brain test immediately?",
        followUpPrompts: [
          "What first-line tests have highest yield?",
          "Which tests are low priority initially?",
          "How do findings change next actions?",
        ],
      },
      {
        id: "ij_5",
        scenario: "Abnormal LFT review in asymptomatic patient.",
        openingPrompt: "Let's just do every liver test and scan straight away.",
        followUpPrompts: [
          "Which investigations do you order first?",
          "How do you justify not over-testing now?",
          "What follow-up investigations depend on initial results?",
        ],
      },
    ],
  },
  {
    id: "shared_decision_disagreement",
    title: "Shared Decision-Making Under Disagreement",
    targetSkill: "Negotiate a safe plan when patient preference conflicts with clinician recommendation.",
    estimatedMinutes: "4-5",
    passCriteria: [
      "Explores values and concerns before persuading",
      "Uses collaborative language and options framing",
      "Agrees a documented, safe compromise with review",
    ],
    variants: [
      {
        id: "sd_1",
        scenario: "Patient declines medication intensification for uncontrolled diabetes.",
        openingPrompt: "I don't want another medicine. I just want to try on my own for now.",
        followUpPrompts: [
          "How do you respond without confrontation?",
          "How do you preserve autonomy and safety?",
          "What compromise plan could you offer?",
        ],
      },
      {
        id: "sd_2",
        scenario: "Patient refuses hospital transfer despite high-risk presentation.",
        openingPrompt: "I'm not going to hospital. I'll be fine at home.",
        followUpPrompts: [
          "How do you explore refusal reasons?",
          "How do you explain risk clearly and respectfully?",
          "What documented compromise is acceptable if refusal persists?",
        ],
      },
      {
        id: "sd_3",
        scenario: "Parent hesitant about child immunisation catch-up.",
        openingPrompt: "I'm not comfortable with those vaccines right now.",
        followUpPrompts: [
          "How do you keep the conversation collaborative?",
          "How do you address concerns without dismissing them?",
          "What partial-plan option could you negotiate?",
        ],
      },
      {
        id: "sd_4",
        scenario: "Patient wants long-term benzodiazepine continuation against advice.",
        openingPrompt: "These tablets are the only thing that works. I want the repeat.",
        followUpPrompts: [
          "How do you align safety with patient priorities?",
          "What options can replace abrupt refusal?",
          "How do you agree a stepped plan and follow-up?",
        ],
      },
      {
        id: "sd_5",
        scenario: "Patient declines statin despite very high cardiovascular risk.",
        openingPrompt: "I don't trust statins and I don't want to start one.",
        followUpPrompts: [
          "How do you communicate risk without pressure?",
          "How do you use shared decision language here?",
          "What interim safety plan do you agree?",
        ],
      },
    ],
  },
  {
    id: "risk_communication_plain_language",
    title: "Risk Communication in Plain Language",
    targetSkill: "Explain risk and uncertainty clearly without jargon or false reassurance.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Converts technical risk into understandable language",
      "Avoids absolutist statements and false reassurance",
      "Pairs risk explanation with clear next-step plan",
    ],
    variants: [
      {
        id: "rc_1",
        scenario: "Thyroid nodule with suspicious result discussion.",
        openingPrompt: "So does this mean I definitely have cancer?",
        followUpPrompts: [
          "How likely is it really?",
          "How should I think about this risk?",
          "What happens next and when?",
        ],
      },
      {
        id: "rc_2",
        scenario: "Borderline troponin result with persistent symptoms.",
        openingPrompt: "If the test isn't clearly positive, am I safe?",
        followUpPrompts: [
          "Can you explain the risk in plain words?",
          "What uncertainty remains right now?",
          "What do we do next to stay safe?",
        ],
      },
      {
        id: "rc_3",
        scenario: "Incidental pulmonary nodule found on imaging.",
        openingPrompt: "They said nodule — does that mean lung cancer?",
        followUpPrompts: [
          "How worried should I be today?",
          "What does this risk actually mean for me?",
          "What follow-up timing is needed?",
        ],
      },
      {
        id: "rc_4",
        scenario: "Pre-diabetes discussion with family history.",
        openingPrompt: "Am I definitely going to get diabetes then?",
        followUpPrompts: [
          "How do you explain my risk clearly?",
          "What can I do now to lower it?",
          "When should we recheck?",
        ],
      },
      {
        id: "rc_5",
        scenario: "Mildly elevated PSA requiring repeat/assessment.",
        openingPrompt: "Is this already prostate cancer?",
        followUpPrompts: [
          "How do we interpret this safely?",
          "What risk should I understand now?",
          "What exact next steps should I expect?",
        ],
      },
    ],
  },
  {
    id: "chunk_and_check",
    title: "Chunk and Check",
    targetSkill: "Explain investigations in clear chunks and verify understanding.",
    estimatedMinutes: "3-5",
    passCriteria: [
      "Uses plain language and avoids jargon",
      "Delivers information in short chunks",
      "Checks understanding at least once",
    ],
    variants: [
      {
        id: "cc_1",
        scenario: "New type 2 diabetes diagnosis with information overload.",
        openingPrompt: "Can you explain what these blood results mean? I'm a bit lost.",
        followUpPrompts: [
          "What does HbA1c actually tell us?",
          "How serious is this right now?",
          "Can you check if I've understood this properly?",
        ],
      },
      {
        id: "cc_2",
        scenario: "New atrial fibrillation diagnosis and anticoagulation discussion.",
        openingPrompt: "I don't understand why I need a blood thinner.",
        followUpPrompts: [
          "Can you break this down for me?",
          "What's the key benefit vs risk?",
          "Can you check if I've got it right?",
        ],
      },
      {
        id: "cc_3",
        scenario: "Chronic kidney disease stage explanation at follow-up.",
        openingPrompt: "They said my kidneys are reduced — what does that actually mean?",
        followUpPrompts: [
          "Can you explain this in simple steps?",
          "What matters most right now?",
          "Can you ask me to repeat the plan back?",
        ],
      },
      {
        id: "cc_4",
        scenario: "Asthma action plan education after recent exacerbation.",
        openingPrompt: "I get confused by all the inhaler steps.",
        followUpPrompts: [
          "Can you explain it in bite-size parts?",
          "What are the most important points first?",
          "Can you check I understood correctly?",
        ],
      },
      {
        id: "cc_5",
        scenario: "New hypertension management explanation with multiple options.",
        openingPrompt: "There was a lot in that consult — can you simplify it?",
        followUpPrompts: [
          "Can you chunk the plan for me?",
          "What should I focus on this week?",
          "Can you check my understanding before I go?",
        ],
      },
    ],
  },
  {
    id: "safety_netting",
    title: "Safety-Netting",
    targetSkill: "Give explicit and actionable deterioration advice.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "States clear red flags",
      "Gives practical action steps for each escalation level",
      "Includes a clear follow-up timeframe",
    ],
    variants: [
      {
        id: "sn_1",
        scenario: "Likely viral URTI managed conservatively.",
        openingPrompt: "So I can go home then? What should I look out for?",
        followUpPrompts: [
          "When should I come back to you?",
          "When should I go straight to emergency?",
          "Can you say exactly what I should do if I get worse overnight?",
        ],
      },
      {
        id: "sn_2",
        scenario: "Mild gastroenteritis with dehydration risk.",
        openingPrompt: "If this gets worse tonight, what should I do?",
        followUpPrompts: [
          "What signs mean I need urgent help?",
          "When do I call ambulance vs book GP?",
          "How soon should I review if not improving?",
        ],
      },
      {
        id: "sn_3",
        scenario: "New low back pain without current neurological deficit.",
        openingPrompt: "What warning signs should make me seek help fast?",
        followUpPrompts: [
          "Which symptoms are emergency red flags?",
          "What can wait for routine follow-up?",
          "When should I book review if pain persists?",
        ],
      },
      {
        id: "sn_4",
        scenario: "Community-treated cellulitis with oral antibiotics.",
        openingPrompt: "How will I know if the antibiotics aren't enough?",
        followUpPrompts: [
          "What progression signs are urgent?",
          "What exact step should I take if they happen?",
          "When should I come back regardless?",
        ],
      },
      {
        id: "sn_5",
        scenario: "Likely BPPV with conservative management advice.",
        openingPrompt: "If dizziness changes, when is it dangerous?",
        followUpPrompts: [
          "What neurological red flags matter?",
          "When should I seek immediate care?",
          "What timeframe for routine review?",
        ],
      },
    ],
  },
  {
    id: "uncertainty_language",
    title: "Uncertainty Language",
    targetSkill: "Communicate diagnostic uncertainty without false reassurance.",
    estimatedMinutes: "3-5",
    passCriteria: [
      "Acknowledges uncertainty transparently",
      "Balances reassurance with safety",
      "Provides a clear monitoring and review plan",
    ],
    variants: [
      {
        id: "ul_1",
        scenario: "Non-specific abdominal pain without immediate red flags.",
        openingPrompt: "Are you sure this isn't something serious?",
        followUpPrompts: [
          "So you don't know what it is yet?",
          "Why aren't we doing a scan today?",
          "How can I feel safe going home if you're not certain?",
        ],
      },
      {
        id: "ul_2",
        scenario: "Persistent fatigue with normal initial investigations.",
        openingPrompt: "If my tests are normal, why do I still feel awful?",
        followUpPrompts: [
          "Are you saying it's all in my head?",
          "What uncertainty remains?",
          "What is our next-step plan?",
        ],
      },
      {
        id: "ul_3",
        scenario: "Intermittent chest discomfort with low immediate-risk profile.",
        openingPrompt: "So you're not certain it's my heart?",
        followUpPrompts: [
          "How can both things be true — low risk but still not certain?",
          "Why not send me for everything right now?",
          "How do I stay safe in the meantime?",
        ],
      },
      {
        id: "ul_4",
        scenario: "Recurrent dizziness with broad differential but no acute signs.",
        openingPrompt: "What if this is something serious you're missing?",
        followUpPrompts: [
          "How do you handle uncertainty safely?",
          "What symptoms should change our plan?",
          "When do we reassess if not improving?",
        ],
      },
      {
        id: "ul_5",
        scenario: "Subacute cough with normal exam and stable vitals.",
        openingPrompt: "If it's probably viral, why aren't you 100% sure?",
        followUpPrompts: [
          "What uncertainty is acceptable here?",
          "What would make you escalate investigation?",
          "What review plan should I follow?",
        ],
      },
    ],
  },
  {
    id: "closing_summary",
    title: "Consultation Closing Summary",
    targetSkill: "Close with shared plan, checks, and contingency advice.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Summarises agreed plan succinctly",
      "Checks patient agreement/understanding",
      "Includes follow-up timing and contingencies",
    ],
    variants: [
      {
        id: "cs_1",
        scenario: "Closing a newly diagnosed hypertension consultation.",
        openingPrompt: "Before I go, can you quickly recap what we're doing from here?",
        followUpPrompts: [
          "What do I need to do this week?",
          "How will we know if this is working?",
          "When should I book in next?",
        ],
      },
      {
        id: "cs_2",
        scenario: "Closing a diabetes review with medication adjustment.",
        openingPrompt: "Can you summarise the plan so I don't miss anything?",
        followUpPrompts: [
          "What's the most important first step?",
          "When are repeat tests due?",
          "What symptoms should prompt earlier review?",
        ],
      },
      {
        id: "cs_3",
        scenario: "Closing a mental health follow-up after discussing options.",
        openingPrompt: "Can we just go over the plan one more time?",
        followUpPrompts: [
          "What am I doing between now and next review?",
          "Who do I contact if I deteriorate?",
          "When exactly should I come back?",
        ],
      },
      {
        id: "cs_4",
        scenario: "Closing a musculoskeletal pain consultation with conservative plan.",
        openingPrompt: "Just to be clear, what's our plan from today?",
        followUpPrompts: [
          "What treatments do I start first?",
          "How long before we reassess?",
          "What red flags mean urgent reassessment?",
        ],
      },
      {
        id: "cs_5",
        scenario: "Closing a preventive health consult with multiple actions.",
        openingPrompt: "Can you give me a clear step-by-step summary before I leave?",
        followUpPrompts: [
          "What do I do this week?",
          "What can wait until next visit?",
          "When is the follow-up booked for?",
        ],
      },
    ],
  },
  {
    id: "opportunistic_prevention",
    title: "Opportunistic Prevention",
    targetSkill: "Add one relevant prevention action without derailing the primary agenda.",
    estimatedMinutes: "3-4",
    passCriteria: [
      "Identifies one high-yield preventive opportunity",
      "Raises it briefly and respectfully in context",
      "Creates a practical follow-up action",
    ],
    variants: [
      {
        id: "op_1",
        scenario: "49-year-old smoker requesting repeat script in a hurry.",
        openingPrompt: "Can I just grab the repeat and go? I'm in a rush.",
        followUpPrompts: [
          "What prevention topic would you raise now?",
          "How do you keep it brief and relevant?",
          "How do you arrange follow-up without overload?",
        ],
      },
      {
        id: "op_2",
        scenario: "Middle-aged patient with obesity presents for minor issue.",
        openingPrompt: "Can we keep this quick? I just need this sorted.",
        followUpPrompts: [
          "What preventive opportunity is most relevant?",
          "How do you raise it without derailing agenda?",
          "What simple follow-up step do you offer?",
        ],
      },
      {
        id: "op_3",
        scenario: "Patient with asthma script refill overdue for flu vaccination.",
        openingPrompt: "Just the repeat inhaler today please.",
        followUpPrompts: [
          "What prevention item should be added briefly?",
          "How do you frame it as relevant today?",
          "How do you avoid overload while still acting?",
        ],
      },
      {
        id: "op_4",
        scenario: "Patient with family history of colorectal cancer attends for URI.",
        openingPrompt: "I only came for this cough, nothing else today.",
        followUpPrompts: [
          "What prevention topic is high-yield now?",
          "How can you introduce it respectfully?",
          "What practical next action should be agreed?",
        ],
      },
      {
        id: "op_5",
        scenario: "Diabetes patient attending for admin request, overdue preventive checks.",
        openingPrompt: "Can I just get this form done today?",
        followUpPrompts: [
          "Which preventive check is most worth raising now?",
          "How do you keep it brief and patient-centred?",
          "What follow-up arrangement locks in action?",
        ],
      },
    ],
  },
];

export function getDrillById(id: string): DrillDefinition | undefined {
  return DRILLS.find((d) => d.id === id);
}
