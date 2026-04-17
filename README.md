# CCE Practice App

A voice-based RACGP Clinical Competency Exam (CCE) practice tool. An AI acts as your examiner, asks you the real CCE case discussion questions, listens to your answers via microphone, and then gives you a completed marking rubric plus mentor feedback at the end.

## Cases included

| Case | Patient | Presenting Complaint | Topics |
|------|---------|---------------------|--------|
| HUNT | Angela, 59F | Racing heart, sweating, neck swelling | Thyrotoxicosis / Thyroid Storm |
| JONES | Susan, 68F | Tender growing lump on left leg | Squamous Cell Carcinoma, Preventive Health |
| KEATING | Ava, 3F | Vulval discomfort, bedwetting, weight loss | Type 1 Diabetes / DKA, Rural Medicine |
| MORRAL | Evan, 76M | Weakness, pre-syncope on the farm | Bradycardia, Aortic Stenosis, Falls Risk |
| SIMKINS | Amiel, 21F | Postpartum behavioural change | Postpartum Psychosis, Aboriginal Health |

## Prerequisites

- [Node.js 18+](https://nodejs.org/) — check with `node --version`
- An [Anthropic API key](https://console.anthropic.com/) (Claude)
- **Chrome or Edge** browser (for Web Speech API voice support)

## Setup

### 1. Install dependencies

```bash
cd cce-practice-app
npm install
```

### 2. Add your Anthropic API key

Edit `.env.local` in the `cce-practice-app` folder:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at https://console.anthropic.com/

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in **Chrome** or **Edge**.

### 4. Allow microphone access

When you start an exam, the browser will ask for microphone permission. Click **Allow**.

## How to use

1. **Pick a case** from the home screen
2. **Read the scenario** carefully — this is exactly what you'd get in the real exam (candidate information only, no hints)
3. Click **Start Exam** when ready
4. **Speak your answers** — press the 🎤 button, speak, then press it again to stop
5. The AI examiner will respond (spoken aloud + displayed as text) and may use prompts/probes
6. Use **Next Q →** to move to the next question if you're ready
7. Use **End exam** when you've finished all questions (or the 15-minute timer will end it automatically)
8. Wait ~10–20 seconds for the AI to complete the marking
9. Review your **marking rubric**, **mentor feedback**, and **transcript** on the results page

## Tips

- Use a quiet room with a decent microphone for best voice recognition
- If voice recognition isn't working, click "Type instead" to switch to text input
- You can change the examiner voice using the dropdown in the top bar
- The **debrief notes** and **competent candidate criteria** are fully loaded into the AI — the feedback you get is based on the real RACGP marking criteria
- You can retry the same case as many times as you like; completed attempts are tracked

## Cost

Each exam session uses approximately:
- ~2,000–4,000 tokens for the examiner conversation (streaming)
- ~6,000–10,000 tokens for the post-exam evaluation

At Claude Sonnet pricing (~$3/$15 per million tokens in/out), one full practice session costs approximately **$0.05–$0.15 AUD** — very cheap for exam prep.

## Tech stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Anthropic Claude Sonnet** for the AI examiner and evaluator
- **Web Speech API** (browser-native, free) for speech-to-text
- **SpeechSynthesis API** (browser-native, free) for text-to-speech
- No database — all state in memory / localStorage / sessionStorage
