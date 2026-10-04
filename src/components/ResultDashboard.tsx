import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Zap, 
  Target, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Percent,
  Calculator
} from 'lucide-react';
import type { EvaluationResult, UserSettings } from '../types';
import { soundService } from '../utils/sound';

interface ResultDashboardProps {
  result: EvaluationResult;
  settings: UserSettings;
  onRetakeTest: () => void;
  onViewHistory: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  settings,
  onRetakeTest,
  onViewHistory,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const isQualified = result.status === 'QUALIFIED';

  useEffect(() => {
    if (isQualified) {
      soundService.playQualifiedFanfare();
      // Trigger festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isQualified]);

  const handlePrintScorecard = () => {
    window.print();
  };

  const getRatingBadgeClass = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'VERY GOOD':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'GOOD':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'AVERAGE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Printable Scorecard Banner */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Scorecard Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-b-4 border-amber-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                  OFFICIAL EXAMINATION SCORE CARD
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">
                  CAPF / BSF HCM TYPING TEST RESULT
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Candidate: <strong className="text-slate-200">{settings.candidateName}</strong> ({settings.rollNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 no-print">
              <button
                onClick={handlePrintScorecard}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Scorecard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Qualification Verdict Banner */}
        <div className={`p-6 sm:p-8 text-center border-b ${
          isQualified 
            ? 'bg-emerald-50/80 border-emerald-200' 
            : 'bg-rose-50/80 border-rose-200'
        }`}>
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center">
              {isQualified ? (
                <div className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                  <CheckCircle className="w-8 h-8 shrink-0" />
                  <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                    ✓ QUALIFIED
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-rose-600 text-white px-8 py-3 rounded-2xl shadow-lg">
                  <XCircle className="w-8 h-8 shrink-0" />
                  <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                    ✗ NOT QUALIFIED
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {result.statusReason}
            </p>

            <div className="inline-flex items-center space-x-2 pt-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                Overall Performance:
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getRatingBadgeClass(result.performanceRating)}`}>
                {result.performanceRating}
              </span>
            </div>
          </div>
        </div>

        {/* Core Metric Cards Grid */}
        <div className="p-6 sm:p-8 bg-slate-50/40">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
            Test Performance Summary
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Gross Speed */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Speed</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{result.grossWpm}</span>
                <span className="text-sm font-semibold text-slate-500 ml-1">WPM</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {result.totalKeystrokes} strokes ÷ 5 ÷ {result.timeFormatted}
              </span>
            </div>

            {/* Net Speed (Crucial) */}
            <div className={`p-5 rounded-xl border-2 shadow-sm flex flex-col justify-between ${
              result.netWpm >= result.targetSpeed 
                ? 'bg-emerald-50/50 border-emerald-500' 
                : 'bg-white border-rose-400'
            }`}>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Net Speed</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className={`text-3xl sm:text-4xl font-black ${
                  result.netWpm >= result.targetSpeed ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {result.netWpm}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">WPM</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mt-2">
                <span>Target: 35 WPM</span>
                <span className={result.netWpm >= 35 ? 'text-emerald-600' : 'text-rose-600'}>
                  {result.netWpm >= 35 ? '✓ Target Met' : '✗ Below Target'}
                </span>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
                <Percent className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{result.accuracy}%</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {result.correctCharacters} correct / {result.totalKeystrokes} strokes
              </span>
            </div>

            {/* Mistakes & 5% Relaxation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Mistakes</span>
                <AlertTriangle className={`w-4 h-4 ${result.excessMistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{result.totalMistakes}</span>
                <span className="text-xs text-slate-500 font-semibold ml-2">
                  (5% Allowed: <strong className="text-slate-800">{result.allowedMistakes}</strong>)
                </span>
              </div>
              <span className={`text-[11px] font-semibold mt-2 block ${
                result.excessMistakes > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {result.excessMistakes > 0 
                  ? `${result.excessMistakes} Excess Mistakes (-${result.mistakePenaltyWords} words)` 
                  : '✓ Mistakes within 5% Allowance'}
              </span>
            </div>

          </div>

          {/* Detailed Specifications Table */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-xs text-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 uppercase font-bold block mb-1">Passage Details</span>
                <p className="font-bold text-slate-900 text-sm">Passage {result.passageNumber < 10 ? `0${result.passageNumber}` : result.passageNumber}</p>
                <p className="text-slate-500">{result.passageTitle}</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-bold block mb-1">Test Duration</span>
                <p className="font-bold text-slate-900 text-sm">{result.timeFormatted} Minutes</p>
                <p className="text-slate-500">Standard 10-Minute Examination</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-bold block mb-1">Word Calculations</span>
                <p className="font-bold text-slate-900 text-sm">{result.grossWords} Gross Words</p>
                <p className="text-slate-500">{result.totalWordsTyped} Raw Words Typed</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-bold block mb-1">Characters / Keystrokes</span>
                <p className="font-bold text-slate-900 text-sm">{result.totalKeystrokes} Total Strokes</p>
                <p className="text-slate-500">{result.correctCharacters} Correct / {result.incorrectCharacters} Errors</p>
              </div>
            </div>
          </div>

          {/* Transparent Calculation Breakdown Box */}
          <div className="mt-4 bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
            <div className="flex items-center space-x-2 font-bold mb-2">
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>CAPF / BSF HCM Official Evaluation Formula:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="bg-white/80 p-2.5 rounded border border-amber-200">
                <strong>Gross Speed:</strong>
                <p className="text-slate-600 mt-1">{result.totalKeystrokes} strokes ÷ 5 ÷ {Math.max(0.1, result.timeTakenSeconds / 60)} min = <strong className="text-slate-900">{result.grossWpm} WPM</strong></p>
              </div>
              <div className="bg-white/80 p-2.5 rounded border border-amber-200">
                <strong>5% Relaxation:</strong>
                <p className="text-slate-600 mt-1">{result.totalWordsTyped} words × 5% = <strong className="text-slate-900">{result.allowedMistakes} allowed</strong> (Errors: {result.totalMistakes})</p>
              </div>
              <div className="bg-white/80 p-2.5 rounded border border-amber-200">
                <strong>Net Speed:</strong>
                <p className="text-slate-600 mt-1">({result.grossWords} - {result.mistakePenaltyWords} pen) ÷ {Math.max(0.1, result.timeTakenSeconds / 60)} = <strong className="text-emerald-700">{result.netWpm} WPM</strong></p>
              </div>
            </div>
            <p className="text-[10px] text-amber-800 mt-2">
              *Note: The 5% mistake relaxation is calculated as a practice setting where errors exceeding 5% of total words typed incur a deduction of 10 words per mistake as per standard ministerial exam guidelines.
            </p>
          </div>

          {/* Collapsible Word-by-Word Mistake Inspector */}
          <div className="mt-6 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm no-print">
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left text-slate-800 hover:bg-slate-50 transition-colors font-bold text-sm"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Inspect Detailed Word-by-Word Mistakes ({result.diffTokens.length} words analyzed)</span>
              </div>
              {showDiff ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDiff && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 text-sm font-serif leading-relaxed max-h-96 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5 p-4 bg-white rounded-lg border border-slate-200">
                  {result.diffTokens.map((token, idx) => {
                    if (token.status === 'correct') {
                      return (
                        <span key={idx} className="text-slate-800 hover:bg-emerald-50 px-0.5 rounded">
                          {token.word}
                        </span>
                      );
                    }
                    if (token.status === 'incorrect') {
                      return (
                        <span
                          key={idx}
                          title={`Expected: "${token.expectedWord}"`}
                          className="bg-rose-100 text-rose-800 border-b-2 border-rose-500 font-bold px-1 rounded cursor-help"
                        >
                          {token.word || '␣'}
                          <span className="text-[10px] font-mono text-rose-600 ml-0.5">
                            ({token.expectedWord})
                          </span>
                        </span>
                      );
                    }
                    if (token.status === 'missing') {
                      return (
                        <span
                          key={idx}
                          title="Word omitted by candidate"
                          className="bg-amber-100 text-amber-800 border-b border-dashed border-amber-500 px-1 rounded line-through text-xs"
                        >
                          {token.expectedWord}
                        </span>
                      );
                    }
                    return (
                      <span
                        key={idx}
                        title="Extra word typed"
                        className="bg-purple-100 text-purple-800 px-1 rounded text-xs font-semibold"
                      >
                        +{token.word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
          <button
            onClick={onViewHistory}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            View in Performance Dashboard
          </button>

          <button
            onClick={onRetakeTest}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Passage</span>
          </button>
        </div>

      </div>

    </div>
  );
};
