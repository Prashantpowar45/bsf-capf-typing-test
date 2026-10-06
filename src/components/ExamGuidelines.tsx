import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Play
} from 'lucide-react';

interface ExamGuidelinesProps {
  onStartTest: () => void;
}

export const ExamGuidelines: React.FC<ExamGuidelinesProps> = ({ onStartTest }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-l-8 border-amber-600">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Exam-Style Practice Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          CAPF / BSF HCM English Typing Practice Guidelines
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          A focused practice setup for 10-minute typing sessions, 35 WPM targets, paper-to-screen practice, and transparent speed/error calculations.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Language</span>
          <p className="text-lg font-black text-slate-900">English Only</p>
          <span className="text-xs text-slate-500">Standard QWERTY layout</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
          <p className="text-lg font-black text-amber-600">10 Minutes</p>
          <span className="text-xs text-slate-500">Exact countdown clock</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Qualifying Speed</span>
          <p className="text-lg font-black text-emerald-600">35 WPM</p>
          <span className="text-xs text-slate-500">Net speed target</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Backspace Key</span>
          <p className="text-lg font-black text-rose-600">Strictly Disabled</p>
          <span className="text-xs text-slate-500">Forward typing only</span>
        </div>
      </div>

      {/* Core Rules Section */}
      <div className="space-y-6">
        
        {/* Rule 1: Paper-to-Screen Workflow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
            <h3>True Paper-to-Screen Mode (Physical Passage Copy)</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            This simulator supports a <strong>hard-copy paper-to-screen workflow</strong>: print the selected passage, keep it beside the keyboard, and type without an on-screen reference.
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li>Before starting the test, select and click <strong>View / Print Passage</strong>.</li>
            <li>Use your printer or preview the sheet to keep it beside your keyboard.</li>
            <li><strong>Once the test begins, the passage will completely vanish from the computer screen.</strong></li>
            <li>No reference panel, no highlighting, and no on-screen words will be shown during the active 10 minutes.</li>
          </ul>
        </div>

        {/* Rule 2: 5 Keystrokes = 1 Word Calculation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
            <h3>Standard Word Count: 5 Keystrokes = 1 Word</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            For this practice simulator, typing speed is calculated using the common convention:
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-mono text-amber-950 space-y-1">
            <p><strong>Gross Words</strong> = Total Keystrokes (including letters, spaces, and punctuation) ÷ 5</p>
            <p><strong>Gross WPM</strong> = Gross Words ÷ Test Duration in Minutes (10.0 mins)</p>
            <p><em>Example:</em> Typing 1,750 keystrokes in 10 minutes = 350 gross words = <strong>35 WPM Gross Speed</strong>.</p>
          </div>
        </div>

        {/* Rule 3: 5% Mistake Relaxation & Deduction Formula */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
            <h3>5% Practice Mistake Relaxation & Penalty Scheme</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            To provide realistic practice for ministerial candidates, a <strong>5% mistake relaxation setting</strong> is enabled:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase">1. Allowed Mistakes Calculation:</span>
              <p className="font-mono text-slate-700">Allowed Mistakes = Total Words Typed × 5%</p>
              <p className="text-slate-500 text-[11px]">
                If you type 350 words, 5% of 350 = 17.5 (17 mistakes allowed penalty-free).
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase">2. Penalty for Excess Mistakes:</span>
              <p className="font-mono text-slate-700">Penalty Words = (Total Mistakes - Allowed) × 10</p>
              <p className="text-slate-500 text-[11px]">
                Each mistake beyond the 5% allowance deducts 10 words (50 strokes) from your gross output.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 4: Qualification Criteria */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">4</span>
            <h3>Qualified vs Not Qualified Criteria</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Merely typing the passage to the end does NOT qualify a candidate. The system evaluates whether:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>QUALIFIED Requirements:</span>
              </div>
              <ul className="list-disc list-inside text-emerald-900 space-y-1">
                <li>Net Speed must be equal to or greater than <strong>35.0 WPM</strong>.</li>
                <li>Mistakes must not excessively reduce the net score below the threshold.</li>
                <li>Sufficient passage coverage completed within 10 minutes.</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>NOT QUALIFIED Triggers:</span>
              </div>
              <ul className="list-disc list-inside text-rose-900 space-y-1">
                <li>Net Speed falling below <strong>35.0 WPM</strong>.</li>
                <li>Gross Speed below 35 WPM.</li>
                <li>High mistake count resulting in heavy word deduction penalties.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Pro Tips Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight">Ready to Test Your Skills?</h3>
          <p className="text-xs font-semibold text-slate-900 mt-0.5">
            Select one of the available BSF typing passages, print the paper, and experience realistic 10-minute exam pressure.
          </p>
        </div>

        <button
          onClick={onStartTest}
          className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md flex items-center space-x-2 transition-transform transform hover:-translate-y-0.5 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Typing Test</span>
        </button>
      </div>
    </div>
  );
};
