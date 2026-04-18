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
    domain: "undifferentiated",
    difficulty: "complex",
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
          "Adapts language to match the patient's level of understanding – avoids or explains medical jargon; while Angela is a nurse, she is acutely unwell and distressed, so plain clear language is still essential.",
          "Explains the steps in management to the patient clearly and calmly, giving information in manageable chunks (chunk and check).",
          "Reviews patient understanding using methods such as summarisation and teach-back method to confirm understanding.",
          "Provides written and verbal instructions for medication adherence, considering shift work challenges.",
          "Considers Angela's emotional state (anxious, unwell) and adapts explanation accordingly – does not overwhelm with information at once.",
          "Uses patient's response as a guide to how to proceed with the explanation.",
        ],
      },
      {
        code: "1.8",
        title: "Adapts the consultation to facilitate optimal patient care",
        questions: [2, 3, 4],
        points: [
          "Adjusts explanation style to suit patient's emotional state (anxious, unwell, fearful about hospital transfer).",
          "Maintains rapport while prioritising urgent care – balances clinical urgency with compassionate communication.",
          "Accommodates patient's needs including any family present (husband Peter) in the consultation discussion.",
          "Incorporates patient's context (aged care nurse, family responsibilities, shift work) into management discussion.",
          "Takes time to let the patient express her concerns before moving on to the management plan.",
          "Flexible in approach – adjusts the consultation as the patient's condition and understanding evolves.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [2, 3],
        points: [
          "Recognises this patient as being very ill, requiring urgent care and referral to hospital and specialist for definitive management – prioritises this above all else.",
          "Provides an appropriate provisional diagnosis of severe hyperthyroidism / thyroid storm.",
          "Negotiates the consultation agenda with the patient – acknowledges her concerns while making clear the medical urgency.",
          "Takes account of both patient's expectations (wanting to understand what is happening) and the medical needs (urgent stabilisation and transfer).",
          "Balances urgent management with discussion of long-term treatment options at an appropriate time (not prematurely reassuring).",
          "Documents priorities clearly in the clinical record.",
        ],
      },
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [3, 4],
        points: [
          "Gives clear follow-up guidance routinely – specifies what will happen in hospital and after discharge.",
          "Educates Angela on signs of deterioration and when to seek urgent care (e.g. worsening palpitations, chest pain, shortness of breath, altered consciousness).",
          "Provides clear instructions for hospital follow-up and specialist (endocrinologist) review after discharge.",
          "Plans for medication review and adherence support post-discharge, specifically addressing the shift work challenge.",
          "Addresses barriers to follow-up care (e.g. work, transportation, family commitments).",
          "Considers longer term follow-up and explains the need for review including monitoring of thyroid function.",
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
    domain: "preventive",
    difficulty: "standard",
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
          "Gives clear follow-up guidance routinely – specifies recall intervals and how the practice will initiate them.",
          "Advises on timing of follow-up with specific intervals determined by individual patient factors (multiple previous skin cancers, location, high UV exposure history).",
          "All patients with a previous skin cancer should be advised to undergo annual skin examination for life.",
          "Educates Susan on when to seek urgent care – signs that warrant earlier review (rapid growth, bleeding, ulceration, new lesion).",
          "Advice regarding self skin examination: look for new, changing, bleeding, tender, irregular, rough or ulcerated lesions.",
          "Addresses barriers to follow-up care (partner with cognitive impairment at home, children living overseas, carer stress).",
          "Provides written resources and information sheets to support self-monitoring and skin protection.",
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
    domain: "paediatrics",
    difficulty: "complex",
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
          "Communicates the diagnosis sensitively to Alisha in clear, non-jargon language – adapts language to a distressed young mother, not to a medical professional.",
          "Considers the sociocultural context (separated parents, family conflict, fear of Freddie's reaction) as part of the consultation.",
          "Acknowledges the emotional distress and validates concerns – shows empathy and respect throughout.",
          "Responds to both verbal and non-verbal cues from Alisha (e.g. visible distress, hesitation about hospital).",
          "Maintains focus on the child's urgent needs while being compassionate to the family situation.",
          "Adapts communication style as the situation escalates (blood glucose result → seizure) – stays calm and reassuring.",
          "Considers the occupational aspects (Alisha's yoga instructor role; Freddie's police work schedule) and their impact on follow-up care.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [4],
        points: [
          "Balances the medical urgency (Ava needs immediate transfer) with Alisha's emotional need to contact Freddie – negotiates a solution that addresses both.",
          "Arranges ambulance first, then discusses with Alisha the best way to communicate with Freddie (e.g., doctor to call him, Alisha to call with doctor available).",
          "Calls another support person to be with Alisha at the hospital.",
          "Recognises that a barrier to care might be domestic violence/fear of safety – explores this sensitively.",
          "Takes account of Alisha's expectations (not wanting conflict) while making clear the child's safety is the primary concern.",
          "Facilitates safe management of the urgent presentation while supporting Alisha emotionally.",
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
    domain: "older_patient",
    difficulty: "challenging",
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
          "Explains bradycardia and possible aortic stenosis in plain language, avoiding jargon – adapts to Evan's farming background and level of health literacy.",
          "Chunks and checks – gives information in manageable pieces and confirms Evan (and Dianne) understand before proceeding.",
          "Discusses possible outcomes and uncertainties of treatment options (e.g. pacemaker may or may not be needed pending echo and Holter results).",
          "Discusses importance of cardiology review and what to expect.",
          "Balanced communication of risks vs benefits – e.g. anticoagulation risk in context of high falls risk.",
          "Addresses farming/work implications and legal considerations (e.g., heavy machinery, driving).",
          "Responds to Evan's frustration and emotional state (feeling useless on the farm) – acknowledges the functional impact on his identity.",
          "Involves Dianne appropriately in the explanation.",
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
    domain: "mental_health",
    difficulty: "complex",
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
          "Uses safe, appropriate, non-judgemental and respectful language throughout the consultation.",
          "Has a patient-centred and holistic approach without stereotyping – avoids making assumptions about Amiel based on her Aboriginal identity.",
          "Outlines appropriate engagement and communication strategies – e.g. allowing silence, not rushing, using plain language.",
          "Avoids assumptions, racist attitudes and inappropriate language at all times.",
          "Avoids dichotomous language (e.g. does not frame choices as binary 'either/or' in a way that disrespects cultural context).",
          "Shows consideration of language barriers and literacy levels – speaks clearly and simply; may use an interpreter if needed.",
          "Responds to Amiel's non-verbal cues (fidgeting, looking at the door, anxiety) – acknowledges them verbally and creates a safe space.",
          "Assesses the patient's understanding of her diagnosis and provides appropriate education in accessible terms.",
          "Adapts language to Amiel's level of understanding – avoids psychiatric jargon.",
        ],
      },
      {
        code: "AH2",
        title: "Integrates cultural perspectives on, and beliefs about, the health and wellbeing of Aboriginal and Torres Strait Islander peoples into holistic clinical practice",
        questions: [1, 2, 3, 4],
        points: [
          "Establishes consent for Aunty Georgina to be present for the whole consultation and to provide collateral history – recognises the importance of family/Aunty in Aboriginal culture.",
          "Considers recent pregnancy and birth trauma, sleep deprivation, family history of schizophrenia and ADHD as contributing factors.",
          "Explores potential cultural explanations for the presentation – does not assume a Western psychiatric framework is the only lens.",
          "Asks about recreational substance use sensitively and without judgement.",
          "Explores social setting and supports – family, community, partner absence, home community identity.",
          "Emphasises the importance of involvement of an Aboriginal and Torres Strait Islander health practitioner or health worker in ongoing care.",
          "Considers culture in offering management options – e.g. Amiel's wish to return to home community is treated as a valid cultural and healing preference, not a risk to be dismissed.",
          "Acknowledges the impact of intergenerational trauma and historical mistrust of health services where relevant.",
        ],
      },
      {
        code: "AH3",
        title: "Appraises and addresses barriers to development of effective therapeutic relationships with Aboriginal and Torres Strait Islander peoples",
        questions: [1, 2, 3],
        points: [
          "Identifies barriers to therapeutic relationship – e.g. mistrust of health services, language, prior negative experiences, geographic isolation, family conflict.",
          "Avoids assumptions, racist attitudes and inappropriate language.",
          "Avoids dichotomous language – frames options in a way that respects Amiel's agency.",
          "Explores social setting and supports, including family and community roles – who Amiel trusts and feels safe with.",
          "Works collaboratively with Aunty Georgina without excluding Amiel or speaking over her.",
          "Creates a culturally safe environment – does not rush, allows silence, demonstrates genuine curiosity about Amiel's perspective.",
          "Addresses practical barriers such as geographic isolation, partner absence, and limited community services when planning care.",
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

  // ───────────────────────────────────────────────────────────────────────────
  // CHEN — Wei, 45M, Chest Pain / Acute Coronary Syndrome
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "chen",
    patientName: "Wei CHEN",
    patientAge: 45,
    patientGender: "M",
    presentingComplaint: "Central chest pain, 2 hours duration, radiating to left arm",
    topics: ["Acute Coronary Syndrome", "STEMI", "Chest Pain", "Cardiovascular Emergency"],
    domain: "undifferentiated",
    difficulty: "complex",
    icpcCode: "K – Cardiovascular",
    year: "2024",
    scenario: `Wei CHEN, 45 years, presents to your general practice with central chest pain that started 2 hours ago. The pain is 7/10 in severity, described as a crushing pressure in the centre of his chest, radiating to his left arm and jaw. He is diaphoretic and looks pale and anxious.

Wei works as a software engineer. He has been under significant work stress over the past 6 months. He takes no regular medications and has never been to a doctor in the past 5 years. He mentions that his father had a heart attack at age 52.

Examination findings:
• Blood pressure: 155/90 mmHg
• Heart rate: 98/min, regular
• Respiratory rate: 18/min
• Oxygen saturation: 96% on room air
• Temperature: 36.9°C
• ECG: ST elevation 2 mm in leads II, III, aVF; reciprocal depression in V1–V3
• Cardiovascular: dual heart sounds, no added sounds or murmurs
• Chest: clear to auscultation`,
    patientRecord: {
      name: "Wei CHEN",
      age: 45,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Nil"],
      pastHistory: ["No significant past history"],
      socialHistory: {
        "Relationship": "Married, two children (ages 8 and 10)",
        "Occupation": "Software engineer (high-stress environment)",
        "Exercise": "Sedentary lifestyle, occasional weekend walking",
      },
      familyHistory: ["Father: Myocardial infarction age 52", "Mother: Type 2 diabetes"],
      smoking: "15 pack-years (1 PPD for 15 years, quit 5 years ago)",
      alcohol: "4–6 standard drinks per week",
      immunisations: ["COVID-19 vaccinations up to date", "Influenza (2 years ago)"],
    },
    questions: [
      {
        number: 1,
        text: "What is your immediate assessment and differential diagnosis for Wei's presentation?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "What do you make of the ECG findings?" },
          { type: "probe", text: "You mentioned [diagnosis] — what features support this?" },
        ],
      },
      {
        number: 2,
        text: "Outline your immediate management in the practice setting.",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What are your immediate priorities?" },
          { type: "prompt", text: "What medications will you give now?" },
          { type: "prompt", text: "How will you arrange transfer?" },
        ],
      },
      {
        number: 3,
        text: "How would you explain the diagnosis and the need for urgent hospital transfer to Wei?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "How do you address Wei's likely anxiety?" },
          { type: "prompt", text: "What would you tell his wife?" },
        ],
      },
      {
        number: 4,
        text: "Wei is discharged from hospital 5 days later following a successful PCI to his right coronary artery. He attends your practice for follow-up. What do you address?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What medications will he now be on and what do you need to check?" },
          { type: "prompt", text: "What lifestyle and risk factor modifications do you discuss?" },
          { type: "prompt", text: "What follow-up and referrals do you arrange?" },
          { type: "probe", text: "He asks about returning to work — what do you advise?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.3",
        title: "Matches communication to patient needs and context",
        questions: [3],
        points: [
          "Explains STEMI diagnosis in plain language — avoids or explains terms like 'infarct', 'coronary', 'catheterisation'.",
          "Uses calm, clear language given Wei's anxiety and acute distress.",
          "Chunks information: what is happening now, what needs to happen next, what to expect.",
          "Addresses Wei's emotional state before overwhelming with clinical detail.",
          "Involves family (wife) appropriately — offers to call her or have her present.",
          "Checks understanding using teach-back or open questions.",
        ],
      },
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [3, 4],
        points: [
          "Provides clear post-discharge safety netting: symptoms warranting emergency presentation (recurrent chest pain, dyspnoea, syncope).",
          "Explains dual antiplatelet therapy (DAPT) duration and importance of adherence.",
          "Arranges cardiac rehabilitation referral.",
          "Plans follow-up echocardiogram, repeat fasting lipids, HbA1c.",
          "Addresses return to work, driving (check state regulations — typically 4–6 weeks off driving).",
        ],
      },
      {
        code: "3.6",
        title: "Formulates a rational list of differential diagnoses",
        questions: [1],
        points: [
          "Most likely: STEMI (inferior — leads II, III, aVF) — right coronary or circumflex territory.",
          "ECG changes (ST elevation in II, III, aVF with reciprocal depression V1–V3) — inferior STEMI until proven otherwise.",
          "Less likely but important: aortic dissection (especially given hypertension, though radiation less typical).",
          "Unlikely: PE (typically with tachycardia and right heart strain pattern), pericarditis (saddle-shaped ST elevation, pleuritic component), severe oesophageal spasm.",
        ],
      },
      {
        code: "10.1",
        title: "A patient with significant illness is identified",
        questions: [1, 2],
        points: [
          "Immediately recognises inferior STEMI as a life-threatening cardiac emergency.",
          "Calls ambulance immediately — does not delay for further investigation.",
          "Administers aspirin 300 mg stat (if no contraindications).",
          "Considers sublingual nitrate if BP adequate and no inferior STEMI-related RV involvement concern.",
          "Applies oxygen only if SpO2 < 94%.",
          "Obtains IV access, monitors cardiac rhythm continuously.",
          "Does NOT attempt thrombolysis in a practice setting with PCI available within appropriate timeframe.",
          "Considers ticagrelor (180 mg loading dose) or clopidogrel per local STEMI protocol.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected",
        questions: [2, 4],
        points: [
          "DAPT: aspirin + ticagrelor (or clopidogrel) — explains rationale and duration (typically 12 months post-PCI).",
          "Beta-blocker for rate control and cardioprotection.",
          "High-intensity statin (atorvastatin 40–80 mg).",
          "ACE inhibitor or ARB for LV protection.",
          "Discusses lifestyle changes: smoking cessation support, cardiac rehabilitation, dietary modification, exercise programme.",
        ],
      },
      {
        code: "5.2",
        title: "Uses planned and opportunistic approaches to provide preventive care",
        questions: [4],
        points: [
          "Addresses all modifiable cardiovascular risk factors: hypertension, dyslipidaemia, family history, sedentary lifestyle, alcohol.",
          "Fasting lipid profile and HbA1c (diabetes screening given family history and age).",
          "Blood pressure target < 130/80 mmHg post-ACS.",
          "Weight and BMI, dietary review, exercise prescription.",
          "Mental health screen — workplace stress is a modifiable risk factor.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.3", description: "Matches communication to patient needs and context", questions: [3] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.11", description: "Safety-netting and specific follow-up arrangements are made", questions: [3, 4] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.6", description: "Formulates a rational list of differential diagnoses", questions: [1] },
      { domain: "Identifying and managing the patient with significant illness", domainNumber: 10, code: "10.1", description: "A patient with significant illness is identified", questions: [1, 2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected", questions: [2, 4] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.2", description: "Uses planned and opportunistic approaches to provide preventive care", questions: [4] },
    ],
    debriefNotes: `The competent candidate immediately recognises inferior STEMI from the ECG (ST elevation II, III, aVF with reciprocal depression V1–V3) and initiates the STEMI management pathway: aspirin 300 mg, ticagrelor loading dose, IV access, continuous monitoring, oxygen if SpO2 < 94%, and immediate ambulance call with pre-notification to the receiving cath lab. They explain the diagnosis clearly to Wei in lay terms, addressing his anxiety calmly while emphasising the urgency of transfer. At follow-up, they address DAPT adherence, lifestyle risk factor modification, cardiac rehabilitation referral, and clear safety netting including return-to-driving guidance.`,
    patientPersona: {
      openingStatement: "Doctor, I've got this awful crushing pain in my chest — it started a couple of hours ago and it won't go away. My left arm and jaw are hurting too.",
      volunteerHistory: [
        "The pain started when I was sitting at my desk at work — about 2 hours ago.",
        "I feel sick in my stomach and I'm really sweaty.",
        "Dad had a heart attack a few years ago so I'm really worried.",
        "I smoke — well, I quit 5 years ago, but I used to smoke a pack a day.",
        "I haven't been to a doctor in years, I know I should have been.",
      ],
      withheldHistory: [
        "I've been having occasional sharp chest pains for the last 3 weeks that lasted a few minutes each time — I ignored them.",
        "I've been taking ibuprofen nearly every day for the last month for back pain.",
        "I've been under massive stress at work — project deadlines and possible redundancies.",
      ],
      ice: {
        ideas: "I think I might be having a heart attack, like my dad did.",
        concerns: "I'm terrified I'm going to die. My kids are only 8 and 10.",
        expectations: "I want someone to do something fast and to know I'm going to be okay.",
      },
      demeanour: "Visibly distressed, pale and sweaty, gripping his chest. He is trying to stay calm but fear is obvious. Short of breath when he talks too much.",
      responseToJargon: "Nods along but looks confused when medical terms are used. Will ask 'what does that mean?' if he feels safe enough to speak up.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NGUYEN — Linh, 32F, Postnatal Depression
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "nguyen",
    patientName: "Linh NGUYEN",
    patientAge: 32,
    patientGender: "F",
    presentingComplaint: "Feeling overwhelmed and tearful since having her baby 6 weeks ago",
    topics: ["Postnatal Depression", "Perinatal Mental Health", "Women's Health", "EPDS"],
    domain: "mental_health",
    difficulty: "standard",
    icpcCode: "P – Psychological",
    year: "2024",
    scenario: `Linh NGUYEN, 32 years, attends for her 6-week postnatal check following the birth of her daughter, Mia. It is Linh's first child. The birth was uncomplicated — normal vaginal delivery at 39 weeks.

Linh's husband, Duc, is present. He appears concerned and has clearly encouraged Linh to attend.

Linh reports feeling tearful most days since coming home from hospital. She describes feeling "not good enough as a mother" and worries constantly that something will happen to Mia. She has difficulty sleeping even when Mia is settled. She has lost interest in activities she previously enjoyed.

Mia is feeding well (formula feeding after Linh stopped breastfeeding at 2 weeks due to difficulty) and is meeting developmental milestones.

Edinburgh Postnatal Depression Scale (EPDS) completed in the waiting room: score 16/30.`,
    patientRecord: {
      name: "Linh NGUYEN",
      age: 32,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Iron supplementation (ferrous sulfate 325 mg daily)"],
      pastHistory: ["Nil significant — no prior mental health history", "G1P1"],
      socialHistory: {
        "Partner": "Duc (35 years, works full-time in construction)",
        "Family support": "In-laws live overseas (Vietnam); own parents 2 hours away",
        "Occupation": "Accountant (on maternity leave)",
        "Living": "Own home, good financial stability",
      },
      familyHistory: ["Mother: depression (treated with medication)"],
      smoking: "Non-smoker",
      alcohol: "Nil (previously occasional social drinker)",
      immunisations: ["Pertussis vaccine (third trimester)", "Influenza (antenatal)"],
    },
    questions: [
      {
        number: 1,
        text: "How do you approach this consultation, and what is your assessment of Linh's presentation?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How do you interpret the EPDS score?" },
          { type: "prompt", text: "What features of her history inform your assessment?" },
          { type: "probe", text: "You mentioned postnatal depression — what features distinguish this from postnatal blues?" },
        ],
      },
      {
        number: 2,
        text: "What further history and assessment would help you clarify Linh's diagnosis and risk?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What safety assessment would you perform?" },
          { type: "prompt", text: "What questions would you ask about bonding with Mia?" },
          { type: "prompt", text: "Are there any physical investigations you would consider?" },
        ],
      },
      {
        number: 3,
        text: "Duc asks whether Linh needs to be admitted to hospital. How do you respond, and what is your management plan?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What treatment options would you discuss with Linh?" },
          { type: "prompt", text: "How does the safety assessment influence your decision?" },
          { type: "prompt", text: "How do you involve Duc in the plan?" },
          { type: "probe", text: "Linh asks about antidepressants and breastfeeding — she is considering restarting. What do you advise?" },
        ],
      },
      {
        number: 4,
        text: "What follow-up, referrals, and safety netting do you arrange for Linh?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "How will you monitor her progress?" },
          { type: "prompt", text: "What community services or support groups might help?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.1",
        title: "Communication is appropriate to the person and sociocultural context",
        questions: [1, 3],
        points: [
          "Opens with empathy — validates that the postnatal period can be extremely difficult.",
          "Creates a safe, non-judgemental space to discuss mental health, particularly given cultural context (Vietnamese background, husband present).",
          "Clarifies with Linh whether she is comfortable discussing her feelings in front of Duc, or would prefer some time alone.",
          "Avoids using the phrase 'you should be happy' or similar — does not minimise the experience.",
          "Explains EPDS score in accessible language — frames it as a tool to help, not a label.",
          "Responds to non-verbal cues (tearfulness, reluctance) with warmth and patience.",
        ],
      },
      {
        code: "2.1",
        title: "A comprehensive biopsychosocial history is taken from the patient",
        questions: [2],
        points: [
          "Mood: duration, trajectory (improving, stable, or worsening), worst point, triggers.",
          "Sleep: pattern, difficulty (initiation vs maintenance vs early waking), hypersomnia.",
          "Appetite and weight changes.",
          "Anhedonia: what she used to enjoy, current interest levels.",
          "Bonding: how she feels when she holds Mia, whether she feels like a 'real mother'.",
          "Thoughts of self-harm or suicide — direct, compassionate questioning.",
          "Thoughts of harming Mia — must be asked (infanticide risk assessment).",
          "Support: who helps at home, Duc's availability, wider family network.",
          "Physical: thyroid function (fatigue, mood changes), anaemia (iron supplementation ongoing).",
          "Cultural factors: expectations of motherhood, isolation from Vietnamese community or family.",
        ],
      },
      {
        code: "3.3",
        title: "Demonstrates diagnostic accuracy",
        questions: [1],
        points: [
          "Postnatal depression: EPDS ≥ 13 is a positive screen; combined with clinical features (6+ weeks duration, functional impairment, anhedonia, sleep disturbance, excessive guilt) meets diagnostic criteria.",
          "Distinguishes from postnatal blues (days 3–5, self-limiting, not functionally impairing).",
          "Considers: postpartum psychosis (no features of hallucinations, delusions, disorganised behaviour — less likely), hypothyroidism (fatigue, mood — warrants TFT).",
          "Considers anaemia as a contributing factor given ongoing iron supplementation.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 4],
        points: [
          "Addresses safety: no admission needed if no active suicidal ideation with plan/intent or immediate risk to Mia — re-evaluate if safety concerns emerge.",
          "Psychological therapies: CBT or IPT — refer to psychologist (Medicare Better Access — 10 sessions).",
          "Antidepressants: first-line sertraline (safe in breastfeeding — low transfer to breast milk). Discusses options with Linh including risks and benefits.",
          "Breastfeeding and antidepressants: sertraline and paroxetine are preferred — low infant serum levels.",
          "Involves Duc constructively: educates about PND, practical support strategies, watching for signs of deterioration.",
          "Links to PANDA (Perinatal Anxiety and Depressive Australia) helpline and peer support groups.",
          "Arranges MCH nurse follow-up and coordinates with maternal and child health.",
          "Discusses self-care: sleep hygiene, gentle exercise, social connection.",
        ],
      },
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [4],
        points: [
          "Review in 1–2 weeks to assess response to initial management.",
          "If antidepressants started: review in 2 weeks for side effects and tolerability, 6 weeks for efficacy.",
          "Clear safety plan: what to do if Linh has thoughts of harming herself or Mia — direct number to call, emergency department, PANDA 1300 726 306.",
          "Duc given clear instructions: contact GP or present to ED if any sudden change in Linh's mental state.",
          "Document safety assessment clearly in records.",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages situations where there are obstacles to duty of care",
        questions: [2, 3],
        points: [
          "Performs structured risk assessment: asks directly about suicidal ideation and thoughts of harming Mia — without these questions, safety cannot be adequately assessed.",
          "Determines whether Mia is currently at risk and whether mandatory reporting to child protection is needed (threshold — significant concern about immediate safety).",
          "If patient declines treatment: explores barriers, attempts to negotiate, documents thoroughly.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.1", description: "Communication is appropriate to the person and sociocultural context", questions: [1, 3] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.11", description: "Safety-netting and specific follow-up arrangements are made", questions: [4] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.1", description: "A comprehensive biopsychosocial history is taken", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.3", description: "Demonstrates diagnostic accuracy", questions: [1] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 4] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages situations where there are obstacles to duty of care", questions: [2, 3] },
    ],
    debriefNotes: `The competent candidate opens empathically, creates privacy to speak with Linh alone, and interprets the EPDS 16 as a positive screen requiring full clinical assessment. They conduct a structured risk assessment (including direct questions about suicidal ideation and thoughts of harming Mia), assess bonding, and investigate thyroid function and anaemia. They distinguish PND from postnatal blues and postpartum psychosis. Management involves a stepped-care approach: psychologist referral (Better Access), sertraline if patient agrees (advising it is compatible with breastfeeding), PANDA support, and Duc education. Safety netting is explicit: 1–2 week review, clear safety plan, PANDA helpline, and ED instructions for Duc.`,
    patientPersona: {
      openingStatement: "I... I don't really know where to start. I should be happy, right? I have a beautiful baby. But I just feel terrible all the time.",
      volunteerHistory: [
        "I cry every day, sometimes for no reason at all.",
        "I can't sleep even when Mia's settled — I just lie there worrying.",
        "I feel like I'm doing everything wrong as a mother.",
        "I stopped breastfeeding because it was really hard and I feel guilty about that.",
        "Duc has been wonderful but he's back at work now and I'm alone a lot.",
      ],
      withheldHistory: [
        "Sometimes I think everyone would be better off without me — I haven't acted on it, but the thought scares me.",
        "I sometimes feel like I don't love Mia the way I'm supposed to — I do things for her but I don't feel that rush of love they talk about.",
        "My mum had depression but we never talked about it — it was seen as weak.",
      ],
      ice: {
        ideas: "I think I might have postnatal depression but I'm not sure — I googled it and some things match.",
        concerns: "I'm scared I'll never feel like myself again. And I'm worried what Duc or the nurse will think.",
        expectations: "I want someone to tell me this is treatable and that I'm not a bad mother.",
      },
      demeanour: "Quiet, tearful, and making little eye contact. She seems ashamed and apologises for crying. Duc sits next to her and holds her hand.",
      responseToJargon: "Nods when she understands, but goes quiet if overwhelmed. Will respond better to simple, warm language and gentle pace.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // PATEL — Rohan, 58M, Type 2 Diabetes Review — Chronic Disease Management
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "patel",
    patientName: "Rohan PATEL",
    patientAge: 58,
    patientGender: "M",
    presentingComplaint: "Annual diabetes review — HbA1c 9.2%, feet tingling, recent weight gain",
    topics: ["Type 2 Diabetes", "Chronic Disease Management", "Diabetic Complications", "Cardiovascular Risk"],
    domain: "chronic_disease",
    difficulty: "standard",
    icpcCode: "T – Endocrine",
    year: "2024",
    scenario: `Rohan PATEL, 58 years, presents for his annual Type 2 diabetes review. He was diagnosed 8 years ago and is managed by you. He works as a taxi driver, 10–12 hours per day, 6 days per week.

Recent results (done last week):
• HbA1c: 9.2% (was 7.8% 12 months ago — significantly elevated)
• eGFR: 62 mL/min/1.73m² (was 74 last year — CKD Stage 2 progressing)
• Urine ACR: 3.8 mg/mmol (elevated — microalbuminuria)
• Fasting LDL: 3.2 mmol/L (above target for high CVD risk)
• Blood pressure today: 148/88 mmHg

Rohan mentions that he has been experiencing tingling and numbness in both feet for the past 3 months. He has gained 7 kg in the past year. He tells you he has not been checking his BSLs as his glucometer broke 4 months ago and he hasn't replaced it.`,
    patientRecord: {
      name: "Rohan PATEL",
      age: 58,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Sulfonamides — rash",
      medications: [
        "Metformin 1000 mg twice daily",
        "Rosuvastatin 10 mg once daily",
        "Perindopril 5 mg once daily",
        "Aspirin 100 mg once daily",
      ],
      pastHistory: [
        "8 years ago: Type 2 diabetes mellitus",
        "6 years ago: Hypertension",
        "5 years ago: Dyslipidaemia",
        "3 years ago: Non-alcoholic fatty liver disease (mild, on ultrasound)",
      ],
      socialHistory: {
        "Relationship": "Married, 3 children (ages 22, 25, 27 — all independent)",
        "Occupation": "Taxi driver (sedentary, shift work, irregular eating)",
        "Diet": "High carbohydrate, frequent takeaway during shifts",
        "Exercise": "Minimal — driving all day",
      },
      familyHistory: ["Father: Type 2 diabetes, died of stroke age 65", "Brother: Ischaemic heart disease (age 55)"],
      smoking: "Non-smoker",
      alcohol: "4 standard drinks per week",
      immunisations: ["Influenza (annual)", "COVID-19 up to date", "Pneumococcal (5 years ago)"],
    },
    questions: [
      {
        number: 1,
        text: "Summarise Rohan's clinical situation and the significance of the changes from last year.",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What do you make of the change in HbA1c?" },
          { type: "prompt", text: "What is the significance of the change in eGFR and the ACR?" },
          { type: "probe", text: "You mentioned renal impairment — how does this affect your prescribing?" },
        ],
      },
      {
        number: 2,
        text: "What further history and examination would you perform at this visit?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "How would you assess the tingling in his feet?" },
          { type: "prompt", text: "What foot examination would you perform?" },
        ],
      },
      {
        number: 3,
        text: "What changes would you make to Rohan's management today?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How would you address the deteriorating glycaemic control?" },
          { type: "prompt", text: "What would you change about his blood pressure management?" },
          { type: "prompt", text: "Are there any medication changes needed given his renal function?" },
          { type: "probe", text: "Would you consider adding an SGLT2 inhibitor or GLP-1 agonist — why or why not?" },
        ],
      },
      {
        number: 4,
        text: "How would you explain these changes to Rohan and negotiate a management plan he can realistically follow given his work schedule?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How do you address his weight gain and diet within the context of his job?" },
          { type: "prompt", text: "What referrals and allied health services would you involve?" },
          { type: "must-use", text: "Rohan says he's too busy to make the changes you are suggesting. How do you respond?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "3.1",
        title: "Integrates and synthesises knowledge to make decisions in complex clinical situations",
        questions: [1, 3],
        points: [
          "Recognises that HbA1c deterioration from 7.8% to 9.2% is clinically significant — likely driven by broken glucometer (no self-monitoring), dietary drift, weight gain, and shift work disruption.",
          "Notes the eGFR decline (74 → 62) with new microalbuminuria — progression of diabetic nephropathy. This changes prescribing options.",
          "Identifies cardiovascular risk: uncontrolled BP, LDL above target, T2DM, albuminuria, family history of CVD — high absolute CVD risk requiring intensification.",
          "Recognises that metformin dose may need review if eGFR drops further — currently still acceptable at eGFR 62 (do not use if < 30; reduce if 30–45).",
        ],
      },
      {
        code: "2.4",
        title: "Physical examination findings are detected accurately and interpreted correctly",
        questions: [2],
        points: [
          "Diabetic peripheral neuropathy assessment: 10-g monofilament test, vibration sense (128 Hz tuning fork), light touch, ankle reflexes.",
          "Foot inspection: skin integrity (calluses, ulcers, fissures), nail changes, interdigital spaces for fungal infection.",
          "Peripheral vascular assessment: foot pulses (dorsalis pedis, posterior tibial), capillary refill.",
          "Blood pressure measurement — confirms hypertension.",
          "BMI and waist circumference.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected",
        questions: [3],
        points: [
          "SGLT2 inhibitor (e.g., empagliflozin, dapagliflozin) — indicated here: proven cardiorenal protection, reduces albuminuria, reduces HbA1c, promotes modest weight loss. Appropriate given eGFR 62 (check product-specific eGFR cutoffs — dapagliflozin eGFR ≥ 25 for renal indication).",
          "Alternatively, GLP-1 agonist (e.g., semaglutide): proven CV benefit, weight loss, HbA1c reduction — good choice given obesity.",
          "Blood pressure: add amlodipine or increase perindopril to 10 mg — target < 130/80 in diabetes with albuminuria.",
          "Statin intensification: rosuvastatin 10 mg → 20–40 mg — LDL target < 1.8 mmol/L for high CVD risk.",
          "Replace glucometer and establish SMBG routine.",
        ],
      },
      {
        code: "4.8",
        title: "Provides effective explanations, education and choices to the patient",
        questions: [4],
        points: [
          "Uses the 'agenda-setting' technique — acknowledges his time constraints and asks what he is able to realistically change.",
          "Explains complications risk in concrete terms the patient understands (kidney disease, blindness, foot amputations, heart attack) — not to frighten, but to motivate informed choice.",
          "Dietary advice tailored to taxi driver: practical tips for shift workers (healthy snacks, avoiding drive-through, meal prepping).",
          "Motivational interviewing approach — explores his readiness for change, importance, confidence.",
          "Engages Rohan as a partner in his health — not lecture-style.",
        ],
      },
      {
        code: "5.3",
        title: "Coordinates a team-based approach",
        questions: [4],
        points: [
          "Diabetes nurse educator or credentialled diabetes educator referral.",
          "Dietitian referral — structured dietary plan for shift workers.",
          "Podiatry referral — neuropathy assessment and preventive foot care.",
          "Ophthalmology/optometry — annual diabetic retinopathy screening.",
          "Cardiologist or renal physician review if progressive CKD or high CVD event risk.",
          "GP Management Plan (GPMP) and Team Care Arrangement (TCA) to subsidise allied health visits.",
        ],
      },
      {
        code: "7.4",
        title: "Demonstrates efficient use of recall systems to optimise health outcomes",
        questions: [4],
        points: [
          "Sets up a structured diabetes recall: 3-monthly HbA1c + BP + ACR given current poor control.",
          "Flags for annual dilated eye exam, foot exam, and full CVD risk review.",
          "GPMP and TCA documentation and review.",
          "Practice system for medication compliance: blister packing, pill organiser, pharmacy dispensing review.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.1", description: "Integrates and synthesises knowledge to make decisions in complex clinical situations", questions: [1, 3] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.4", description: "Physical examination findings are detected accurately and interpreted correctly", questions: [2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected", questions: [3] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.8", description: "Provides effective explanations, education and choices to the patient", questions: [4] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.3", description: "Coordinates a team-based approach", questions: [4] },
      { domain: "General practice systems and regulatory requirements", domainNumber: 7, code: "7.4", description: "Demonstrates efficient use of recall systems", questions: [4] },
    ],
    debriefNotes: `The competent candidate synthesises the clinical picture: deteriorating HbA1c, declining eGFR, new microalbuminuria, hypertension above target, and LDL above high-CVD-risk target — representing progression of diabetic end-organ damage. They assess peripheral neuropathy using monofilament and vibration tests, inspect the feet, and measure BMI. Management is stepped: SGLT2 inhibitor for cardiorenal protection and HbA1c reduction, statin intensification to LDL < 1.8, BP intensification targeting < 130/80, and glucometer replacement with structured SMBG. They communicate with Rohan using motivational interviewing, tailoring advice to his work constraints, and establish a GPMP/TCA for allied health access including diabetes educator, dietitian, podiatrist and ophthalmologist.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // OKONKWO — Adaeze, 28F, Contraception / Sexual Health Consultation
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "okonkwo",
    patientName: "Adaeze OKONKWO",
    patientAge: 28,
    patientGender: "F",
    presentingComplaint: "Requesting contraception change — current pill causing mood changes; also wants STI check",
    topics: ["Contraception", "Sexual Health", "Women's Health", "LARC"],
    domain: "womens_health",
    difficulty: "standard",
    icpcCode: "W – Women's health",
    year: "2024",
    scenario: `Adaeze OKONKWO, 28 years, presents requesting a change in her contraception and an STI screen.

She has been on the combined oral contraceptive pill (COCP) — Microgynon 30 (ethinylestradiol 30 mcg / levonorgestrel 150 mcg) — for 4 years. She reports increasing low mood and irritability in the week before her period over the past 6 months. She wonders if the pill is contributing.

She is in a new relationship (started 4 months ago) and has had unprotected sex twice. She is not concerned about an unplanned pregnancy as she is committed to her pill. She has had a previous chlamydia infection (treated 3 years ago).

Adaeze is interested in "something more reliable and less to think about." She asks specifically about the "implant" and the "coil."

She has no significant past history. Blood pressure today: 118/72 mmHg. BMI: 23.`,
    patientRecord: {
      name: "Adaeze OKONKWO",
      age: 28,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Microgynon 30 (ethinylestradiol / levonorgestrel) — daily"],
      pastHistory: ["3 years ago: Chlamydia trachomatis — treated with azithromycin"],
      socialHistory: {
        "Relationship": "New relationship (4 months), single male partner",
        "Occupation": "Marketing manager",
        "Lifestyle": "Non-smoker, socially active, exercises regularly",
      },
      familyHistory: ["Mother: breast cancer (age 52)", "No other relevant family history"],
      smoking: "Non-smoker",
      alcohol: "8–10 standard drinks per week (mostly on weekends)",
      immunisations: ["HPV vaccine completed (at age 12)", "COVID-19 up to date"],
    },
    questions: [
      {
        number: 1,
        text: "How do you approach Adaeze's concern about mood changes on the pill?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "How do you assess whether the COCP is responsible?" },
          { type: "probe", text: "She mentions her mother had breast cancer — does this affect your contraceptive choices?" },
        ],
      },
      {
        number: 2,
        text: "What does the STI screen involve, and how do you approach this sensitively?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "What specific tests would you request?" },
          { type: "prompt", text: "How do you take a sexual history in a non-judgmental way?" },
        ],
      },
      {
        number: 3,
        text: "Adaeze asks about the implant and the IUD. How do you counsel her about long-acting reversible contraception options?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How does the etonogestrel implant compare to the IUD for her situation?" },
          { type: "prompt", text: "What are the key differences between the hormonal and copper IUD?" },
          { type: "probe", text: "She is concerned about the 'coil' being painful to insert — how do you address this?" },
          { type: "probe", text: "Does her family history of breast cancer influence your recommendation?" },
        ],
      },
      {
        number: 4,
        text: "Adaeze decides she would like the etonogestrel implant. What do you do next, and what advice do you give her?",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "Can you insert the implant today?" },
          { type: "prompt", text: "What counselling does she need before and after insertion?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.8",
        title: "Adapts the consultation to facilitate optimal patient care",
        questions: [2],
        points: [
          "Takes a structured sexual history using 'the five Ps' or equivalent: partners (number, gender), practices (protected/unprotected, anal/oral/vaginal), past STIs, pregnancy intention, protection.",
          "Uses normalising language: 'I ask everyone these questions routinely...'",
          "Does not make assumptions about gender of partner or sexual practices.",
          "Addresses confidentiality proactively.",
          "Allows patient to guide level of detail — does not over-interrogate.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected",
        questions: [3],
        points: [
          "Etonogestrel implant: 3-year progestogen-only LARC, 99.95% efficacy, no daily adherence burden, may reduce hormonal fluctuation implicated in PMDD. Common side effect: irregular bleeding. Does not affect bone density. Not contraindicated by family history of breast cancer (theoretical caution applies to all hormonal methods).",
          "Levonorgestrel IUD (Mirena): 5-year LARC, same efficacy, often causes amenorrhoea, requires minor procedural insertion, mildly uncomfortable — requires informed consent for pain management.",
          "Copper IUD: non-hormonal, 10-year LARC — good choice if patient wants to avoid all hormones. Heavier periods common.",
          "Confirms COCP is NOT absolutely contraindicated by first-degree family history of breast cancer — reassesses risk-benefit with patient.",
          "Progestogen-only pill (minipill) — lower mood impact but requires strict timing — does not address LARC preference.",
        ],
      },
      {
        code: "2.5",
        title: "Specific positive and negative findings are elicited",
        questions: [2],
        points: [
          "STI screen for unprotected sex in new relationship + previous chlamydia: first-void urine PCR for chlamydia and gonorrhoea; vaginal swab (self-collected or practitioner-collected) for chlamydia, gonorrhoea, Mycoplasma genitalium; serological testing for HIV, syphilis, hepatitis B and C.",
          "Cervical screening test (Pap smear equivalent) — check if due (every 5 years after negative HPV test from age 25).",
          "HPV vaccination status confirmed.",
        ],
      },
      {
        code: "4.8",
        title: "Provides effective explanations, education and choices to the patient",
        questions: [3, 4],
        points: [
          "Explains the implant insertion procedure: local anaesthetic, small incision in upper arm, rod inserted subdermally — usually well tolerated.",
          "Discusses bleeding pattern changes: irregular spotting common in first 3 months — reassures patient.",
          "Explains that the implant can be inserted on day 1–5 of menstrual cycle for immediate contraceptive cover, or at any point with additional contraception for 7 days.",
          "Ensures written information is provided.",
          "Addresses her concern about breast cancer: acknowledges her worry, explains current evidence does not show a causal increase in risk with progestogen-only LARC.",
        ],
      },
      {
        code: "5.1",
        title: "Implements screening and prevention strategies",
        questions: [2, 4],
        points: [
          "Cervical screening — check status, recommend if due.",
          "HIV, syphilis, hepatitis B serology — appropriate given new partner.",
          "Hepatitis B vaccination if non-immune.",
          "Discusses consistent condom use for STI prevention — LARC does not protect against STIs.",
          "Contact tracing discussion if STI found.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.8", description: "Adapts the consultation to facilitate optimal patient care", questions: [2] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.5", description: "Specific positive and negative findings are elicited", questions: [2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected", questions: [3] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.8", description: "Provides effective explanations, education and choices to the patient", questions: [3, 4] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.1", description: "Implements screening and prevention strategies", questions: [2, 4] },
    ],
    debriefNotes: `The competent candidate takes a non-judgemental sexual history using normalising language, orders a comprehensive STI screen including chlamydia/gonorrhoea PCR, Mycoplasma genitalium, HIV, syphilis, and hepatitis serology. They address the COCP mood concern (PMDD/premenstrual exacerbation is a recognised side effect) and counsel Adaeze on LARC options: the etonogestrel implant (ideal given LARC preference, no daily burden, may reduce hormonal fluctuation) versus the IUDs. They explain insertion procedure, common bleeding pattern changes, and the STI protection caveat. Family history of breast cancer is addressed — not an absolute contraindication but discussed openly. Cervical screening status is checked.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // WILSON — Thomas, 72M, Dementia / Driving Fitness Assessment
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "wilson",
    patientName: "Thomas WILSON",
    patientAge: 72,
    patientGender: "M",
    presentingComplaint: "Concerns about memory and fitness to drive — raised by wife",
    topics: ["Dementia", "Cognitive Impairment", "Driving Fitness", "Difficult Conversation", "Older Patients"],
    domain: "difficult_conversation",
    difficulty: "challenging",
    icpcCode: "P – Psychological",
    year: "2024",
    scenario: `Thomas WILSON, 72 years, attends with his wife, Margaret (69). Margaret has requested the appointment. Thomas appears relaxed and tells you he is "perfectly fine" and that Margaret worries too much.

Margaret tells you privately (before the consultation) that Thomas has been getting lost while driving to familiar places twice in the past month, forgot to turn off the stove twice, and cannot recall conversations from the previous day. He gave money to a door-to-door salesman they later discovered was a scammer.

Thomas has been driving for 50 years with no accidents. He currently drives daily — he drops Margaret off at her book club and does the grocery shopping.

MMSE (administered by your practice nurse): 22/30. GPCOG carer score: 6/9 (significant impairment on multiple items).

Examination: No focal neurological signs. Blood pressure 138/82 mmHg. No signs of Parkinsonism. Cranial nerves intact.`,
    patientRecord: {
      name: "Thomas WILSON",
      age: 72,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Penicillin — anaphylaxis",
      medications: [
        "Atorvastatin 40 mg once daily",
        "Amlodipine 5 mg once daily",
        "Aspirin 100 mg once daily",
      ],
      pastHistory: [
        "5 years ago: Hypertension",
        "4 years ago: Dyslipidaemia",
        "1 year ago: Mild cognitive impairment (documented, monitoring only)",
      ],
      socialHistory: {
        "Relationship": "Married to Margaret (55 years)",
        "Children": "Two adult children (interstate)",
        "Occupation": "Retired carpenter",
        "Hobbies": "Gardening, fishing, driving to the coast on weekends",
      },
      familyHistory: ["Father: Alzheimer's disease (age 78)"],
      smoking: "Non-smoker",
      alcohol: "2 standard drinks per day",
      immunisations: ["Influenza (annual)", "COVID-19 up to date", "Shingrix (1 year ago)"],
    },
    questions: [
      {
        number: 1,
        text: "What is your assessment of Thomas's cognitive status and what does it mean clinically?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How do you interpret the MMSE 22/30 and the GPCOG carer score?" },
          { type: "prompt", text: "What differential diagnoses are you considering?" },
          { type: "probe", text: "What investigations would help clarify the diagnosis?" },
        ],
      },
      {
        number: 2,
        text: "How do you address the driving fitness concern with Thomas?",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "What is your legal and ethical obligation regarding Thomas's driving?" },
          { type: "prompt", text: "How do you approach this conversation sensitively, given Thomas's denial?" },
          { type: "probe", text: "Thomas becomes angry and refuses to stop driving. What do you do?" },
          { type: "probe", text: "What are your mandatory reporting obligations in your jurisdiction?" },
        ],
      },
      {
        number: 3,
        text: "What is your management plan for Thomas's cognitive impairment?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What further investigations would you arrange?" },
          { type: "prompt", text: "Would you refer Thomas to a specialist, and if so, to whom?" },
          { type: "prompt", text: "What support does Margaret need?" },
        ],
      },
      {
        number: 4,
        text: "Thomas asks if there is medication that can help his memory. How do you respond?",
        timingMinutes: 2,
        prompts: [
          { type: "probe", text: "You mentioned cholinesterase inhibitors — who would prescribe these, and what monitoring is needed?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "3.3",
        title: "Demonstrates diagnostic accuracy",
        questions: [1],
        points: [
          "MMSE 22/30 suggests mild-moderate cognitive impairment. GPCOG carer score 6/9 (significant concern). Combined with functional decline (getting lost, forgetting stove, financial vulnerability) — this exceeds mild cognitive impairment (MCI) threshold and is consistent with dementia.",
          "Most likely: Alzheimer's disease (progressive, insidious, family history).",
          "Less likely: vascular dementia (hypertension is a risk factor — check for stepwise history), Lewy body dementia (no Parkinsonism, no visual hallucinations), frontotemporal dementia (more prominent behaviour/language changes).",
          "Must rule out reversible causes: hypothyroidism, B12/folate deficiency, depression-related pseudodementia, medication effects (e.g., anticholinergic burden), normal pressure hydrocephalus (gait, incontinence — not described here).",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages clinical situations where there are obstacles to duty of care",
        questions: [2],
        points: [
          "GP has a duty to notify the relevant authority (state licensing authority, e.g., VicRoads) if they believe a patient is unfit to drive and the patient refuses to stop — this duty supersedes patient confidentiality.",
          "Discusses this with Thomas first: empathic, respectful, explains the reason (safety for himself and others).",
          "Does NOT simply collude with Thomas's minimisation to avoid conflict.",
          "If Thomas refuses: GP documents the conversation, warns the patient of the intended notification, and proceeds with mandatory reporting.",
          "Considers OT driver assessment: formal on-road assessment may be appropriate as an intermediate step if Thomas insists on driving.",
          "Addresses the safety issue with Margaret separately if appropriate.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [2, 3],
        points: [
          "Acknowledges Thomas's perspective (his identity is tied to independence and driving).",
          "Balances empathy with the safety obligation — does not capitulate under pressure.",
          "Involves Margaret appropriately — she is both a carer and a person with her own needs.",
          "Negotiates alternatives to driving: community transport, lift from family, taxis.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 4],
        points: [
          "Investigations: FBC, UEC, TFT, B12, folate, LFTs, fasting glucose, urinalysis.",
          "Neuroimaging: CT brain (basic) or MRI brain (preferred — more sensitive for vascular lesions, hippocampal atrophy).",
          "Referral to geriatrician or neurologist for formal dementia assessment and diagnosis.",
          "Dementia Australia resources: information, carer support, helpline.",
          "Advance care planning discussion — appropriate at early-to-moderate stage.",
          "Medication review — anticholinergic burden, polypharmacy, sedatives.",
          "Cholinesterase inhibitors (donepezil, rivastigmine, galantamine): for confirmed Alzheimer's, initiated by specialist. Modest benefit in slowing progression. Not a cure. Side effects: GI, bradycardia.",
          "Carer assessment: Margaret is carrying a significant load — carer support, respite, ACAT referral.",
        ],
      },
      {
        code: "1.3",
        title: "Matches communication to patient needs and context",
        questions: [2, 4],
        points: [
          "Explains cognitive test results sensitively — avoids bluntly saying 'you have dementia' without appropriate groundwork.",
          "Uses language that respects Thomas's autonomy while being honest about his performance.",
          "Frames the driving conversation in terms of concern for his safety and the safety of others — not as punishment or judgment.",
          "Checks Thomas's understanding of what has been discussed — uses teach-back where appropriate.",
          "Responds to Thomas's anger calmly and without defensiveness.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.3", description: "Demonstrates diagnostic accuracy", questions: [1] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages clinical situations where there are obstacles to duty of care", questions: [2] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.10", description: "Prioritises problems, attending to both the patient's and the doctor's agendas", questions: [2, 3] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.3", description: "Matches communication to patient needs and context", questions: [2, 4] },
    ],
    debriefNotes: `The competent candidate synthesises MMSE 22/30, GPCOG carer score 6/9, and the functional history (getting lost, stove, financial scam) to conclude this represents dementia (likely Alzheimer's), not MCI. They investigate reversible causes (TFT, B12, UEC, CT/MRI brain) and refer to geriatrician. The driving conversation is handled honestly: the GP explains the safety concern, acknowledges Thomas's identity investment in driving, and navigates his refusal by outlining the mandatory notification pathway clearly and without anger. A formal OT driving assessment is offered as an intermediate step. Management includes specialist referral, advance care planning, carer support for Margaret, and discussion of cholinesterase inhibitors (to be initiated by specialist). Cholinesterase inhibitor counselling is accurate: modest benefit, not a cure, initiated by specialist after confirmed diagnosis.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HENDERSON — Graham, 52M, Alcohol Use Disorder + Motivational Interviewing
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "henderson",
    patientName: "Graham HENDERSON",
    patientAge: 52,
    patientGender: "M",
    presentingComplaint: "Tiredness and poor sleep — alcohol use identified on screening",
    topics: ["Alcohol Use Disorder", "Motivational Interviewing", "Stages of Change", "Brief Intervention", "Withdrawal", "Behaviour Change"],
    domain: "difficult_conversation",
    difficulty: "challenging",
    icpcCode: "P – Psychological",
    year: "2025",
    scenario: `Graham HENDERSON, 52 years, presents requesting a repeat prescription for temazepam. He mentions he has been feeling "run down" and sleeping poorly for several months. His partner Diane recently told him she would leave if "things don't change."

You administer the AUDIT-C opportunistically. Graham scores 9/12, indicating hazardous alcohol use. When asked, he estimates he drinks "about 6 to 8 beers a night" plus more on weekends — approximately 40–50 standard drinks per week.

He works as a site supervisor for a construction company and believes his drinking is "just what blokes do in this industry." He denies any blackouts, morning shakes, or seizure history. He says he could "stop any time" but does not see why he should need to.

On examination:
• Blood pressure 158/96 mmHg (elevated)
• BMI 29.5
• Mild hepatomegaly on palpation
• No jaundice, no asterixis, no spider naevi`,
    patientRecord: {
      name: "Graham HENDERSON",
      age: 52,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Temazepam 10 mg nocte (short-term script, 2 months ago)"],
      pastHistory: [
        "3 years ago: Hypertension — not on treatment, lost to follow-up",
        "1 year ago: Gout (single episode, managed with NSAIDs)",
      ],
      socialHistory: {
        "Relationship": "De facto partner Diane (8 years); no children",
        "Occupation": "Construction site supervisor — shift work, irregular hours",
        "Housing": "Owns home with Diane",
        "Support": "Limited social support outside of work peers",
      },
      familyHistory: [
        "Father: alcohol use disorder, died of cirrhosis age 61",
        "Mother: Type 2 diabetes",
      ],
      smoking: "Current smoker — 15 cigarettes per day (30 pack-years)",
      alcohol: "40–50 standard drinks per week (self-reported); AUDIT-C 9/12",
      immunisations: ["Influenza (2 years ago)", "COVID-19 up to date", "Hepatitis B — not documented, status unknown"],
    },
    questions: [
      {
        number: 1,
        text: "What further history, examination and investigations would you undertake to assess Graham's alcohol use?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What screening tool would you use and what does it assess?" },
          { type: "prompt", text: "What examination findings are relevant in this context?" },
          { type: "probe", text: "You mentioned liver disease — what investigations would help clarify this?" },
        ],
      },
      {
        number: 2,
        text: "Graham's AUDIT score is 26/40, indicating harmful/dependent drinking. GGT is 3x the upper limit of normal. How do you approach a brief intervention with Graham?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What framework would you use for the brief intervention?" },
          { type: "prompt", text: "Graham says he doesn't think he has a problem. How do you respond?" },
          { type: "must-use", text: "Graham asks: 'Are you saying I'm an alcoholic?' How do you respond?" },
        ],
      },
      {
        number: 3,
        text: "Graham acknowledges he 'probably drinks too much' but refuses any referral. He says he will 'cut back on his own.' How do you use motivational interviewing to work with his ambivalence?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How would you apply the OARS framework here?" },
          { type: "probe", text: "On a scale of 0–10, Graham rates his readiness to change as 4. How do you respond to that number?" },
          { type: "prompt", text: "How do you explore the discrepancy between his drinking and his relationship concerns?" },
        ],
      },
      {
        number: 4,
        text: "Graham returns 4 weeks later. He has been trying to cut back but is now experiencing tremor, sweating and anxiety each morning. He asks if it is safe to just stop drinking suddenly. Discuss your management.",
        timingMinutes: 4,
        prompts: [
          { type: "prompt", text: "How do you assess his withdrawal severity?" },
          { type: "prompt", text: "What is your pharmacological approach to alcohol withdrawal?" },
          { type: "probe", text: "He declines hospital admission. How do you manage community-based withdrawal safely?" },
          { type: "prompt", text: "What longer-term pharmacotherapy and support would you discuss?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "2.1",
        title: "A comprehensive biopsychosocial history is taken",
        questions: [1],
        points: [
          "Quantifies alcohol intake using standard drinks and AUDIT/AUDIT-C — does not rely on vague self-report alone.",
          "Screens for alcohol dependence features: morning drinking, tremor/sweats on waking, seizure or DT history, relief drinking.",
          "Explores psychosocial context: occupational culture normalising heavy drinking, relationship strain, family history of AUD.",
          "Assesses smoking and other substance use concurrently.",
          "Takes targeted examination: blood pressure, BMI, signs of liver disease (hepatomegaly, jaundice, spider naevi, asterixis), peripheral neuropathy.",
          "Requests relevant investigations: LFTs (GGT, ALT, AST), FBC (MCV), UEC, glucose, hepatitis B/C serology, fasting lipids.",
        ],
      },
      {
        code: "1.8",
        title: "Adapts the consultation to facilitate optimal patient care",
        questions: [2, 3],
        points: [
          "Uses non-judgemental, empathic language — avoids labels such as 'alcoholic' or 'problem drinker' unless the patient uses them first.",
          "Normalises the conversation: 'I ask all my patients about alcohol as part of their overall health check.'",
          "Acknowledges the occupational and cultural context without condoning the level of intake.",
          "Uses the AUDIT result as objective data to open discussion without triggering defensiveness.",
          "Responds to Graham's question about the word 'alcoholic' with accurate, non-stigmatising language: 'We use the term alcohol use disorder — it describes a pattern where alcohol is affecting your health and relationships.'",
          "Paces the consultation to Graham's readiness — does not rush to action planning before he is ready.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 4],
        points: [
          "Applies motivational interviewing — uses OARS: open questions, affirmations, reflective listening, and summary statements.",
          "Explores importance and confidence separately: 'How important is it for you to change, and how confident do you feel that you could?'",
          "Develops discrepancy between Graham's stated values (relationship with Diane, work safety) and current behaviour — without confrontation.",
          "For withdrawal: assesses severity using CIWA-Ar scale; identifies this patient as moderate-high risk (tremor, sweating, no previous seizure history — but family history and heavy intake).",
          "Explains community withdrawal protocol: diazepam reducing regimen with daily GP review, Diane present as support person, clear return-to-ED criteria (seizure, confusion, fever).",
          "Offers adjunctive thiamine (Vitamin B1) supplementation to prevent Wernicke's encephalopathy.",
          "Discusses post-withdrawal pharmacotherapy options: naltrexone (first-line if no opioid use), acamprosate (good tolerability, renal caution), disulfiram (last resort; requires monitoring).",
        ],
      },
      {
        code: "5.6",
        title: "Educates patients and families in disease management and health-promotion skills",
        questions: [2, 4],
        points: [
          "Explains standard drink definition and Australian Low Risk Drinking Guidelines (no more than 10 per week, no more than 4 on any one day).",
          "Explains withdrawal risk clearly: 'Stopping suddenly when you drink this much can cause seizures — it is not safe without supervision.'",
          "Provides written resources and self-help tools (e.g. Hello Sunday Morning / Daybreak app, SMART Recovery).",
          "Addresses smoking cessation opportunistically — 'You mentioned you also smoke; when you're ready, I'd like to support that too.'",
          "Discusses Diane's role as a support person — with Graham's permission, offers a joint review appointment.",
          "Refers to addiction medicine specialist or alcohol and drug counsellor if Graham is willing.",
        ],
      },
      {
        code: "1.11",
        title: "Safety-netting and specific follow-up arrangements are made",
        questions: [4],
        points: [
          "Provides explicit return-to-ED criteria during community withdrawal: seizure, severe confusion, high temperature, unable to keep down fluids.",
          "Schedules daily review while on diazepam withdrawal protocol.",
          "Arranges review of LFTs, blood pressure and hepatitis serology at 4–6 weeks.",
          "Outlines structured follow-up plan for post-withdrawal support: counselling, peer support, pharmacotherapy review.",
          "Documents the consultation thoroughly including AUDIT score, clinical findings, advice given, and patient's expressed readiness.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.1", description: "A comprehensive biopsychosocial history is taken", questions: [1] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.8", description: "Adapts the consultation to facilitate optimal patient care", questions: [2, 3] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 4] },
      { domain: "Preventive and population health", domainNumber: 5, code: "5.6", description: "Educates patients and families in disease management and health-promotion skills", questions: [2, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.11", description: "Safety-netting and specific follow-up arrangements are made", questions: [4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies therapeutic options selected", questions: [4] },
    ],
    debriefNotes: `The competent candidate quantifies intake using AUDIT and standard drinks, identifies features of physical dependence (morning tremor, sweating), and investigates for end-organ damage (LFTs, MCV, hepatitis serology). They conduct a skilled motivational interviewing consultation — developing discrepancy, reflecting ambivalence, and avoiding confrontation — rather than prescribing or lecturing. For withdrawal, they correctly identify community suitability criteria, prescribe a reducing diazepam regimen with daily review, add thiamine supplementation, and provide clear ED return criteria. Post-withdrawal, they discuss naltrexone or acamprosate and arrange addiction counselling or specialist referral.`,
    patientPersona: {
      openingStatement: "Look, I just need the temazepam renewed — I'm not sleeping well. Nothing else is wrong.",
      volunteerHistory: [
        "I've been pretty tired lately. Work's been full-on.",
        "Diane's been on my back about a few things. It's just stress.",
        "I might have a few beers after work to wind down — that's normal in construction.",
      ],
      withheldHistory: [
        "He wakes most mornings feeling shaky and sweaty but attributes this to 'needing coffee.'",
        "He had a blackout 6 months ago that he hasn't told anyone about.",
        "He has been drinking alone after Diane goes to bed.",
        "His father died of cirrhosis — he knows this but hasn't connected it to himself.",
      ],
      ice: {
        ideas: "He believes he is just a social drinker who handles stress with alcohol, which is normal for his industry.",
        concerns: "He is worried that if he admits the drinking is a problem, he will be forced to stop completely and lose his social identity at work.",
        expectations: "He came for temazepam, not to discuss his drinking — he will be defensive if approached bluntly.",
      },
      demeanour: "Defensive and self-deprecating, with occasional humour to deflect. Softens when his relationship with Diane is acknowledged. Responds well to respect and curiosity rather than advice.",
      responseToJargon: "Nods along but disengages — plain language essential. Do not use terms like 'hepatic encephalopathy' or 'AUD criteria' without explanation.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CALDWELL — Dorothy, 79F, Elder Abuse + Advance Care Planning
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "caldwell",
    patientName: "Dorothy CALDWELL",
    patientAge: 79,
    patientGender: "F",
    presentingComplaint: "Follow-up for COPD — son attends and answers all questions; bruising noted",
    topics: ["Elder Abuse", "Advance Care Planning", "AHD", "EPOA", "Substitute Decision-Making", "Capacity Assessment", "COPD", "Mandatory Reporting"],
    domain: "older_patient",
    difficulty: "complex",
    icpcCode: "R – Respiratory",
    year: "2025",
    scenario: `Dorothy CALDWELL, 79 years, attends for a routine COPD review. She is accompanied by her adult son Kevin (52), who drove her to the appointment. Kevin sits between Dorothy and you at the desk.

When you ask Dorothy how she has been feeling, Kevin answers: "She's fine. Just needs her puffer prescription renewed." Each time you direct a question to Dorothy, Kevin either answers for her or places his hand on her arm and says "She gets confused — I handle everything."

Dorothy makes brief eye contact with you but does not speak. You notice she has faded yellow-green bruising on both forearms, which Kevin says is from "bumping into things."

Dorothy's recent spirometry shows GOLD Stage 3 COPD (FEV1 42% predicted). She has been admitted to hospital twice in the past 12 months for exacerbations. There is no advance health directive (AHD) or enduring power of attorney (EPOA) on file.

Observations today:
• Blood pressure 142/88 mmHg
• SpO2 91% on room air
• Weight loss of 3 kg since last visit 3 months ago`,
    patientRecord: {
      name: "Dorothy CALDWELL",
      age: 79,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Penicillin — rash",
      medications: [
        "Tiotropium 18 mcg inhaler — once daily",
        "Salbutamol 100 mcg MDI — as needed",
        "Prednisolone 5 mg — maintenance (last 6 months)",
        "Pantoprazole 40 mg — once daily",
        "Osteoporosis not yet managed",
      ],
      pastHistory: [
        "15 years ago: COPD — progressive, GOLD Stage 3",
        "8 years ago: Osteoporosis (DEXA confirmed; no bisphosphonate started)",
        "3 years ago: Right hip fracture — ORIF; slow rehabilitation",
        "2 years ago: Depression — sertraline, ceased 12 months ago",
      ],
      socialHistory: {
        "Living arrangement": "Lives alone since husband passed 4 years ago; Kevin lives 10 minutes away",
        "Independence": "Previously independent with ADLs; increasingly reliant on Kevin for shopping and transport",
        "Kevin's role": "Self-described sole carer; controls her finances 'to help manage her pension'",
        "Social contact": "Limited — has not seen her daughter in 6 months (Kevin states daughter 'upset the family')",
      },
      familyHistory: ["Husband: emphysema, deceased", "Daughter: estranged (reason unclear)"],
      smoking: "Ex-smoker — ceased 10 years ago (40 pack-years)",
      alcohol: "Nil",
      immunisations: ["Influenza (annual, last 8 months ago)", "Pneumococcal (PCV20, 2 years ago)", "COVID-19 up to date"],
    },
    questions: [
      {
        number: 1,
        text: "What concerns you about this presentation, and how do you manage the dynamics of this consultation?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What features raise the possibility of elder abuse?" },
          { type: "prompt", text: "How do you create an opportunity to speak with Dorothy alone?" },
          { type: "probe", text: "Kevin refuses to leave the room, saying Dorothy needs him present. How do you respond?" },
        ],
      },
      {
        number: 2,
        text: "You successfully speak with Dorothy privately. She discloses that Kevin has grabbed her arms roughly when she 'doesn't do what he says,' but insists she does not want to make trouble. What are your next steps?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What is your legal and ethical obligation in this situation?" },
          { type: "must-use", text: "Dorothy says: 'Please don't tell anyone — Kevin is all I have.' How do you respond?" },
          { type: "probe", text: "Does Dorothy have capacity to make this decision? How do you assess this?" },
        ],
      },
      {
        number: 3,
        text: "Dorothy has capacity. She is willing to engage with ACP given her recent hospitalisations. How do you initiate advance care planning, and what documents are relevant?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What is an advance health directive and how does it differ from an EPOA?" },
          { type: "prompt", text: "What specific goals-of-care conversation would you have with Dorothy given her COPD stage?" },
          { type: "probe", text: "Dorothy asks: 'If I can't breathe — will they put me on a machine?' How do you respond?" },
        ],
      },
      {
        number: 4,
        text: "Six months later, Dorothy is admitted to hospital with a severe exacerbation and loses capacity. Her completed AHD states 'no CPR, no mechanical ventilation.' Kevin arrives at the hospital demanding full resuscitation and threatens to sue. How is this situation managed?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What is the legal status of the AHD in this situation?" },
          { type: "prompt", text: "How do you support the treating team and Dorothy's wishes?" },
          { type: "probe", text: "What role does the guardian or tribunal play if there is ongoing dispute?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.1",
        title: "Communication is appropriate to the person and the sociocultural context",
        questions: [1, 2],
        points: [
          "Recognises that Kevin's presence is controlling the consultation and actively works to create a private space for Dorothy.",
          "Uses gentle, non-confrontational language when addressing Kevin: 'I make it a routine to speak with all my patients privately for part of the consultation — it's standard practice.'",
          "Addresses Dorothy directly, at her pace, using plain language — does not talk around her or to Kevin.",
          "Acknowledges Dorothy's fear and validates her loyalty to Kevin without dismissing the disclosure: 'I can hear how much you care about Kevin. My job is to make sure you're safe.'",
          "Avoids jargon in the ACP conversation — replaces 'mechanical ventilation' with 'a breathing machine' and explains what CPR involves in plain terms.",
          "Explores Dorothy's values and what matters most to her: comfort, being at home, not being a burden — and uses these to anchor the ACP discussion.",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages clinical situations where there are obstacles to duty of care",
        questions: [2],
        points: [
          "Identifies this as a likely elder abuse situation — physical abuse (bruising from grabbing) and financial control are present.",
          "Understands the mandatory reporting framework: in Queensland, mandatory reporting of elder abuse applies where the patient is in a residential aged care facility; for community-dwelling patients, there is a duty to report if there is immediate risk of serious harm.",
          "Explores Dorothy's capacity using a structured approach: can she understand and retain the information, weigh the consequences, and communicate a decision?",
          "Explains confidentiality and its limits clearly: 'Normally everything you tell me stays between us. If I'm worried someone might be seriously hurt, I may need to involve others — but I will discuss this with you first.'",
          "Identifies resources: GP elder abuse helpline, social worker referral, Adult Guardian, Seniors Legal and Support Service (QSLS).",
          "Documents findings meticulously — uses body diagram for bruising, records Dorothy's exact words, notes Kevin's behaviours.",
        ],
      },
      {
        code: "4.7",
        title: "A patient-centred and comprehensive management plan is developed",
        questions: [3, 4],
        points: [
          "Initiates ACP at a time when Dorothy has capacity — frames it positively: 'Planning ahead means your wishes will be followed even if you can't speak for yourself.'",
          "Explains the Advance Health Directive (AHD): a legally binding document specifying treatment preferences for specific conditions if the person loses capacity.",
          "Explains the Enduring Power of Attorney (EPOA): appoints a trusted person to make financial and/or personal/health decisions — notes that Kevin may not be the appropriate choice given the abuse disclosure.",
          "Explores ceiling of care: given GOLD Stage 3 COPD with two hospitalisations, discusses realistic prognosis, preference for comfort-focused care, hospital avoidance plan.",
          "For Q4: explains that a valid, applicable AHD is legally binding in Queensland — the treating team must follow it. Kevin does not have authority to override it unless he holds a valid EPOA for health matters.",
          "Supports the treating team by documenting the AHD clearly in My Health Record and providing a copy to the hospital.",
          "Involves palliative care team, social worker, and patient advocate as appropriate.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [1, 2],
        points: [
          "Balances the immediate COPD review with the safeguarding concern — recognises the abuse concern is the higher clinical priority.",
          "Does not dismiss the COPD management but defers detailed puffer review until the safety situation is addressed.",
          "Navigates Kevin's hostility without escalating conflict — maintains calmness and does not make accusations.",
          "Recognises Dorothy's stated wish (do not report) as a valid value to explore, not an instruction to ignore risk.",
          "Identifies the competing interests: Dorothy's autonomy, Kevin's role, and the GP's duty of care — and navigates these transparently.",
        ],
      },
      {
        code: "3.1",
        title: "Integrates and synthesises knowledge to make decisions in complex clinical situations",
        questions: [3, 4],
        points: [
          "Integrates COPD stage (GOLD 3, FEV1 42%, two hospitalisations) with frailty indicators (weight loss, functional dependence) to establish prognosis context for ACP.",
          "Recognises that corticosteroid use increases fracture and infection risk — osteoporosis is undertreated (no bisphosphonate).",
          "Understands AHD legal hierarchy: valid, applicable AHD overrides family demands in Queensland under the Powers of Attorney Act 1998.",
          "Distinguishes between the EPOA (decision-maker when incapacitated) and the AHD (patient's own pre-written instructions) — recognises they can conflict and explains the resolution process.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.1", description: "Communication is appropriate to the person and the sociocultural context", questions: [1, 2] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.10", description: "Prioritises problems, attending to both the patient's and the doctor's agendas", questions: [1, 2] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages clinical situations where there are obstacles to duty of care", questions: [2] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.7", description: "A patient-centred and comprehensive management plan is developed", questions: [3, 4] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.1", description: "Integrates and synthesises knowledge to make decisions in complex clinical situations", questions: [3, 4] },
    ],
    debriefNotes: `The competent candidate recognises multiple red flags for elder abuse — controlling carer behaviour, bilateral forearm bruising in an isolated elderly patient — and uses a practised technique to create a private consultation space without triggering conflict. They assess Dorothy's capacity, document the disclosure meticulously, and navigate the tension between her stated wish for privacy and their duty of care by exploring safety options with her rather than acting unilaterally. The ACP conversation is framed around Dorothy's values and her GOLD Stage 3 prognosis; the candidate correctly identifies the AHD as legally binding in Queensland and explains that a valid AHD cannot be overridden by a family member absent a subsequent valid EPOA. Osteoporosis and COPD optimisation are addressed in the broader management plan.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TAYLOR — Sophie, 7F, Non-Accidental Injury + Child Protection
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "taylor",
    patientName: "Sophie TAYLOR",
    patientAge: 7,
    patientGender: "F",
    presentingComplaint: "Right leg pain after 'fall from trampoline' — brought in by stepfather",
    topics: ["Non-Accidental Injury", "Child Protection", "Mandatory Reporting", "History-Injury Discordance", "Documentation", "Safeguarding"],
    domain: "paediatrics",
    difficulty: "complex",
    icpcCode: "L – Musculoskeletal",
    year: "2025",
    scenario: `Sophie TAYLOR, 7 years, is brought to your general practice by her stepfather, Craig (34). Craig states that Sophie "fell off the trampoline about an hour ago" and is complaining of right leg pain.

Sophie is quiet and avoids eye contact. She does not respond to your direct questions and looks at Craig before answering any question you ask her.

On examination of the right lower leg, you find point tenderness over the distal tibial shaft. X-ray (in-practice or you direct Craig to take her to the nearest ED for imaging): spiral fracture of the distal tibia.

You also note:
• A faded, yellowing bruise over the left scapula (approximately 4 × 3 cm)
• A linear bruise on the posterior left thigh (approximately 8 cm, consistent with an implement)
• Two small circular scars on the left inner forearm

Craig offers without prompting: "She's always hurting herself — she's a real tomboy."

Sophie's mother, Renee (30), is not present. Craig states she is "at work."`,
    patientRecord: {
      name: "Sophie TAYLOR",
      age: 7,
      gender: "Female",
      pronouns: "She/Her",
      sexAssignedAtBirth: "Female",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: ["Nil"],
      pastHistory: [
        "2 years ago: Left radius greenstick fracture — ED presentation; mechanism recorded as 'fell from playground equipment'",
        "18 months ago: ED presentation — bruising to face; mechanism recorded as 'ran into doorframe'",
        "No regular GP; this is the first presentation to this practice",
      ],
      socialHistory: {
        "Household": "Mother Renee (30), stepfather Craig (34) — together 2 years; Sophie's biological father not involved",
        "Siblings": "Half-sibling, 18 months (Craig and Renee's child)",
        "School": "Year 2; teacher has noted Sophie is increasingly withdrawn over the past term",
        "Child Safety": "No known prior Child Safety involvement on record",
      },
      familyHistory: ["Nil relevant"],
      smoking: "Not applicable",
      alcohol: "Not applicable",
      immunisations: [
        "Immunisation schedule up to date per ACIR",
        "No recent vaccine-preventable illnesses",
      ],
    },
    questions: [
      {
        number: 1,
        text: "What features of this presentation raise concern, and how do you approach the history-taking?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What specific features of the injury and the consultation are concerning for NAI?" },
          { type: "prompt", text: "How do you take a history from Sophie and from Craig sensitively without alerting Craig to your concerns?" },
          { type: "probe", text: "Craig becomes defensive when you ask about the bruising. How do you manage this?" },
        ],
      },
      {
        number: 2,
        text: "You complete a top-to-toe examination. List your differential diagnoses for Sophie's presentation and discuss which is your primary concern.",
        timingMinutes: 2,
        prompts: [
          { type: "prompt", text: "What is the significance of a spiral tibial fracture in a 7-year-old?" },
          { type: "probe", text: "Craig states the bruises are from the same trampoline fall. Is this consistent with the findings?" },
          { type: "prompt", text: "Are there any medical conditions that could explain these findings?" },
        ],
      },
      {
        number: 3,
        text: "You believe this presentation is consistent with non-accidental injury. How do you fulfil your mandatory reporting obligations, and what do you say to Craig?",
        timingMinutes: 3,
        prompts: [
          { type: "must-use", text: "Craig says: 'You're accusing me of hurting my daughter. I'll take her somewhere else.' How do you respond?" },
          { type: "prompt", text: "Do you need to tell Craig you are making a mandatory report?" },
          { type: "probe", text: "Sophie's mother Renee arrives unexpectedly during the consultation. How does this change your approach?" },
        ],
      },
      {
        number: 4,
        text: "What are your responsibilities for Sophie's immediate safety and her ongoing care following the mandatory report?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "Can Sophie leave with Craig while you await Child Safety's response?" },
          { type: "prompt", text: "What documentation is required, and how do you record your findings?" },
          { type: "probe", text: "Child Safety advises they will assess within 48 hours. What do you do in the interim?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "2.1",
        title: "A comprehensive biopsychosocial history is taken",
        questions: [1],
        points: [
          "Establishes the mechanism of injury in detail: how high was the trampoline, who was present, exactly what happened, how did she land — looks for inconsistency between mechanism and injury pattern.",
          "Notes that a spiral tibial fracture (torsional force) is inconsistent with a simple fall from a trampoline in a 7-year-old.",
          "Elicits Sophie's own account in a child-appropriate, non-leading way — ideally with Craig outside the room.",
          "Reviews prior injury history: notes two previous ED presentations for injuries in two different years — establishes a pattern.",
          "Asks about school behaviour changes, home environment, and who else lives in the house.",
          "Screens for osteogenesis imperfecta and bleeding disorders as part of the differential — does not assume NAI without exclusion.",
        ],
      },
      {
        code: "2.4",
        title: "Physical examination findings are detected accurately and interpreted correctly",
        questions: [2],
        points: [
          "Performs a thorough top-to-toe examination including scalp, oral cavity, ears, torso, back, buttocks, and all limbs.",
          "Documents all bruising using a body diagram: location, size (cm), colour (indicating approximate age), and shape.",
          "Recognises the linear posterior thigh bruise as consistent with implement-inflicted injury.",
          "Recognises the circular scars on the inner forearm as potentially consistent with cigarette burns.",
          "Correctly identifies spiral tibial fracture as a high-specificity NAI indicator in this age group.",
          "Notes the yellowing scapular bruise as older (days to weeks) — indicating injury at a different time to today's presentation.",
        ],
      },
      {
        code: "3.3",
        title: "Demonstrates diagnostic accuracy",
        questions: [2],
        points: [
          "Primary concern: non-accidental injury — multiple injuries at different healing stages, mechanism inconsistent with injury, pattern of prior presentations.",
          "Differential: osteogenesis imperfecta (unlikely — no family history, no blue sclerae, no dentinogenesis imperfecta), ITP or bleeding disorder (does not explain fracture or pattern), accidental trauma (possible but cannot explain all findings together).",
          "Cannot-miss: identifies this as a child protection emergency — not a diagnostic uncertainty to be watched and reviewed.",
        ],
      },
      {
        code: "6.4",
        title: "Identifies and manages clinical situations where there are obstacles to duty of care",
        questions: [3, 4],
        points: [
          "Understands that mandatory reporting of suspected child abuse is required in Queensland under the Child Protection Act 1999 — threshold is reasonable suspicion, not proof.",
          "Does not need to tell Craig the specific basis for the report but does not deceive him — can say: 'Sophie needs specialist assessment for her injuries and I have an obligation to make sure she gets that.'",
          "Contacts Child Safety Services directly (1800 811 810 in Qld) and clearly describes the clinical findings and concerns.",
          "Does not allow Sophie to leave with Craig if there is immediate risk of harm — if necessary, contacts police for immediate protection.",
          "If Renee arrives, assesses whether she is a safe adult — explores whether the mother is aware of the injuries without disclosing specific NAI concerns prematurely.",
          "Documents every finding, every statement made by Craig, and every clinical decision with time-stamps — uses direct quotes.",
          "Arranges ED transfer for full skeletal survey, ophthalmology review, and paediatric specialist assessment.",
        ],
      },
      {
        code: "1.3",
        title: "Matches modality of communication to patient needs, health literacy and context",
        questions: [1, 3],
        points: [
          "Speaks to Sophie at her level — crouches down, uses simple language, allows her to lead, validates her feelings.",
          "Does not alarm Sophie or tell her what will happen before it is confirmed.",
          "Manages Craig's defensiveness calmly and without escalating conflict: 'I can hear you're frustrated — my priority is just making sure Sophie is OK.'",
          "If Renee attends, acknowledges her distress, explains the process, and ensures she understands the support available.",
          "Avoids using the term 'abuse' or 'assault' with Craig until Child Safety and police are involved.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.1", description: "A comprehensive biopsychosocial history is taken", questions: [1] },
      { domain: "Clinical information gathering and interpretation", domainNumber: 2, code: "2.4", description: "Physical examination findings are detected accurately and interpreted correctly", questions: [2] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.3", description: "Demonstrates diagnostic accuracy", questions: [2] },
      { domain: "Professionalism", domainNumber: 6, code: "6.4", description: "Identifies and manages clinical situations where there are obstacles to duty of care", questions: [3, 4] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.3", description: "Matches modality of communication to patient needs, health literacy and context", questions: [1, 3] },
    ],
    debriefNotes: `The competent candidate identifies multiple NAI red flags: spiral tibial fracture with inconsistent mechanism, injuries at different stages of healing, linear implement bruise, potential cigarette burn scars, and a pattern of prior presentations. They perform a meticulous top-to-toe examination and document findings with a body diagram. Mandatory reporting is correctly understood as requiring only reasonable suspicion, not proof; the candidate contacts Child Safety Services directly and arranges ED transfer for full skeletal survey and paediatric review. They manage Craig's hostility calmly, do not allow Sophie to leave if there is immediate risk, and recognise that the mother's unexpected arrival requires careful assessment before she is treated as a safe person. Documentation is thorough and contemporaneous.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // FITZPATRICK — Dean, 44M, Drug-Seeking / S8 Opioid Prescribing
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "fitzpatrick",
    patientName: "Dean FITZPATRICK",
    patientAge: 44,
    patientGender: "M",
    presentingComplaint: "Requesting opioid prescription for chronic back pain — new patient, previous GP retired",
    topics: ["Drug-Seeking Behaviour", "S8 Opioids", "SafeScript", "Chronic Pain", "De-escalation", "Professional Boundaries", "Opioid Use Disorder"],
    domain: "difficult_conversation",
    difficulty: "challenging",
    icpcCode: "L – Musculoskeletal",
    year: "2025",
    scenario: `Dean FITZPATRICK, 44 years, presents as a new patient requesting a repeat prescription for OxyContin SR (oxycodone) 80 mg twice daily for "chronic low back pain." He states his previous GP, Dr Watkins, has retired and he "urgently" needs his script today.

He reports a prior L4/L5 disc prolapse with nerve root compression, managed surgically 4 years ago. He states the pain "never went away" and that oxycodone is "the only thing that works."

You review SafeScript before the consultation:
• Opioid prescriptions from 4 different prescribers in the past 90 days
• Total morphine equivalent dose: 340 mg/day
• One ED presentation 6 weeks ago (discharge summary states: "opioid intoxication — NAD on discharge, advised to see GP")
• No prescriptions from Dr Watkins in the past 18 months

On entering the room, Dean is seated forward, tense. He immediately states: "I need my script — I'm not here for a lecture."

Examination: No focal neurological deficit. Normal gait. No allodynia. No muscle wasting.`,
    patientRecord: {
      name: "Dean FITZPATRICK",
      age: 44,
      gender: "Male",
      pronouns: "He/Him",
      sexAssignedAtBirth: "Male",
      indigenousStatus: "Not Aboriginal or Torres Strait Islander",
      allergies: "Nil known",
      medications: [
        "OxyContin SR 80 mg twice daily (self-reported — not verified in SafeScript as from one prescriber)",
        "Ibuprofen 400 mg PRN (self-reported)",
      ],
      pastHistory: [
        "4 years ago: L4/L5 disc prolapse — microdiscectomy; post-operative physiotherapy completed",
        "6 weeks ago: ED presentation — opioid intoxication (self-discharge)",
        "Possible opioid use disorder — undiagnosed",
      ],
      socialHistory: {
        "Relationship": "Separated from wife 2 years ago; two children (ages 10 and 13, alternate weekends)",
        "Occupation": "Former concreter — on WorkCover for back injury 4 years ago; not returned to work",
        "Housing": "Rents a unit alone",
        "Support": "Limited social support; older brother lives interstate",
      },
      familyHistory: ["Father: alcohol use disorder", "Nil other relevant"],
      smoking: "Current smoker — 10 cigarettes per day",
      alcohol: "Reports 2–3 standard drinks per week",
      immunisations: ["COVID-19 up to date", "Influenza (last year)"],
    },
    questions: [
      {
        number: 1,
        text: "How do you approach this initial consultation with Dean before prescribing decisions are made?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What information do you need before responding to his request?" },
          { type: "prompt", text: "How do you conduct a pain assessment and functional history?" },
          { type: "probe", text: "Dean says he does not consent to you accessing SafeScript. How do you respond?" },
        ],
      },
      {
        number: 2,
        text: "You share the SafeScript findings with Dean. How do you explain your position without outright refusal?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How do you present the SafeScript data to Dean in a non-accusatory way?" },
          { type: "must-use", text: "Dean says: 'All those doctors knew my history — they all prescribed it for a reason.' How do you respond?" },
          { type: "probe", text: "He claims the ED presentation was a 'mistake with tablets.' Does this change your approach?" },
        ],
      },
      {
        number: 3,
        text: "Dean becomes aggressive, raises his voice, and threatens to 'report you to AHPRA' for refusing to treat him. How do you manage this?",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "What de-escalation techniques do you use?" },
          { type: "probe", text: "He stands up and moves towards you. What do you do?" },
          { type: "prompt", text: "What documentation and follow-up steps are required after this interaction?" },
        ],
      },
      {
        number: 4,
        text: "Dean calms down and agrees to a comprehensive review. Outline your management plan for his chronic pain and possible opioid use disorder.",
        timingMinutes: 3,
        prompts: [
          { type: "prompt", text: "How do you approach the possibility of opioid use disorder?" },
          { type: "prompt", text: "What non-opioid and multimodal pain management options would you discuss?" },
          { type: "probe", text: "Dean asks about buprenorphine-naloxone (Suboxone). What do you tell him?" },
        ],
      },
    ],
    competentCandidateCriteria: [
      {
        code: "1.8",
        title: "Adapts the consultation to facilitate optimal patient care",
        questions: [1, 2],
        points: [
          "Opens with an empathic acknowledgement before discussing SafeScript: 'I understand you're in pain and that coming to a new doctor isn't easy.'",
          "Completes a structured pain assessment: site, radiation, severity (NRS), onset, character, aggravating and relieving factors, functional impact, sleep, mood.",
          "Requests prior records and imaging before making any prescribing decision.",
          "Presents SafeScript findings as a tool to help, not an accusation: 'This system shows me what has been prescribed across the state — it helps me make sure I'm prescribing safely for you.'",
          "Does not outright refuse: explains the concern and proposes a pathway: 'I can't safely prescribe this today without a fuller picture, but I want to help you manage your pain.'",
          "Maintains professional tone throughout — does not mirror Dean's hostility.",
        ],
      },
      {
        code: "1.10",
        title: "Prioritises problems, attending to both the patient's and the doctor's agendas",
        questions: [2, 3],
        points: [
          "Recognises dual agenda: Dean's stated need (pain relief) and the GP's duty (safe prescribing, preventing harm).",
          "Does not conflate drug-seeking with opioid use disorder — explores the possibility while maintaining a therapeutic relationship.",
          "When threatened with AHPRA complaint, responds calmly: 'You're entitled to raise a concern — that is your right. My obligation is to prescribe safely.'",
          "Addresses the safety threat (standing up, moving towards the doctor) by naming the behaviour and offering to pause: 'I can see you're very upset. I'd like us both to take a moment — your safety and mine matter.'",
          "After the crisis, returns to the clinical task without punishing Dean for his behaviour.",
        ],
      },
      {
        code: "6.1",
        title: "Practises medicine ethically, with integrity and in compliance with relevant laws",
        questions: [1, 2, 4],
        points: [
          "Understands the legal obligation to check SafeScript in Victoria/Qld before prescribing Schedule 8 opioids — this is mandatory, not optional.",
          "Correctly identifies that prescribing oxycodone 160 mg/day to a patient with polypharmacy opioid evidence and an opioid intoxication ED visit would be clinically and legally inappropriate.",
          "Explains the Drugs of Dependence/Controlled Substances Act obligations to the patient in plain terms.",
          "Documents every prescribing decision and its rationale thoroughly — particularly when declining to prescribe.",
          "Notifies the patient that a one-prescriber arrangement is a reasonable condition of ongoing care.",
        ],
      },
      {
        code: "4.4",
        title: "Outlines and justifies the therapeutic options selected",
        questions: [4],
        points: [
          "Proposes a structured opioid tapering plan rather than immediate cessation — explains risks of abrupt cessation.",
          "Introduces multimodal pain management: physiotherapy (evidence-based for chronic low back pain), psychology/CBT (pain reconceptualisation), low-dose tricyclic antidepressant (amitriptyline) or duloxetine for neuropathic component.",
          "Discusses opioid use disorder (OUD) screening: applies DSM-5 criteria — if OUD confirmed, discusses buprenorphine-naloxone (Suboxone) as evidence-based treatment requiring prescriber registration.",
          "Checks for and addresses co-prescribing risks: benzodiazepines, gabapentinoids, alcohol.",
          "Proposes GPMP and GP pain management review; considers referral to pain specialist or addiction medicine physician.",
          "Discusses WorkCover involvement and return-to-work planning as part of the biopsychosocial pain model.",
        ],
      },
      {
        code: "3.1",
        title: "Integrates and synthesises knowledge to make decisions in complex clinical situations",
        questions: [2, 4],
        points: [
          "Recognises that the clinical picture (polyprescribing, ED intoxication, no prescriptions from named GP, high dose) is consistent with opioid use disorder, not simply undertreated pain.",
          "Applies morphine equivalent dose calculation: 160 mg oxycodone/day = 240 mg oral morphine equivalent — extremely high, above safe prescribing thresholds without specialist oversight.",
          "Understands that post-surgical chronic pain (4 years post-microdiscectomy with normal neurological exam) should not typically require escalating opioid doses.",
          "Identifies the risk of precipitating withdrawal if opioids are abruptly stopped — plans medically supervised taper.",
        ],
      },
    ],
    markingRubric: [
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.8", description: "Adapts the consultation to facilitate optimal patient care", questions: [1, 2] },
      { domain: "Communication and consultation skills", domainNumber: 1, code: "1.10", description: "Prioritises problems, attending to both the patient's and the doctor's agendas", questions: [2, 3] },
      { domain: "Professionalism", domainNumber: 6, code: "6.1", description: "Practises medicine ethically, with integrity and in compliance with relevant laws", questions: [1, 2, 4] },
      { domain: "Clinical management and therapeutic reasoning", domainNumber: 4, code: "4.4", description: "Outlines and justifies the therapeutic options selected", questions: [4] },
      { domain: "Diagnosis, decision-making and reasoning", domainNumber: 3, code: "3.1", description: "Integrates and synthesises knowledge to make decisions in complex clinical situations", questions: [2, 4] },
    ],
    debriefNotes: `The competent candidate approaches Dean with empathy before accessing SafeScript, completes a structured pain and functional assessment, and presents the SafeScript findings as a patient safety tool rather than an accusation. They correctly decline to prescribe 160 mg oxycodone/day given polypharmacy opioid sourcing and an opioid intoxication ED presentation, explaining the legal prescribing obligations without outright refusal. The aggressive escalation is managed with calm de-escalation technique — naming the behaviour, offering a pause, and not capitulating under threat. The comprehensive management plan incorporates supervised opioid tapering, multimodal pain management (physiotherapy, psychology, low-dose antidepressant), OUD screening, and possible buprenorphine-naloxone if OUD is confirmed, with a one-prescriber agreement documented.`,
    patientPersona: {
      openingStatement: "I need my OxyContin script. I'm a new patient — my GP retired. Just write the script and I'll be out of your way.",
      volunteerHistory: [
        "I had a back op four years ago. Never fixed it. I've been on oxy ever since.",
        "Dr Watkins knew my history — he prescribed it for years.",
        "I just need the same script. 80 milligrams twice a day.",
      ],
      withheldHistory: [
        "He has been sourcing opioids from multiple GPs and EDs for 18 months.",
        "He sometimes takes double doses when the pain is 'really bad.'",
        "He has been using cannabis daily alongside the opioids.",
        "He is terrified of withdrawal — he has experienced it before and describes it as 'the worst thing imaginable.'",
        "He lost his job and marriage partly due to his opioid use.",
      ],
      ice: {
        ideas: "He believes his pain is solely physical and that opioids are the only effective treatment — he has no framework for opioid use disorder.",
        concerns: "He is terrified of being cut off without medication and going into withdrawal. He is also ashamed but will not show it.",
        expectations: "He expects the GP to write the script. He will escalate if challenged. He will respond to genuine empathy if it feels authentic, not scripted.",
      },
      demeanour: "Tense and guarded from the outset. Becomes aggressive when challenged. If the doctor stays calm and empathic rather than defensive, he will eventually de-escalate. Does not respond to lectures or moralising.",
      responseToJargon: "Knows opioid terminology well but shuts down if clinical language feels like a barrier or weapon. Responds to plain, direct communication.",
    },
  },
];

export function getCaseById(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}
