# CAPF / BSF HCM English Typing Practice Simulator (Paper-to-Screen)

An independent practice web application designed to simulate a **CAPF / BSF HCM (Head Constable Ministerial)** style English typing session.

Built for candidates preparing for typing tests conducted by **BSF, CRPF, CISF, ITBP, SSB, and Assam Rifles**.

---

## 🎯 Key Examination Rules & Specifications

- **Target Speed:** 35 Words Per Minute (WPM) Net Speed
- **Duration:** Exactly 10 Minutes (600 Seconds countdown timer)
- **Word Calculation:** 5 Keystrokes = 1 Word (Gross Words = Total Keystrokes ÷ 5)
- **Mode:** **True Paper-to-Screen**
  - Select passage from official 50-passage bank.
  - Preview & print physical A4 question paper sheet using **Print Passage**.
  - Keep paper in front/beside the keyboard.
  - Click **Start Typing Test** — the passage **COMPLETELY DISAPPEARS** from the screen.
  - Type strictly from paper; no screen reference, no word highlighting, zero distraction.
- **Backspace & Editing Restrictions:**
  - `Backspace` completely disabled
  - `Delete` key disabled
  - `Ctrl + Z`, `Ctrl + Y`, `Ctrl + X`, `Ctrl + V`, `Ctrl + A` disabled
  - Mouse right-click / context menu, copy, paste, and text selection disabled
  - Direct cursor repositioning disabled — strict forward typing only
- **5% Practice Mistake Relaxation:**
  - Allowed Mistakes = Words Typed × 5% (rounded to nearest integer)
  - For each mistake exceeding the 5% limit, **10 words (50 strokes)** are deducted from gross words.
- **Automated Qualification:**
  - Automatically determines **✓ QUALIFIED** or **✗ NOT QUALIFIED** based on Net Speed ≥ 35.0 WPM and accuracy metrics.
- **Passage Library:**
  - Pre-loaded with a **50-passage practice library** for repeated typing sessions.
  - Passage text is preserved as stored in the project data (no runtime spell correction or paraphrasing).
  - Admin Passage Management interface to add, edit, export, or reset passages.

---

## 🚀 Features

- 📄 **Official A4 Printable Question Paper:** Government-formatted printable exam sheets with candidate name, roll number, time, and passage matter.
- ⏱️ **Distraction-Free 10-Min Timer:** Prominent countdown display with automated submission at 00:00.
- 🔊 **Web Audio Synthesizer:** Realistic mechanical typewriter key clicks, warning buzzer on restricted keys, start bell, and qualification fanfare.
- 📊 **Comprehensive Result Scorecard:**
  - Gross WPM & Net WPM
  - Accuracy (%)
  - Total Keystrokes & Characters
  - Mistake breakdown (Correct vs. Incorrect vs. Missing vs. Extra words)
  - 5% Mistake Allowance calculation table
  - Word-by-word diff review (color-coded)
- 📈 **Performance Dashboard & Progress Graphs:**
  - Best & Average Net WPM
  - Best & Average Accuracy
  - Total Tests Taken & Pass Rate (%)
  - Interactive SVG Line Charts tracking WPM and Accuracy progression over time
- 📜 **Audit History & CSV Export:**
  - Complete history stored locally in browser (`localStorage`)
  - Filter by Qualified / Not Qualified
  - One-click CSV export for offline performance tracking
- 🛡️ **Candidate Profile Customization:** Enter Name & Roll Number for personalized scorecards and print sheets.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Audio:** Web Audio API (zero external asset dependencies)

---

## 💻 Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/Prashantpowar45/bsf-capf-typing-test.git

# Navigate to project directory
cd bsf-capf-typing-test

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deploy to GitHub Pages

1. In `vite.config.ts`, `base: './'` is configured for relative asset paths.
2. Run `npm run build` to generate the production bundle in `dist/`.
3. Push to GitHub and enable GitHub Pages under repository Settings -> Pages.

---

## ⚖️ Disclaimer

This platform is an independent practice examination simulation portal created to help candidates prepare for CAPF / BSF HCM typing skill tests. The 5% mistake relaxation is a practice evaluation model and should not be construed as an official recruitment rule claim.
