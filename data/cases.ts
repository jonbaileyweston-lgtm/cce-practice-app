import type { Case } from "@/types";

export const CASES: Case[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // HUNT — Angela, 59F, Thyrotoxicosis / Thyroid Storm
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "hunt",
    patientName: "Angela HUNT",
    patientAge: 59,
    patientGender: "F",
    presentingComplaint: "Racing heart, sweating, weight loss, neck swelling",
    topics: ["Thyrotoxicosis", "Thyroid Storm", "Urgent Management", "Endocrinology"],
    icpcCode: "T – Endocrine",
    year: "2021 (reviewed 2026)",
    scenario: `Angela HUNT, 59 years, presents with a racing heart.

For the past two days, Angela has felt her heart beating faster than usual. She took her pulse two days ago and it was 102 beats per minute. Yesterday, her pulse was 110 beats per minute.

Angela did not sleep well last night because she felt sweaty and jittery. This morning her pulse was more than 140 beats per minute. She also feels short of breath, and she has a squeezing feeling in the middle of her chest. She feels lightheaded, as if she might faint.

Angela has been feeling unwell over the last two weeks. Initially she thought she might have had COVID-19 as she had a fever, night sweats, a sore throat and sore muscles, especially her thighs. She decided to self-isolate for 14 days to ensure she was not going to make the nursing home residents ill. Over that time, the fevers and sweats persisted overnight and during the day. She also developed diarrhoea and sore, gritty eyes.

Angela has noticed weight loss over the last three months. She is not sure exactly how much, but it might be nearly 10 kg. She has also felt more stressed and anxious over the last few months.

On examination, Angela is flushed and sweating and appears anxious.
• Temperature 37.8°C
• Blood pressure (sitting) 100/55 mmHg
• Heart rate 145/min regular
• Respiratory rate 16/min

She has a noticeable swelling of her anterior lower neck and a tremor.
Angela's heart sounds are dual with nil added sounds. Fine bibasal crackles are audible on chest auscultation. Angela's pupils are equal and reactive to light, and her external ocular movements are normal with no diplopia.`,
    patientRecord: {
      name: "Angela HUNT",
      age: 59,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Nil"],
      pastHistory: ["Eczema – mild, intermittent (since childhood)", "G2P2"],
      socialHistory: {
        "Relationship": "Married, lives with husband Peter",
        "Children": "Son (age 24 years) and daughter (age 18 years) – daughter lives at home",
        "Occupation": "Registered nurse (part-time, Aged Care)",
      },
      familyHistory: ["Mother: Coeliac disease"],
      smoking: "Non-smoker",
      alcohol: "2 standard drinks per week",
      immunisations: [
        "1 year ago: Cervical screening test – normal",
        "1 year ago: Mammogram – normal; Influenza vaccine",
        "5 years ago: Diphtheria–tetanus–acellular pertussis vaccine",
      ],
    },
    questions: [
      {
        number: 1,
        text: "List your differential diagnosis and provisional diagnosis for Angela.",
        timingMinutes: 3,
        prompts: [
          { type: "probe", text: "You mentioned [diagnosis] – can you tell me your rationale?" },
          { type: "prompt", text: "Of the options you have mentioned, which is your provisional diagnosis?" },
        ],
      },
      {
        number: 2,
        text: "Discuss your immediate management steps for this patient.",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What would you do to stabilise Angela?" },
          { type: "prompt", text: "How will you manage her palpitations?" },
          { type: "prompt", text: "Are there any office tests or investigations you will organise?" },
          { type: "prompt", text: "What pharmacological management will you consider?" },
        ],
      },
      {
        number: 3,
        text: "How would you explain the likely diagnosis and management to Angela?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What information is important to communicate to the patient now?" },
          { type: "prompt", text: "How would you explain the steps in management to the patient?" },
          { type: "probe", text: "You mentioned sending Angela to hospital – what would you expect to be done in hospital?" },
        ],
      },
      {
        number: 4,
        text: "Angela comes to see you one month post-discharge from hospital. She has been commenced on propylthiouracil 150 mg twice daily. She is finding it difficult to remember to take her medications due to the shift work at the nursing home. Discuss with Angela her options.",
        timingMinutes: 4,
        prompts: [
          { type: "probe", text: "You mentioned [management option] – can you outline the risks and benefits?" },
          { type: "prompt", text: "Are there any alternative management options you will offer?" },
          { type: "prompt", text: "What further prevention and follow-up will you consider?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.3",
        title: "Matches modality of communication to patient needs, health literacy and context",
        questions: [3],
        points: [
          "Considers the patient context and health literacy (nurse who has been unwell for several weeks and now critically ill) – appropriately communicates the management steps including: the provisional diagnosis, the urgent nature of care required, the immediate management steps in the practice, an outline of management in the hospital setting.",
          "Explains the steps in management to the patient clearly and calmly.",
          "Reviews patient understanding using methods such as summarisation and teach-back method to confirm understanding.",
          "Provides written and verbal instructions for medication adherence, considering shift work challenges.",
        ],
      },
      {
        code: "1.8",
        title: "Adapts the consultation to facilitate optimal patient care",
        questions: [2, 3, 4],
        points: [
          "Adjusts explanation style to suit patient's emotional state (anxious, unwell).",
          "Maintains rapport while prioritising urgent care.",
          "Incorporates patient's context (aged care nurse, family responsibilities) into management discussion.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [2, 3],
        points: [
          "Recognises this patient as being very ill, requiring urgent care and referral to hospital and specialist for definitive management.",
          "Provides an appropriate provisional diagnosis of severe hyperthyroidism / thyroid storm.",
          "Balances urgent management with discussion of long-term treatment options.",
          "Documents priorities clearly in the clinical record.",
        ],
      },
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [3, 4],
        points: [
          "Advises on signs of deterioration and when to seek urgent care.",
          "Provides clear instructions for hospital follow-up and specialist review.",
          "Plans for medication review and adherence support post-discharge.",
          "Considers longer term follow-up and explains the need for review to the patient.",
          "Considers uploading medical records to digital health record (My Health Record) with patient consent.",
        ],
      },
      {
        code: "2.6",
        title: "Rational options for investigations are chosen using an evidence-based approach",
        questions: [1, 2],
        points: [
          "Recommends appropriate office-based tests: ECG to monitor for arrhythmia.",
          "Orders thyroid function tests (T3, T4, TSH) urgently to confirm diagnosis.",
          "Considers chest X-ray if pulmonary signs persist.",
          "If aetiology of thyrotoxicosis not evident, considers radionuclide thyroid scan.",
        ],
      },
      {
        code: "3.1",
        title: "Integrates and synthesises knowledge to make decisions in complex clinical situations",
        questions: [1, 2],
        points: [
          "Recognises constellation of symptoms as severe hyperthyroidism/thyroid storm.",
          "Integrates history, examination and risk factors to guide urgent management.",
          "Considers possible reasons for a hyperthyroid state – toxic nodule, Grave's disease, thyroiditis or toxic multinodular goitre.",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses, including most likely, less likely, unlikely and cannot miss diagnoses",
        questions: [1],
        points: [
          "Most likely diagnosis: severe hyperthyroidism / thyroid storm.",
          "Underlying causes: Grave's disease, toxic multinodular goitre, subacute thyroiditis.",
          "Less likely: infective (sepsis, endocarditis, myocarditis), cardiac dysrhythmias, endocrine tumours (phaeochromocytoma, carcinoid, thyroid, pancreatic NET).",
          "Unlikely: psychosis or anxiety disorder, drug-induced states (stimulants, caffeine, OTC or recreational).",
          "Cannot miss: pulmonary embolism.",
        ],
      },
      {
        code: "3.7",
        title: "Directs evaluation and treatment towards high-priority diagnoses",
        questions: [2],
        points: [
          "Initiates stabilisation measures immediately for thyroid storm.",
          "Prioritises beta-blockade and antithyroid therapy over less urgent interventions.",
          "Plans hospital transfer promptly.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected based on the patient's needs and the problem list identified",
        questions: [2, 4],
        points: [
          "Explains rationale for beta-blockers and antithyroid drugs.",
          "Discusses hospital-based interventions for stabilisation.",
          "Justifies choice of propylthiouracil over carbimazole in thyroid storm.",
          "Provides appropriate pharmacological therapy available in a GP setting: paracetamol, propranolol, propylthiouracil, prednisolone/dexamethasone.",
          "Considers drug interactions and contraindications such as asthma for beta-blockers.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [4],
        points: [
          "Outlines possible treatment options including pros and cons of each.",
          "Radioactive iodine: onset 4–8 weeks; advantages – outpatient tablet; disadvantages – radiation safety precautions, permanent hypothyroidism.",
          "Total thyroidectomy: immediate onset; advantages – rapid and effective; disadvantages – surgical complications, permanent hypothyroidism.",
        ],
      },
      {
        code: "4.8",
        title: "Provides effective explanations, education and choices to the patient",
        questions: [3, 4],
        points: [
          "Offers explanation of differential diagnoses to the patient, explaining mechanism of thyrotoxicosis and urgency of management.",
          "Identifies a clear management plan incorporating patient's unique circumstances (shift work, medication compliance).",
          "Suggests adherence aids (pill organisers, digital reminders).",
          "Offers written resources and patient information sheets.",
          "Educates about longer term comorbidities/risks – considers bone mineral density testing, cardiovascular risk assessment when stable.",
        ],
      },
      {
        code: "9.2",
        title: "Addresses problems that present early and/or in an undifferentiated way by integrating all available information to generate differential diagnoses",
        questions: [1],
        points: [
          "Recognises that the patient has an undifferentiated presentation.",
          "Discusses key and differentiating features of symptoms and uses this to sort them into likely diagnoses.",
          "Recognises evolving symptoms over two weeks as significant.",
          "Considers multiple organ systems in differential – demonstrates the use of a safe diagnostic strategy.",
        ],
      },
      {
        code: "10.1",
        title: "A patient with significant illness is identified",
        questions: [1, 2],
        points: [
          "Recognises thyroid storm as a life-threatening condition.",
          "Identifies clinical signs of severe illness (tachycardia, hypotension, diaphoresis).",
          "Acts promptly to escalate care.",
          "Considers placing patient under close monitoring by nursing staff whilst awaiting hospital transfer.",
          "Initiates urgent management without delay.",
          "Seeks specialist input appropriately.",
          "Communicates decisions clearly to patient and team.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.3", description: "Matches modality of communication to patient needs, health literacy and context", questions: [3] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.8", description: "Adapts the consultation to facilitate optimal patient care", questions: [2, 3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.10", description: "Prioritises problems, attending to both the patient's and the doctor's agendas", questions: [2, 3] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.11", description: "Safety-netting and specific follow-up arrangements are made", questions: [3, 4] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.6", description: "Rational options for investigations are chosen using an evidence-based approach", questions: [1, 2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.1", description: "Integrates and synthesises knowledge to make decisions in complex clinical situations", questions: [1, 2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses, including most likely, less likely, unlikely and cannot miss diagnoses", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.7", description: "Directs evaluation and treatment towards high-priority diagnoses", questions: [2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected based on the patient's needs and the problem list identified", questions: [2, 4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.8", description: "Provides effective explanations, education and choices to the patient", questions: [3, 4] },
      { domain: "Managing uncertainty", domainNumber: 9, code: "9.2", description: "Addresses problems that present early and/or in an undifferentiated way by integrating all available information to generate differential diagnoses", questions: [1] },
      { domain: "Identifying and managing the patient with significant illness", domainNumber: 10, code: "10.1", description: "A patient with significant illness is identified", questions: [1, 2] },
    ],
    debriefNotes: `The competent candidate accounts for each symptom in the scenario and synthesises knowledge to decide on an appropriate provisional diagnosis (severe hyperthyroidism/thyroid storm). They justify their reasoning with evidence from the stem, discuss key and differentiating features, and rank the differentials. They recommend an urgent ECG, thyroid function tests (TSH receptor antibodies for Grave's disease), and outline emergency management including ambulance transfer, IV access, paracetamol, propranolol, propylthiouracil and steroids. When explaining to the patient, they are clear, calm and use teach-back. For follow-up, they discuss all three definitive options (antithyroid drugs, radioactive iodine, thyroidectomy) with pros and cons, and address the shift work compliance challenge with practical aids.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // JONES — Susan, 68F, Cutaneous Squamous Cell Carcinoma
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "jones",
    patientName: "Susan JONES",
    patientAge: 68,
    patientGender: "F",
    presentingComplaint: "Tender growing lump on left leg",
    topics: ["Skin Cancer", "Squamous Cell Carcinoma", "Preventive Health", "Recall Systems"],
    icpcCode: "S – Skin",
    year: "2022",
    scenario: `Susan JONES, aged 68 years, presents with a tender lump on her left leg. Susan first noted the lesion four weeks ago, after a long weekend of gardening. She wonders if it started as a bite, as it was sore when she first noticed it. She has been applying some topical antiseptic cream twice a day to the area for the past week after first trying some calamine lotion.

Despite the application of the cream, the lesion has continued to increase in size and is a bit tender to touch.

She has no other lesions of concern on either leg.

Examination findings: The lesion is approximately 14 mm in diameter, erythematous papule/nodule on the lower left leg with keratinisation. No regional lymphadenopathy detected. Full body skin examination reveals no other suspicious lesions.`,
    patientRecord: {
      name: "Susan JONES",
      age: 68,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: [
        "Irbesartan 150 mg tablet, one at night",
        "Omeprazole 20 mg tablet, one at night as needed",
      ],
      pastHistory: [
        "2 years ago: Squamous cell carcinoma – left dorsum hand",
        "5 years ago: Hypertension",
        "7 years ago: Squamous cell carcinoma – left cheek",
        "12 years ago: Basal cell carcinoma – left forearm",
        "15 years ago: Gastroesophageal reflux disease, normal endoscopy",
      ],
      socialHistory: {
        "Partner": "Brian, 76 years, cognitive impairment",
        "Children": "Christian, 39 years; Elaine, 36 years – both live overseas",
        "Occupation": "Retired groundskeeper – heavy pesticide and herbicide use while working",
      },
      familyHistory: [
        "Father: Died at 72 years, ischaemic heart disease, hypertension",
        "Mother: Died at 82 years, stroke",
        "No siblings",
      ],
      smoking: "Five cigarettes per day for 50 years",
      alcohol: "Eight standard drinks per week",
      immunisations: [
        "1 year ago: Influenza vaccination",
        "1 year ago: COVID vaccinations (×2 primary doses)",
      ],
    },
    questions: [
      {
        number: 1,
        text: "What history and examination features help you to diagnose Susan's skin lesion?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What further history is important when a patient presents with a skin lesion?" },
          { type: "prompt", text: "What features on examination are you looking for in Susan's skin lesion?" },
          { type: "prompt", text: "What risk factors would you consider?" },
        ],
      },
      {
        number: 2,
        text: "Outline your provisional and differential diagnosis for Susan.",
        timingMinutes: 1,
        prompts: [],
      },
      {
        number: 3,
        text: "Outline how you would initially investigate the lesion.",
        timingMinutes: 1,
        prompts: [
          { type: "prompt", text: "What sort of biopsy would you recommend?" },
          { type: "prompt", text: "What margin would be marked out macroscopically?" },
        ],
      },
      {
        number: 4,
        text: "Biopsy reveals a well-differentiated squamous cell carcinoma with close margins. What further management do you advise?",
        timingMinutes: 1,
        prompts: [
          { type: "prompt", text: "What sort of excision would you recommend?" },
          { type: "prompt", text: "What margin would be required for definitive treatment?" },
        ],
      },
      {
        number: 5,
        text: "How would management differ if the lesion was a poorly differentiated squamous cell carcinoma with peri-neural invasion identified on biopsy?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "Would you consider any referrals?" },
          { type: "prompt", text: "What treatment would you expect as an outcome of a referral?" },
          { type: "prompt", text: "Would you expect any additional treatment measures?" },
        ],
      },
      {
        number: 6,
        text: "Susan receives definitive treatment of her well-differentiated squamous cell carcinoma. What ongoing care do you recommend?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What factors would you consider when advising Susan how often to have her skin checked?" },
          { type: "prompt", text: "What advice would you give to Susan to reduce her risk of further skin cancer?" },
          { type: "prompt", text: "What advice would you give to Susan regarding self skin examination?" },
          { type: "must-use", text: "What practice systems will you consider to ensure that appropriate follow-up care is delivered?" },
        ],
      },
      {
        number: 7,
        text: "Other than skin care, what further preventive activities will you recommend for Susan?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What other health issues should you address with Susan?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [6],
        points: [
          "Advises on timing of follow-up with specific intervals determined by individual patient factors.",
          "All patients with a previous skin cancer should be advised to undergo annual skin examination for life.",
          "Advice regarding self skin examination: look for new, changing, bleeding, tender, irregular, rough or ulcerated lesions.",
        ],
      },
      {
        code: "2.4",
        title: "Physical examination findings are detected accurately and interpreted correctly",
        questions: [1],
        points: [
          "Examination includes the lesion itself (14 mm size, keratinisation), proximal lymph nodes, and full-body skin examination.",
          "Considers presence of bleeding, ulceration, tenderness and vascular pattern.",
          "BCC features: bluish-pink colour, asymmetrical blood vessels, ulceration, elevated rolled edge, white areas of regression.",
          "SCC features: ulceration, white/pink, loss of normal tissue, keratinisation, blood spots, white circles.",
        ],
      },
      {
        code: "2.5",
        title: "Specific positive and negative findings are elicited",
        questions: [1],
        points: [
          "New lesion, velocity of change (rapidly growing over four weeks).",
          "History: trigger (insect bite), tenderness, topical treatments used.",
          "Risk factors: personal history of skin cancers, sun exposure, skin phototype, pesticide/herbicide exposure, smoking.",
        ],
      },
      {
        code: "3.3",
        title: "Demonstrates diagnostic accuracy",
        questions: [2],
        points: [
          "Provisional diagnosis: squamous cell carcinoma.",
          "Differential includes keratoacanthoma, trauma/foreign body/insect bite.",
          "Less likely: basal cell carcinoma, melanoma or other cutaneous malignancy.",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses",
        questions: [2],
        points: [
          "Squamous cell carcinoma (most likely).",
          "Keratoacanthoma.",
          "Trauma, foreign body or insect/arthropod bite.",
          "BCC, melanoma or other cutaneous malignancy (less likely).",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected based on the patient's needs",
        questions: [3, 4, 5],
        points: [
          "Complete excision is the preferred approach when possible; if not appropriate, punch biopsy, shave biopsy or curettage.",
          "Site and size of the lesion must be considered (anterior lower leg, smoker, significant sun damage).",
          "Low-risk SCC: 4 mm margin; high-risk SCC: 6 mm margin.",
          "Postoperative radiotherapy should be considered after complete excision for high-risk SCC.",
          "Appropriate referrals for high-risk lesion: dermatologist/plastic surgery/radiation therapy/oncologist.",
        ],
      },
      {
        code: "4.6",
        title: "Non-pharmacological therapies are offered and discussed",
        questions: [6],
        points: [
          "UV radiation protection strategies: hat, long-sleeved clothing, sunglasses and shade.",
          "Chemoprevention: regular sunscreen and nicotinamide (B3) orally or topically for patients with multiple previous non-melanoma skin cancers.",
          "Adequate vitamin D intake in the context of sun avoidance.",
        ],
      },
      {
        code: "5.1",
        title: "Implements screening and prevention strategies to improve outcomes for individuals at risk",
        questions: [6, 7],
        points: [
          "Annual skin examination for life given history of multiple skin cancers.",
          "Cardiovascular risk: note family history, address modifiable risks (smoking cessation, cholesterol, blood pressure, blood glucose/diabetes screening).",
          "Long-term omeprazole: consider screening for B12 deficiency, reassess need.",
          "Height and weight measurement, optimise BMI.",
          "Husband with cognitive impairment: assess support needs, screen Susan for carer stress and fatigue.",
          "Immunisation status: diphtheria-tetanus/COVID/influenza/Shingrix.",
          "Colorectal cancer screening (faecal occult blood test), cervical screening test, mammogram.",
        ],
      },
      {
        code: "5.6",
        title: "Educates patients and families in disease management and health-promotion skills",
        questions: [6, 7],
        points: [
          "Engagement of the patient to ensure they understand the importance of ongoing preventive and early detection care.",
          "Education on self-examination technique.",
          "Written resources and information sheets provided.",
        ],
      },
      {
        code: "7.4",
        title: "Demonstrates efficient use of recall systems to optimise health outcomes",
        questions: [6],
        points: [
          "Culture of practice that contributes to practitioner and patient engagement.",
          "Recall systems: practitioner education, making the recall within a consultation, actioning recalls opportunistically.",
          "Planned action of recalls: may involve nursing staff, consideration of appointment availability.",
          "Specific practice guidelines about who actions recalls and how (letter, phone call, SMS).",
          "Software or templates for skin mapping, access to photography in practice software/notes.",
          "Information and education posters in patient waiting areas on sun protection and early detection.",
        ],
      },
      {
        code: "8.2",
        title: "Refers appropriately when a procedure is outside their level of competence",
        questions: [4, 5],
        points: [
          "Considers referral for high-risk lesion (poorly differentiated, peri-neural invasion) to dermatologist/plastic surgeon/radiation oncologist.",
          "Justifies the reasoning based on site, size, and risk factors affecting healing.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.11", description: "Safety-netting and specific follow-up arrangements are made", questions: [6] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.4", description: "Physical examination findings are detected accurately and interpreted correctly", questions: [1] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.5", description: "Specific positive and negative findings are elicited", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.3", description: "Demonstrates diagnostic accuracy", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses", questions: [2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected based on the patient's needs and the problem list identified", questions: [3, 4, 5] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.6", description: "Non-pharmacological therapies are offered and discussed", questions: [6] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.1", description: "Implements screening and prevention strategies to improve outcomes for individuals at risk of common causes of morbidity and mortality", questions: [6, 7] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.6", description: "Educates patients and families in disease management and health-promotion skills", questions: [6, 7] },
      { domain: "General practice systems and regulatory requirements", domainNumber: 7, code: "7.4", description: "Demonstrates efficient use of recall systems to optimise health outcomes", questions: [6] },
      { domain: "Procedural skills", domainNumber: 8, code: "8.2", description: "Refers appropriately when a procedure is outside their level of competence", questions: [4, 5] },
    ],
    debriefNotes: `The competent candidate identifies risk factors for SCC (multiple previous skin cancers, pesticide exposure, heavy smoking, significant sun damage), correctly identifies the lesion as most likely SCC with keratoacanthoma as differential. They discuss biopsy approach considering the challenging lower leg location in a smoker. For well-differentiated SCC: 4 mm margins; for poorly differentiated with peri-neural invasion: 6 mm margins plus referral to specialist plus consideration of adjuvant radiotherapy. For ongoing care, they address recall systems, self-examination, chemoprevention with nicotinamide, and comprehensive preventive health including smoking cessation, cardiovascular risk, carer stress for Susan (partner with cognitive impairment), and age-appropriate cancer screening.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // KEATING — Ava, 3F, Type 1 Diabetes / DKA in Rural Setting
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "keating",
    patientName: "Ava KEATING",
    patientAge: 3,
    patientGender: "F",
    presentingComplaint: "Vulval discomfort, bedwetting, weight loss, lethargy",
    topics: ["Type 1 Diabetes", "DKA", "Paediatrics", "Rural Medicine", "Emergency Management"],
    icpcCode: "T – Endocrine, metabolic and nutritional",
    year: "2021",
    scenario: `You are working the weekend morning shift at the medical clinic, which is attached to the local public hospital.

Location: Inland town, population: 2,000.
General practice clinic: Four GPs during the week, one GP on weekends until 12:00 noon.
Local public hospital: Located next door. Ten beds; staffed by the four local GPs on rotation (each with skills in emergency medicine). Midwifery service available for low-risk vaginal deliveries.
Pathology: Point-of-care testing available for troponin, Chem8 (sodium, potassium, chloride, urea, creatinine, total CO2, ionised calcium, glucose, haematocrit, calculated Hb) and CG4+ (pH, pO2, pCO2, lactate). Other bloods sent to regional hospital.
Radiology: Radiographer on call at hospital on weekends.
Emergency services: One ambulance available on weekends, base station 100 km away. Helicopter retrieval services available if needed.
Nearest regional town: 200 km away, population: 140,000. Hospital with emergency medicine specialists, pathology and radiology on site.

Ava KEATING, 3 years, comes to see you with her mother, Alisha. You saw Ava eight weeks earlier – Alisha had concerns about Ava being overweight. At that time, you gave general advice about activity and diet. It became apparent that Ava's parents Alisha and Freddie were going through a difficult separation.

Today, Alisha is concerned because Ava has been complaining of vulval discomfort for the past week. She has even wet the bed the past two nights, which is unusual. Ava has continued to eat, but Alisha thinks she has lost some weight in the past two weeks.

Ava has been tired and lethargic; Alisha thinks this is because Freddie does not make Ava go to bed at a decent hour when she stays with him.

You have weighed Ava today – her weight has decreased by 2 kg since she was last weighed eight weeks ago. Plotting this on her height and weight chart shows a significant drop across centile lines.`,
    patientRecord: {
      name: "Ava KEATING",
      age: 3,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Nil regular medications"],
      pastHistory: ["Nil significant"],
      socialHistory: {
        "Parents": "Separated 6 months ago; 50/50 custody arrangement",
        "Siblings": "Henry, 5 years, viral-induced wheeze",
        "Childcare": "Day care two days a week",
      },
      familyHistory: [
        "Father: Freddie, 29 years, police officer, healthy",
        "Mother: Alisha, 28 years, yoga instructor, hypothyroidism (diagnosed 5 years ago)",
        "Brother: Henry, 5 years, viral-induced wheeze",
      ],
      smoking: "Nil",
      alcohol: "Nil",
      immunisations: [
        "2 months: DTPa, HepB, IPV, Hib, PCV13, rotavirus",
        "4 months: DTPa, HepB, IPV, Hib, PCV13, rotavirus",
        "6 months: DTPa, HepB, IPV, Hib",
        "12 months: MMR, MenACWY, PCV13",
        "18 months: MMRV, Hib, DTPa",
      ],
    },
    questions: [
      {
        number: 1,
        text: "What further history and examination would you undertake for Ava's presentation today?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What other history would you request?" },
          { type: "prompt", text: "What physical examination features would you look for?" },
          { type: "prompt", text: "Are there any bedside tests you would do?" },
        ],
      },
      {
        number: 2,
        text: "List your differential diagnosis for Ava's presentation.",
        timingMinutes: 1,
        prompts: [],
      },
      {
        number: 3,
        text: "Ava's finger prick blood glucose is 15 mmol/L. What is your most likely diagnosis and how do you explain this to Alisha?",
        timingMinutes: 2,
        prompts: [],
      },
      {
        number: 4,
        text: "You advise that Ava needs to be transferred to the emergency department. Alisha becomes upset and wants to talk to Freddie before admitting Ava to hospital. She fears that Freddie will be angry at her. What are your next steps?",
        timingMinutes: 2,
        prompts: [],
      },
      {
        number: 5,
        text: "While you are having a discussion with Alisha, Ava starts having a seizure. How do you manage this situation?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What is your immediate management for Ava?" },
          { type: "prompt", text: "What are your next steps after stabilising Ava?" },
        ],
      },
      {
        number: 6,
        text: "Alisha and Ava come to see you one week post-discharge from the regional hospital. What would you like to discuss at this follow-up appointment?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "What do you need to consider for Ava's ongoing care?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.1",
        title: "Communication is appropriate to the person and the sociocultural context",
        questions: [3, 4],
        points: [
          "Communicates the diagnosis sensitively to Alisha in clear, non-jargon language.",
          "Acknowledges the emotional distress and validates concerns.",
          "Maintains focus on the child's urgent needs while being compassionate to the family situation.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [4],
        points: [
          "Arranges ambulance first, discusses with Alisha the best way to communicate with Freddie (e.g., doctor to call him, Alisha to call with doctor available).",
          "Calls another support person to be with Alisha at the hospital.",
          "Recognises that a barrier to care might be domestic violence/fear of safety.",
          "Facilitates safe management of the urgent presentation while supporting Alisha.",
        ],
      },
      {
        code: "RH2",
        title: "Adapts communication to accommodate situations common in rural and remote areas",
        questions: [4, 5],
        points: [
          "Recognises limitations of rural setting and coordinates appropriate transfer.",
          "Calls nearest paediatric referral centre to seek critical care advice.",
          "Considers helicopter retrieval.",
          "Uses point-of-care testing available in the rural setting.",
        ],
      },
      {
        code: "2.1",
        title: "A comprehensive biopsychosocial history is taken from the patient",
        questions: [1],
        points: [
          "Enuresis: new or ongoing, day/night, dysuria, frequency, odour, haematuria.",
          "Vulval itch: soaps, toilet hygiene, self-play, risk of child sexual abuse, treatments used, vaginal discharge.",
          "Weight loss: period, diet change, activity change, appetite, polyuria, polydipsia.",
          "Fatigue: sleep patterns, activity levels, dietary restrictions.",
          "Current home situation, custody arrangements, behavioural concerns, symptoms of anxiety.",
        ],
      },
      {
        code: "3.2",
        title: "Modifies differential diagnoses based on clinical course and other data",
        questions: [3],
        points: [
          "Elevates type 1 diabetes / DKA to most likely diagnosis when blood glucose 15 mmol/L is known.",
          "Recognises the clinical course progression from polyuria/polydipsia/weight loss to current presentation.",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses",
        questions: [2],
        points: [
          "First presentation of type 1 diabetes (must not miss).",
          "Child sexual abuse (cannot miss).",
          "Urinary tract infection.",
          "Vulvovaginitis.",
          "Lichen sclerosus.",
          "Hypothyroidism.",
          "Iron deficiency.",
          "Anxiety.",
          "Haematological malignancy.",
        ],
      },
      {
        code: "3.7",
        title: "Directs evaluation and treatment towards high-priority diagnoses",
        questions: [1, 2, 5],
        points: [
          "Targeted examination: general appearance, hydration, heart rate, respiratory rate, temperature, lymphadenopathy, abdominal exam, sensitive vulval exam with parental and child consent.",
          "Bedside tests: finger-prick blood glucose and/or dipstick urine (at least one must be done), urine dipstick or finger prick for ketones.",
          "Performs appropriate seizure management and organises urgent transfer.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [5, 6],
        points: [
          "Calls nurse for help, gets resuscitation cart, notes time of seizure commencement.",
          "Ensures ambulance has been called.",
          "Assesses airway, breathing, circulation.",
          "IV midazolam 0.15 mg/kg (max 10 mg) or diazepam 0.1–0.4 mg/kg (max 10 mg); OR buccal/intranasal/IM midazolam 0.2–0.3 mg/kg (max 10 mg) if no IV access.",
          "Immediate transfer to local emergency department.",
          "Calls nearest paediatric referral centre; calls for helicopter retrieval.",
          "Initiates sodium/potassium infusion and low-dose continuous insulin infusion with advice from receiving team.",
          "Regular observations and serial ECGs.",
          "Updates parents about evolving situation.",
        ],
      },
      {
        code: "4.8",
        title: "Provides effective explanations, education and choices to the patient",
        questions: [3, 6],
        points: [
          "Explains that high blood glucose is a complication of type 1 diabetes leading to excessively high blood glucose and ketone production.",
          "Debriefs regarding the episode at medical centre/hospital.",
          "Checks mother's understanding of diagnosis (includes father in conversation as appropriate).",
          "Assesses treatment compliance (checks parents' understanding of how to give insulin).",
          "Links in with local allied health services and paediatrician.",
          "Diabetes action plan for day care.",
        ],
      },
      {
        code: "RH11",
        title: "Implements strategies to minimise obstacles to accessing care",
        questions: [4, 5, 6],
        points: [
          "Recognises geographic isolation as a barrier.",
          "Arranges helicopter retrieval if needed.",
          "Links in with paediatric endocrinology and allied health at the regional centre.",
          "Considers telehealth for ongoing follow-up given rural location.",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages clinical situations where there are obstacles to the provision of duty of care",
        questions: [4],
        points: [
          "Recognises potential domestic violence/safety issue as a barrier to care.",
          "Facilitates urgent care despite family conflict.",
          "Considers appropriate probing at follow-up regarding Alisha's safety.",
        ],
      },
      {
        code: "10.1",
        title: "A patient with significant illness is identified",
        questions: [3, 5],
        points: [
          "Recognises DKA/high blood glucose as a medical emergency in a 3-year-old.",
          "Responds without delay to seizure with appropriate emergency management.",
          "Identifies need for specialist paediatric care beyond the rural setting.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.1", description: "Communication is appropriate to the person and the sociocultural context", questions: [3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.10", description: "Prioritises problems, attending to both the patient's and the doctor's agendas", questions: [4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "RH2", description: "Adapts communication to accommodate situations common in rural and remote areas, and maintains effective communication infrastructure relevant to the practice setting", questions: [4, 5] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.1", description: "A comprehensive biopsychosocial history is taken from the patient", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.2", description: "Modifies differential diagnoses based on clinical course and other data as appropriate", questions: [3] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses, including most likely, less likely, unlikely and cannot miss diagnoses", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.7", description: "Directs evaluation and treatment towards high-priority diagnoses", questions: [1, 2, 5] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [5, 6] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.8", description: "Provides effective explanations, education and choices to the patient", questions: [3, 6] },
      { domain: "Preventive and population health", domainNumber: 5, code: "RH11", description: "Implements strategies to minimise obstacles to accessing care", questions: [4, 5, 6] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages clinical situations where there are obstacles to the provision of duty of care", questions: [4] },
      { domain: "Identifying and managing the patient with significant illness", domainNumber: 10, code: "10.1", description: "A patient with significant illness is identified", questions: [3, 5] },
    ],
    debriefNotes: `The competent candidate takes a comprehensive history covering polyuria, polydipsia, weight loss, vulval symptoms, and enuresis, and performs targeted bedside tests (finger-prick BGL and ketones). They formulate a broad differential including cannot-miss diagnoses (type 1 diabetes, child sexual abuse). When BGL returns at 15 mmol/L, they correctly identify DKA as the most likely diagnosis and communicate this sensitively to Alisha while calling an ambulance immediately. When Alisha is reluctant, they demonstrate compassion but maintain clinical urgency, arranging for Freddie to be contacted while ensuring Ava's safety. When a seizure occurs, they demonstrate correct emergency management (ABC, midazolam dosing, ambulance, helicopter retrieval, point-of-care testing, contact with paediatric referral centre). Follow-up covers debrief, parental education on insulin, allied health referral, and a day care diabetes action plan.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MORRAL — Evan, 76M, Pre-syncope / Bradycardia / Aortic Stenosis
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "morral",
    patientName: "Evan MORRAL",
    patientAge: 76,
    patientGender: "M",
    presentingComplaint: "Weakness, pre-syncope, reduced exercise tolerance on the farm",
    topics: ["Bradycardia", "Aortic Stenosis", "Syncope", "Falls Risk", "Cervical Spine Injury"],
    icpcCode: "K – Cardiovascular",
    year: "2022",
    scenario: `Evan MORRAL, 76 years, comes to see you worried that he is not able to undertake his usual tasks around the farm. Evan is a regular patient of yours, and as he walks in, you notice him walking cautiously holding onto his wife, Dianne. This is not usual for Evan.

Evan tells you that over the past four weeks, he has been feeling weak and faint. He tends to feel this way when he starts to do things around the farm. He has not had any chest pain, but sometimes feels 'puffed out' when he has done too much. He denies any headaches, blurred vision, vertigo or paraesthesia/weakness in his limbs.

Dianne has noticed that Evan tends to stagger when he exerts himself and that he needs occasional rests. She feels that Evan is becoming depressed and annoyed with himself when he is not able to do his usual jobs around the farm.

Examination findings:
• General appearance: Neat and well dressed, not short of breath at rest
• Tympanic temperature: 36.8°C
• Blood pressure sitting: 122/90 mmHg
• Blood pressure standing: 123/80 mmHg
• Heart rate sitting: 45/min regular
• Respiration rate: 14/min
• Oxygen saturation: 99% on room air
• Cardiovascular examination: Heart sounds dual with a loud ejection systolic murmur
• Respiratory examination: Equal air entry to bases, no crepitations or wheeze, resonant percussion
• Upper and lower limb neurological examination: Normal and equal tone, power, reflexes, sensation and coordination

You perform an ECG which shows sinus bradycardia with first-degree heart block.`,
    patientRecord: {
      name: "Evan MORRAL",
      age: 76,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Cephalexin – rash",
      medications: [
        "Apixaban 5 mg twice daily",
        "Panadol Osteo 665 mg two tablets three times daily",
        "Allopurinol 100 mg once daily",
        "Perindopril 8 mg once daily",
      ],
      pastHistory: [
        "4 years ago: Recurrent gout",
        "5 years ago: Recurrent unprovoked deep vein thrombosis",
        "5 years ago: Factor V Leiden mutation detected",
        "10 years ago: Osteoarthritis of knee",
        "10 years ago: Hypertension",
      ],
      socialHistory: {
        "Partner": "Dianne, 74 years (hypertension, osteoporosis, type 2 diabetes)",
        "Children": "Matthew (40), Belinda (38), Samuel (36)",
        "Occupation": "Retired cattle farmer",
      },
      familyHistory: [
        "Father: Died 72 years, CABG at 63, prostate cancer at 65",
        "Mother: Died 81 years, type 2 diabetes at 50, AF at 72, heart valve repair at 75",
        "Brother Sean: 70 years, prostate cancer at 65",
        "Sister Linda: 69 years, healthy",
      ],
      smoking: "Non-smoker",
      alcohol: "Non-drinker",
      immunisations: [
        "This year: Influenza vaccination",
        "9 months ago: COVID-19 fully vaccinated (including boosters)",
      ],
    },
    questions: [
      {
        number: 1,
        text: "Outline your problem representation and differential diagnoses.",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "Summarise the medical issues for Evan." },
          { type: "prompt", text: "List your differential diagnoses." },
          { type: "prompt", text: "What is your provisional diagnosis?" },
        ],
      },
      {
        number: 2,
        text: "What investigations would you do and why?",
        timingMinutes: 2,
        prompts: [
          { type: "probe", text: "You mentioned [investigation] – what is your rationale for doing this investigation?" },
        ],
      },
      {
        number: 3,
        text: "Outline your approach to Evan today.",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How do you explain to Evan what is going on?" },
          { type: "prompt", text: "What other concerns do you need to address with Evan?" },
          { type: "prompt", text: "What advice do you give him should he deteriorate?" },
          { type: "probe", text: "You mentioned cardiology review – what options do you think they will offer?" },
          { type: "probe", text: "You mentioned emergency review – can you outline what you think will be done?" },
        ],
      },
      {
        number: 4,
        text: "While waiting for cardiology review, Evan presents to you at the practice following a fall at his farm. He has hit the back of his head and is complaining of a sore and stiff neck. On examination of his cervical spine, he has midline tenderness. Outline your management.",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What are your immediate priorities for Evan?" },
          { type: "probe", text: "You mentioned C-spine stabilisation – could you explain how you might do this at your general practice?" },
          { type: "probe", text: "You mentioned transferring him to emergency – what management do you think he will receive there?" },
        ],
      },
      {
        number: 5,
        text: "Evan's investigations in hospital following his fall are all normal and he is on the waiting list for cardiology review. What do you need to address with Evan in his follow-up appointment with you?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What allied health services would you discuss with Evan?" },
          { type: "prompt", text: "What preventative healthcare measures would you consider?" },
          { type: "prompt", text: "Are there any legal considerations you need to discuss?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "2.4",
        title: "Physical examination findings are detected accurately and interpreted correctly",
        questions: [1, 2],
        points: [
          "Correctly interprets ECG showing sinus bradycardia and first-degree heart block.",
          "Recognises the clinical significance of a loud ejection systolic murmur (possible aortic stenosis).",
          "Notes absence of orthostatic hypotension (no significant postural drop).",
        ],
      },
      {
        code: "2.6",
        title: "Rational options for investigations are chosen using an evidence-based approach",
        questions: [2],
        points: [
          "Full blood count – to check haemoglobin levels (on anticoagulants, possible bleed).",
          "UEC – for electrolyte disturbances.",
          "CXR – to rule out infection, assess cardiothoracic ratio.",
          "24-hour Holter – to exclude sick sinus syndrome.",
          "Echocardiogram – to exclude obstructive cardiomyopathy and assess valvular function.",
          "Secondary: ultrasound carotid to exclude stenosis; CT brain to exclude structural abnormality.",
        ],
      },
      {
        code: "3.1",
        title: "Integrates and synthesises knowledge to make decisions in complex clinical situations",
        questions: [1, 2],
        points: [
          "Accounts for multiple complex factors: bradycardia, ejection systolic murmur, anticoagulation, falls risk, rural location, psychological impact.",
          "Considers drug-induced bradycardia from perindopril.",
          "Considers anaemia secondary to bleed in a patient on anticoagulants.",
        ],
      },
      {
        code: "3.3",
        title: "Demonstrates diagnostic accuracy",
        questions: [1],
        points: [
          "Problem representation: 76-year-old with known hypertension, gout, OA and recurrent DVT presenting with acute deterioration in mobilising and function, sinus bradycardia with first-degree heart block, and new ejection systolic murmur possibly indicating aortic stenosis. High falls risk complicated by anticoagulation.",
        ],
      },
      {
        code: "3.5",
        title: "Articulates an appropriate problem definition",
        questions: [1],
        points: [
          "Provides a concise problem representation covering: symptom summary, key positive findings (bradycardia, murmur), key negative findings (no neurological signs, no orthostatic hypotension), risk factors (anticoagulation, rural location, psychological impact, functional impact on farm).",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses",
        questions: [1],
        points: [
          "Orthostatic hypotension: volume loss (dehydration), drug-induced (antihypertensives).",
          "Cardiac: structural (valvular – aortic stenosis, cardiomyopathy), arrhythmias (sinus node dysfunction), ischaemic.",
          "Neurally mediated: carotid sinus syndrome, vasovagal.",
          "Anaemia secondary to bleed (on anticoagulants).",
          "Recurrent pulmonary embolus.",
          "Neurological: tumour, CVA, neurodegenerative condition.",
        ],
      },
      {
        code: "3.7",
        title: "Directs evaluation and treatment towards high-priority diagnoses",
        questions: [2, 4],
        points: [
          "Prioritises cardiac causes and falls risk given examination findings.",
          "For the fall with midline C-spine tenderness: calls ambulance, C-spine stabilisation with C-collar, assesses neurological deficit, monitors GCS, arranges CT head and CT C-spine.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected",
        questions: [3, 4, 5],
        points: [
          "Provides explanation of bradycardia and possible aortic stenosis to the patient.",
          "Safety-netting: falls prevention, increased bleeding risk, signs of deterioration.",
          "Cardiology review for possible pacemaker and management of aortic stenosis.",
          "Review of anticoagulation given high falls risk.",
          "For the fall: immediate ambulance, C-spine immobilisation, neurological assessment.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 5],
        points: [
          "Holistic management: nutrition, exercise, falls prevention, psychological wellbeing.",
          "Evaluates Evan's frustration with reduced function and farm work.",
          "Evaluates wife Dianne's understanding and her own health (hypertension, osteoporosis, T2DM).",
          "MDT: falls risk assessment (medication review, visual acuity, hearing, mobility, gait, balance, neurological).",
          "Allied health: physiotherapy (mobility/balance), OT (home environment), podiatry (foot care).",
          "Bone mineral density scan (consider osteoporosis).",
          "Assess fitness to drive.",
          "Consider ACAT referral.",
        ],
      },
      {
        code: "4.8",
        title: "Provides effective explanations, education and choices to the patient",
        questions: [3],
        points: [
          "Explains bradycardia and possible aortic stenosis in plain language.",
          "Discusses importance of cardiology review and what to expect.",
          "Addresses farming/work implications and legal considerations (e.g., heavy machinery).",
        ],
      },
      {
        code: "5.2",
        title: "Uses planned and opportunistic approaches to provide screening, preventative care and health-promotion activities",
        questions: [5],
        points: [
          "Comprehensive falls risk assessment.",
          "Prostate cancer screening discussion given family history.",
          "Review of anticoagulation safety.",
          "Bone mineral density scan.",
        ],
      },
      {
        code: "5.3",
        title: "Coordinates a team-based approach",
        questions: [5],
        points: [
          "Physiotherapy, occupational therapy, podiatry for falls prevention.",
          "Cardiology for pacemaker consideration and aortic stenosis management.",
          "ACAT referral if needed.",
          "Involves Dianne in management planning.",
        ],
      },
      {
        code: "10.1",
        title: "A patient with significant illness is identified",
        questions: [1, 4],
        points: [
          "Recognises sinus bradycardia with first-degree heart block and possible aortic stenosis as clinically significant.",
          "For the fall with midline C-spine tenderness: recognises potential cervical spine injury as a serious emergency.",
          "Calls ambulance promptly and immobilises C-spine before any transport.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.4", description: "Physical examination findings are detected accurately and interpreted correctly", questions: [1, 2] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.6", description: "Rational options for investigations are chosen using an evidence-based approach", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.1", description: "Integrates and synthesises knowledge to make decisions in complex clinical situations", questions: [1, 2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.3", description: "Demonstrates diagnostic accuracy", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.5", description: "Articulates an appropriate problem definition", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses, including most likely, less likely, unlikely and cannot miss diagnoses", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.7", description: "Directs evaluation and treatment towards high-priority diagnoses", questions: [2, 4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected based on the patient's needs and the problem list identified", questions: [3, 4, 5] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 5] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.8", description: "Provides effective explanations, education and choices to the patient", questions: [3] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.2", description: "Uses planned and opportunistic approaches to provide screening, preventative care and health-promotion activities", questions: [5] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.3", description: "Coordinates a team-based approach", questions: [5] },
      { domain: "Identifying and managing the patient with significant illness", domainNumber: 10, code: "10.1", description: "A patient with significant illness is identified", questions: [1, 4] },
    ],
    debriefNotes: `The competent candidate provides a clear problem representation synthesising the key findings (bradycardia, ejection systolic murmur, high falls risk, anticoagulation, rural location, psychological impact). They formulate a comprehensive differential and prioritise cardiac causes. Investigations include FBC, UEC, CXR, Holter monitor, and echocardiogram. They explain the diagnosis clearly to the patient, address falls prevention and anticoagulation risks, and arrange cardiology review. When the fall with midline C-spine tenderness occurs, they immediately recognise a potential cervical spine injury, call an ambulance, apply a C-collar, and arrange CT head and C-spine. At follow-up, they address the full MDT approach (physiotherapy, OT, podiatry), psychological wellbeing, fitness to drive, and ACAT if needed.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SIMKINS — Amiel, 21F, Postpartum Psychosis / Aboriginal Health
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "simkins",
    patientName: "Amiel SIMKINS",
    patientAge: 21,
    patientGender: "F",
    presentingComplaint: "Behavioural change postpartum – brought in by aunt, concerns about mother and baby",
    topics: ["Postpartum Psychosis", "Perinatal Mental Health", "Aboriginal Health", "Rural Medicine", "Cultural Safety"],
    icpcCode: "P – Psychological",
    year: "2023 (reviewed 2026)",
    scenario: `Amiel SIMKINS, an Aboriginal woman aged 21 years, and her baby girl Camisha, aged 4 weeks, have been brought in by Amiel's Aunty Georgina to your rural general practice. Amiel, her partner Andreas and Camisha all live with Georgina.

Georgina has raised some concerns about Amiel with your practice nurse prior to the visit. She says Amiel has not seemed right since she came home from the hospital with Camisha. Amiel rarely sleeps and often paces around the house most of the night. She barely talks to anyone, including Georgina.

Georgina explains that Amiel will attend to baby Camisha and will bathe, change and breastfeed her, but only when prompted to do so. Georgina worries that if she was not there, Amiel may not respond to Camisha crying or attend to her needs.

When Georgina sees Amiel holding or tending to Camisha, Amiel always appears to be whispering softly to her with a serious look on her face. Georgina can't hear what Amiel is saying and, if she comes closer to attempt to hear, Amiel will just stop and stare at Georgina. Georgina has taken a few weeks off work to help Amiel, but she needs to go back to work next week. She is worried about leaving Amiel alone. Amiel's partner Andreas will be away at work for a further three weeks.

Georgina thinks Amiel might feel better if she goes and stays with her mother Gladys in their home community five hours away, but she doesn't think Amiel could travel safely right now. Their home community is very remote, with only a small clinic and few other health services.

In your clinic room Amiel is very quiet and fidgets a lot. She appears anxious and keeps looking around the room and at the door like she wants to leave. Baby Camisha is sleeping soundly in Georgina's arms.`,
    patientRecord: {
      name: "Amiel SIMKINS",
      age: 21,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Aboriginal",
      allergies: "Nil known",
      medications: ["No medications"],
      pastHistory: [
        "4 weeks ago: G1P1; female infant, birth weight 2700g born at 36 weeks gestation by forceps vaginal delivery and postpartum haemorrhage (700 mL)",
      ],
      socialHistory: {
        "Partner": "Andreas, age 27 years, fly-in fly-out mine work (4 weeks on, 2 weeks off)",
        "Children": "Baby girl Camisha, aged 4 weeks",
        "Household": "Lives with Aunty Georgina",
        "Community": "Home community 5 hours away, very remote, small clinic only",
      },
      familyHistory: [
        "Father: 42 years, well",
        "Mother: Gladys, 39 years, well – lives in home community",
        "Brother 1: 17 years, schizophrenia",
        "Brother 2: 12 years, ADHD",
        "Brother 3: 10 years, well",
      ],
      smoking: "Non-smoker",
      alcohol: "Does not drink alcohol",
      immunisations: [
        "2 months ago: Tetanus, diphtheria, pertussis vaccine",
        "Current year: Influenza",
        "2 years ago: COVID-19 (total four doses)",
      ],
    },
    questions: [
      {
        number: 1,
        text: "Outline your concerns for Amiel and Camisha and your differential diagnosis for Amiel's presentation.",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What other considerations for this case might there be?" },
          { type: "probe", text: "You mentioned [differential diagnosis] – can you explain your reasoning?" },
        ],
      },
      {
        number: 2,
        text: "What additional history may help define your provisional diagnosis?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What additional information might you want from Amiel?" },
          { type: "prompt", text: "Would you like to know anything further about baby Camisha?" },
          { type: "prompt", text: "What additional information might Georgina be able to provide?" },
          { type: "prompt", text: "What further cultural factors may you consider in this consultation?" },
          { type: "probe", text: "You mentioned [additional information] – how will you ask about that?" },
        ],
      },
      {
        number: 3,
        text: "Amiel was diagnosed with postpartum psychosis and admitted to a mother–baby unit for treatment. She is being discharged and wants to return to her remote community because she feels this will help her and Camisha heal. How can you support Amiel and Camisha for their return to their community?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How might you assess suitability to return to a remote location at this time?" },
          { type: "prompt", text: "What might be put in place for Amiel and Camisha's ongoing care?" },
          { type: "prompt", text: "What services might be used to assist with their care in community?" },
          { type: "prompt", text: "How might you organise transfer of care?" },
        ],
      },
      {
        number: 4,
        text: "Six months later, Amiel returns to see you in the clinic. She has done a home pregnancy test, which is positive. She is worried about having another baby so soon and that she may have postpartum psychosis again. How will you assist Amiel?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How will you address Amiel's concern about recurrence of psychosis?" },
          { type: "prompt", text: "What pregnancy management options might you discuss with Amiel?" },
          { type: "prompt", text: "What referrals might be appropriate?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "AH1",
        title: "Uses a range of methods to facilitate culturally safe communication with Aboriginal and Torres Strait Islander peoples",
        questions: [1, 2, 3, 4],
        points: [
          "Uses safe, appropriate, non-judgemental and respectful language.",
          "Has a patient-centred and holistic approach without stereotyping.",
          "Outlines appropriate engagement and communication strategies.",
          "Avoids assumptions, racist attitudes and inappropriate language.",
          "Avoids dichotomous language.",
          "Shows consideration of language barriers and literacy levels.",
          "Assesses the patient's understanding of her diagnosis and provides appropriate education.",
        ],
      },
      {
        code: "AH2",
        title: "Integrates cultural perspectives on, and beliefs about, the health and wellbeing of Aboriginal and Torres Strait Islander peoples into holistic clinical practice",
        questions: [1, 2, 3, 4],
        points: [
          "Establishes consent for Aunty Georgina to be present for the whole consultation and to provide collateral history.",
          "Considers recent pregnancy and birth trauma, sleep deprivation, family history of schizophrenia and ADHD.",
          "Explores potential cultural explanations for the presentation.",
          "Asks about recreational substance use sensitively.",
          "Explores social setting and supports.",
          "Emphasises the importance of involvement of an Aboriginal and Torres Strait Islander health practitioner or health worker.",
          "Considers culture in offering management options.",
        ],
      },
      {
        code: "AH3",
        title: "Appraises and addresses barriers to development of effective therapeutic relationships with Aboriginal and Torres Strait Islander peoples",
        questions: [1, 2, 3],
        points: [
          "Avoids assumptions, racist attitudes and inappropriate language.",
          "Avoids dichotomous language.",
          "Explores social setting and supports, including family and community roles.",
        ],
      },
      {
        code: "RH1",
        title: "Develops, maintains and reviews effective communication strategies for communicating with patients and other health professionals who are located remotely",
        questions: [3],
        points: [
          "Sources a discharge summary and ongoing care needs and follow-up plans from the recent admission.",
          "Reviews an updated medication list.",
          "Provides written and verbal handover to community clinic staff.",
          "Establishes telehealth access and follow-up or fly-in, fly-out services to the remote location.",
        ],
      },
      {
        code: "2.1",
        title: "A comprehensive biopsychosocial history is taken from the patient",
        questions: [2],
        points: [
          "Symptoms of psychosis: confusion, disorientation, hallucinations, delusions, paranoia, agitation, insight.",
          "Symptoms of anxiety, depression or mania.",
          "Symptoms of infection: vaginal discharge, pelvic pain, fevers, breast symptoms, UTI symptoms.",
          "Quality of sleep, lochia, perineal wound healing.",
          "Pregnancy details, delivery and birth details, postpartum haemorrhage and follow-up blood results, iron supplementation.",
          "Feeding pattern: type (formula vs breast milk), method, frequency, adequacy, difficulties.",
          "Past medical history and family history of psychosis, depression, anxiety, manic symptoms.",
          "Quality and details of relationship with partner.",
          "Alcohol and illicit drug use.",
          "Potential cultural explanations for the presentation.",
          "Home safety, levels of support, four- to six-week baby and well mother check.",
        ],
      },
      {
        code: "3.5",
        title: "Articulates an appropriate problem definition",
        questions: [1],
        points: [
          "Provides a clear synopsis of the clinical problem.",
          "Emphasises important positive and negative findings.",
          "Considers mother and baby dyad safety.",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses",
        questions: [1],
        points: [
          "Postpartum psychosis (most likely).",
          "Postnatal blues, postnatal depression, anxiety/PTSD.",
          "First presentation of underlying schizophrenia/schizoaffective disorder/bipolar disorder.",
          "Cultural expression of birth trauma.",
          "Postpartum infection/sepsis.",
          "Medical conditions: severe anaemia, thyroid conditions, calcium abnormalities, malignancy.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 4],
        points: [
          "Facilitates transfer of care to remote community with appropriate rural/remote resources.",
          "Plans for routine mother and infant follow-up care, immunisations and health checks.",
          "Has a safety plan for potential recurrence of psychosis.",
          "Considers support for other family members, including financial supports.",
          "Ensures culturally appropriate antenatal care programs for subsequent pregnancy.",
          "Appropriate safety-netting is arranged.",
          "Recommends early review next pregnancy, including early referral to perinatal mental health service.",
        ],
      },
      {
        code: "AH6",
        title: "Collaborates effectively with multidisciplinary teams to develop meaningful and holistic management plans",
        questions: [3, 4],
        points: [
          "Sources a discharge summary and ongoing care needs from the recent admission.",
          "Provides referrals to outreach mental health services.",
          "Has a family meeting with the patient's mother or other appropriate family supports in the community.",
          "Organises a case conference to liaise between allied health: social worker, ATSI health practitioner or health worker, counsellor.",
        ],
      },
      {
        code: "RH4",
        title: "Links into existing networks of health professionals in rural and remote settings",
        questions: [3],
        points: [
          "Determines the nearest health services (GP/hospital/remote area nurse/ATSI health practitioner).",
          "Establishes whether the community has a clinic and what staff are available.",
          "Arranges telehealth access and follow-up or fly-in, fly-out services.",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages clinical situations where there are obstacles to the provision of duty of care",
        questions: [3, 4],
        points: [
          "Addresses barriers: geographic isolation, limited health service availability, cultural safety concerns.",
          "Balances Amiel's autonomy and wish to return to community with clinical safety.",
          "Arranges appropriate care and safety planning before discharge to remote community.",
        ],
      },
      {
        code: "10.1",
        title: "A patient with significant illness is identified",
        questions: [1],
        points: [
          "Identifies that this is a significantly ill person with a potential psychiatric emergency requiring thorough assessment and urgent referral to a specialised unit.",
          "Performs a comprehensive safety assessment of the mother and baby, including self-harm, suicide risk and infanticide risk.",
          "Recognises the vulnerability of baby Camisha and the need to ensure her safety.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "AH1", description: "Uses a range of methods to facilitate culturally safe communication with Aboriginal and Torres Strait Islander peoples", questions: [1, 2, 3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "AH2", description: "Integrates cultural perspectives on, and beliefs about, the health and wellbeing of Aboriginal and Torres Strait Islander peoples into holistic clinical practice", questions: [1, 2, 3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "AH3", description: "Appraises and addresses barriers to development of effective therapeutic relationships with Aboriginal and Torres Strait Islander peoples", questions: [1, 2, 3] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "RH1", description: "Develops, maintains and reviews effective communication strategies for communicating with patients and other health professionals who are located remotely", questions: [3] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.1", description: "A comprehensive biopsychosocial history is taken from the patient", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.5", description: "Articulates an appropriate problem definition", questions: [1] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses, including most likely, less likely, unlikely and cannot miss diagnoses", questions: [1] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "AH6", description: "Collaborates effectively with multidisciplinary teams to develop meaningful and holistic management plans", questions: [3, 4] },
      { domain: "Preventive and population health", domainNumber: 5, code: "RH4", description: "Links into existing networks of health professionals in rural and remote settings", questions: [3] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages clinical situations where there are obstacles to the provision of duty of care", questions: [3, 4] },
      { domain: "Identifying and managing the patient with significant illness", domainNumber: 10, code: "10.1", description: "A patient with significant illness is identified", questions: [1] },
    ],
    debriefNotes: `The competent candidate establishes culturally safe communication from the outset, seeks consent for Georgina to be present, and avoids assumptions or stereotyping. They recognise this as a psychiatric emergency (postpartum psychosis) and complete a comprehensive safety assessment covering the mother and baby dyad, including self-harm, suicide and infanticide risk. They take a thorough biopsychosocial history addressing psychosis symptoms, birth trauma, cultural factors, sleep, feeding, and family supports. When Amiel is discharged and wants to return to her remote community, they facilitate this by organising discharge summary, medication list, verbal and written handover to community clinic staff, telehealth follow-up, outreach mental health services, and a safety plan. For the subsequent pregnancy, they discuss recurrence risk (approximately 50%), early perinatal mental health referral, culturally appropriate antenatal care, and all pregnancy management options with sensitivity and respect for autonomy.`,
  },
];

export function getCaseById(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}
