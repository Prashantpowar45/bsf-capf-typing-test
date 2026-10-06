import React from 'react';
import type { Passage, UserSettings } from '../types';

interface PrintPassageSheetProps {
  passage: Passage;
  settings: UserSettings;
}

export const PrintPassageSheet: React.FC<PrintPassageSheetProps> = ({ passage, settings }) => {
  return (
    <div className="passage-print-sheet p-8 max-w-4xl mx-auto font-serif text-black leading-relaxed">
      {/* Official Government Exam Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 m-0">
          CAPF / BSF HCM TYPING PRACTICE
        </h2>
        <h1 className="text-xl font-black uppercase tracking-wider text-black my-1">
          PAPER-TO-SCREEN PRACTICE SHEET
        </h1>
        <p className="text-sm font-semibold tracking-wide uppercase text-slate-900 m-0">
          HEAD CONSTABLE (MINISTERIAL) ENGLISH TYPING PREPARATION
        </p>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1">
          10-MINUTE ENGLISH TYPING PRACTICE PASSAGE
        </p>
      </div>

      {/* Candidate Details & Examination Rules Table */}
      <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs mb-6 bg-slate-50">
        <div>
          <p><span className="font-bold">Candidate Name:</span> {settings.candidateName || 'Candidate'}</p>
          <p><span className="font-bold">Roll / Reg. No.:</span> {settings.rollNumber || 'CAPF-2026-XXXX'}</p>
          <p><span className="font-bold">Test Language:</span> English Only</p>
        </div>
        <div>
          <p><span className="font-bold">Test Duration:</span> Exactly 10 Minutes</p>
          <p><span className="font-bold">Qualifying Speed:</span> 35 Words Per Minute (WPM)</p>
          <p><span className="font-bold">Calculation Rule:</span> 5 Keystrokes = 1 Word (5% Mistake Allowance)</p>
        </div>
      </div>

      {/* Passage Title Banner */}
      <div className="text-center mb-6 border-y border-dashed border-slate-400 py-2">
        <h3 className="text-base font-bold text-black uppercase tracking-wider m-0">
          Typing Passage {passage.number < 10 ? `0${passage.number}` : passage.number} — {passage.title}
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">
          Standard Exam Passage • Word Count: {passage.wordCount} Words • Characters: {passage.charCount}
        </p>
      </div>

      {/* Important Examination Instructions */}
      <div className="text-xs text-slate-800 mb-6 bg-amber-50/50 p-2.5 border-l-4 border-amber-600">
        <p className="font-bold uppercase tracking-wider text-[11px] mb-1">
          CRITICAL INSTRUCTIONS FOR CANDIDATE:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
          <li>Keep this physical printed paper on your desk beside or in front of the keyboard.</li>
          <li>Look ONLY at this paper sheet while typing into the computer terminal.</li>
          <li>The passage text will NOT be displayed on the computer screen once the test begins.</li>
          <li>Backspace, Delete, Undo, and mouse editing keys are completely disabled during the test.</li>
        </ul>
      </div>

      {/* Exact Body Matter */}
      <div className="text-[13pt] leading-[1.8] text-justify font-serif tracking-normal text-slate-950 p-4 border border-slate-300 rounded shadow-sm">
        {passage.content}
      </div>

      {/* Signatures & Verification */}
      <div className="mt-12 pt-6 border-t border-black flex justify-between items-end text-xs">
        <div className="text-center w-48">
          <div className="border-b border-black mb-1 w-full h-8"></div>
          <p className="font-bold uppercase">Candidate Signature</p>
        </div>
        <div className="text-center text-[10px] text-slate-500">
          <p>*** END OF TYPING PASSAGE MATTER ***</p>
          <p>INDEPENDENT PRACTICE SIMULATOR • NOT AN OFFICIAL EXAM DOCUMENT</p>
        </div>
        <div className="text-center w-48">
          <div className="border-b border-black mb-1 w-full h-8"></div>
          <p className="font-bold uppercase">Invigilator Signature</p>
        </div>
      </div>
    </div>
  );
};
