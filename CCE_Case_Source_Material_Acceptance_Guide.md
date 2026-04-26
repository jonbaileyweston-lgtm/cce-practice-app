# CCE Case Source Material — Acceptance Guide

A reference for what to feed the case generator prompt so it produces a high-quality, drop-in CCE case every time.

## TL;DR

The richer the source, the closer the output is to a real RACGP exam case. Two tiers work:

- **Tier 1 (gold):** RACGP-authored exam material — produces near-verbatim cases with examiner-grade rubrics.
- **Tier 2 (acceptable):** Clinical scenarios from textbooks or your own notes — produces solid cases, with the prompt generating the assessment scaffolding around your clinical facts.

Anything below Tier 2 will produce a generic-feeling case. Don't bother.

---

## Tier 1: RACGP-authored material (best results)

### What it looks like

The McDONALD and MATOLI PDFs are the template. Look for documents that contain most or all of:

- A candidate information section with scenario brief, observations, and explicit tasks (e.g. "Take an appropriate history. Explain your management plan to the patient.")
- A patient record summary (allergies, medications, past history, social history, family history, smoking, alcohol, immunisations)
- Investigation results with reference ranges
- A role-player script with:
  - An exact opening line
  - General information (given freely)
  - Specific information chunks (given only when asked)
  - Patient questions to ask the candidate
- A "competent candidate" section with behavioural expectations
- A marking rubric with RACGP competency codes (1.1, 2.1, 4.7, 10.1, etc.)
- The 4-level Likert structure (`not demonstrated` → `fully demonstrated`)
- Optionally: examiner information, debrief notes, references

### Where to find it

- RACGP Practice Cases (the MATOLI / Hangwood / Brown / Calabrese set on the RACGP site)
- RACGP CCE Public Exam Reports — these contain ~9 case archetypes per report with examiner-written behaviours and pitfalls
- Past exam materials shared in registrar study groups (where permitted)
- GPTA / regional training organisation practice cases
- RACGP supervisor portal practice material

### What to attach

All available PDFs for the case. If a case has separate candidate / role-player / examiner / debrief PDFs (like MATOLI), attach **all of them in a single prompt**. Don't summarise — let the model read the originals.

### What to expect from the output

- Behavioural anchors lifted verbatim from the "competent candidate" section
- RACGP competency codes preserved exactly
- Patient script preserved exactly (opening line, information chunks, patient questions)
- Likert descriptors anchored in the source
- Minimal generation — mostly extraction and structural reformatting

This is the workflow you should default to when building out the case library.

---

## Tier 2: Clinical scenarios (acceptable)

### What it looks like

A clinical case description with enough detail to feel like a real consultation. Examples:

- A Murtagh's General Practice case
- A Therapeutic Guidelines case vignette
- A clinical scenario from AFP / AJGP
- A case you've written up from a real consultation (de-identified)
- A teaching case from your registrar training programme

### Minimum acceptable content

The source must contain at least:

- Patient demographics (age, gender)
- Presenting complaint
- Relevant past medical history and medications
- Either a working diagnosis OR enough clinical detail for the model to identify the differential
- Some indication of the consultation task (history, examination, management, breaking bad news, etc.)

If you want investigation results in the case, **include them in the source**. The model will not invent realistic Australian pathology reference ranges or fabricate plausible results — and you don't want it to.

### What to expect from the output

- Clinical facts preserved exactly from source
- Rubric criteria, behavioural anchors, ICE, withheldHistory, Likert descriptors, common pitfalls — **all generated** by the model using RACGP standards
- Patient persona and role-player script — generated, anchored to the clinical context
- Quality is good but won't have the verbatim authority of Tier 1

### When to use Tier 2

- Filling gaps in your case library where no Tier 1 material exists for the archetype (e.g. specific paediatric presentations, niche rural scenarios)
- Building a high-volume practice library quickly
- Practising specific clinical conditions you're weak on

---

## What does NOT work

Avoid feeding the prompt:

- **Bullet-point summaries** of cases ("38yo male, depression, alcohol use, suicidal ideation"). Too thin — output will be generic.
- **Lecture slides or PowerPoints** of clinical conditions. These describe the disease, not a consultation.
- **Wikipedia articles** or general medical references.
- **Your own one-line case ideas** ("I want a case about a 62yo with new AF"). Write at least a paragraph of clinical detail first, or find a Tier 1/2 source.
- **Multiple unrelated cases in one prompt.** One case per generation. Always.
- **Non-Australian source material** without flagging it. UK MRCGP cases and US Step cases use different drug names, guidelines, and consultation patterns. The model will normalise to Australian practice but you may lose nuance. If you do use international material, add a note in your prompt context: "Convert all guidelines, drug names, and referral pathways to Australian primary care."

---

## Pre-flight checklist

Before pasting the generator prompt, ask yourself:

- [ ] Is this a single case? (not multiple stitched together)
- [ ] Are the demographics, PMH, medications, and observations explicit in the source?
- [ ] Is the consultation task clear, or can I add it to the source?
- [ ] If the case requires investigation results, are they in the source with reference ranges?
- [ ] Is the source Australian, or do I need to flag it for normalisation?
- [ ] If Tier 1, did I attach all available companion PDFs (candidate + role-player + examiner + debrief)?

If yes to all that apply: paste the prompt, attach the source, generate.

---

## Quick decision tree

```
Do you have an RACGP-authored exam case?
├── Yes → Tier 1 → Attach all PDFs → Expect verbatim extraction
└── No
    │
    Do you have a clinical scenario with full demographics, PMH, meds, and clinical detail?
    ├── Yes → Tier 2 → Attach source → Expect generated rubric anchored to source
    └── No → Don't generate yet. Find a better source or write more detail first.
```

---

## A note on case archetype coverage

The RACGP CCE samples a known set of archetypes. When building your library, aim for breadth across:

- Acute undifferentiated illness (chest pain, breathlessness, abdominal pain, headache)
- Mental health (depression, anxiety, suicidal ideation, psychosis, grief)
- Chronic disease management (T2DM, hypertension, COPD, CKD)
- Older patients (cognitive decline, falls, polypharmacy, end-of-life)
- Paediatrics (fever, rash, developmental, behavioural)
- Women's health (contraception, menstrual, pregnancy, menopause)
- Men's health (sexual health, prostate, mental health presentation)
- Aboriginal and Torres Strait Islander health (health checks, chronic disease in cultural context)
- Preventive care (cardiovascular risk, cancer screening, immunisation)
- Difficult conversations (breaking bad news, mandatory reporting, capacity, AHPRA, family violence)
- Multimorbidity and complexity
- EBM / evidence interpretation
- Practice management / professionalism (incidents, ethics, colleague concerns)

If you find yourself generating five depression cases and zero paediatric cases, the library is skewed and your practice will be too. The RACGP Public Exam Reports are the best map of what archetypes have been examined recently — use them as a coverage checklist.