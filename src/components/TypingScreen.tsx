import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Clock, 
  Send, 
  AlertCircle, 
  EyeOff, 
  Lock,
  Flag
} from 'lucide-react';
import type { Passage, UserSettings } from '../types';
import { soundService } from '../utils/sound';

interface TypingScreenProps {
  passage: Passage;
  settings: UserSettings;
  onFinishTest: (typedText: string, timeTakenSeconds: number) => void;
  onCancelTest: () => void;
}

export const TypingScreen: React.FC<TypingScreenProps> = ({
  passage,
  settings,
  onFinishTest,
  onCancelTest,
}) => {
  const TOTAL_TEST_SECONDS = 600; // 10 Minutes exact
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_TEST_SECONDS);
  const [typedText, setTypedText] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFinishedRef = useRef(false);

  // Play start bell on mount
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
    soundService.playStartBell();
    // Auto-focus the typing area
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [settings.soundEnabled]);

  // Main countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeExpired = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    soundService.playFinishBell();
    onFinishTest(typedText, TOTAL_TEST_SECONDS);
  }, [typedText, onFinishTest]);

  const handleManualSubmit = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    soundService.playFinishBell();
    const timeTaken = TOTAL_TEST_SECONDS - secondsRemaining;
    onFinishTest(typedText, timeTaken > 0 ? timeTaken : 1);
  };

  const showTemporaryWarning = (msg: string) => {
    soundService.playWarning();
    setWarningMessage(msg);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 2200);
  };

  // Cursor enforcement: always lock cursor to end of text
  const lockCursorToEnd = () => {
    if (textareaRef.current) {
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  };

  // Strict Keydown handler: Block Backspace, Delete, Navigation, Shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Completely disable Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      showTemporaryWarning('⚠️ Backspace is completely disabled as per CAPF / BSF HCM rules.');
      return;
    }

    // 2. Completely disable Delete
    if (e.key === 'Delete') {
      e.preventDefault();
      showTemporaryWarning('⚠️ Delete key is disabled. Only forward typing is permitted.');
      return;
    }

    // 3. Block Shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+X (Cut), Ctrl+V (Paste), Ctrl+A (Select All)
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (['z', 'y', 'x', 'v', 'a', 'c'].includes(key)) {
        e.preventDefault();
        showTemporaryWarning(`⚠️ Ctrl + ${key.toUpperCase()} is disabled to preserve examination integrity.`);
        return;
      }
    }

    // 4. Block Navigation that moves cursor backwards
    if (['ArrowLeft', 'ArrowUp', 'Home', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      lockCursorToEnd();
      showTemporaryWarning('⚠️ Navigation to previously typed text is disabled.');
      return;
    }

    // Play subtle keystroke click for printable characters
    if (e.key.length === 1 || e.key === 'Enter') {
      soundService.playKeystroke();
    }
  };

  // Block Paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    showTemporaryWarning('⚠️ Pasting text is strictly prohibited in examination mode.');
  };

  // Block Cut event
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  // Enforce forward-only typing during input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Disallow shortening of text (extra safeguard against browser autocomplete/undo)
    if (val.length < typedText.length) {
      showTemporaryWarning('⚠️ Text deletion is blocked.');
      return;
    }
    setTypedText(val);
  };

  // Mouse click / selection redirection: prevent cursor moving to past text
  const handleSelectionOrClick = () => {
    lockCursorToEnd();
  };

  // Live Metrics Calculations
  const elapsedSeconds = TOTAL_TEST_SECONDS - secondsRemaining;
  const elapsedMinutes = Math.max(0.01, elapsedSeconds / 60);
  const keystrokesCount = typedText.length;
  const wordsCount = Math.round((keystrokesCount / 5) * 10) / 10;
  const liveGrossWpm = elapsedSeconds >= 3 ? Math.round((wordsCount / elapsedMinutes) * 10) / 10 : 0;
  
  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = secondsRemaining <= 60 
    ? 'text-rose-600 bg-rose-50 border-rose-400 animate-pulse' 
    : secondsRemaining <= 180 
      ? 'text-amber-600 bg-amber-50 border-amber-300' 
      : 'text-slate-900 bg-white border-slate-300';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100/80 py-6 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Top Examination Status Bar */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  EXAM RUNNER • PASSAGE {passage.number < 10 ? `0${passage.number}` : passage.number}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Passage Screen Hidden
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 m-0">
                CAPF / BSF HCM ENGLISH TYPING TEST
              </h2>
            </div>
          </div>

          {/* Prominent Digital Timer */}
          <div className="flex items-center space-x-4">
            <div className={`px-5 py-2.5 rounded-xl border-2 shadow-sm font-mono flex items-center space-x-2.5 ${timerColor}`}>
              <Clock className="w-5 h-5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500 -mb-1">
                  Time Remaining
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Test</span>
            </button>
          </div>
        </div>

        {/* Live Test Information Bar (Configurable) */}
        {settings.liveStatsEnabled && (
          <div className="bg-slate-900 text-white rounded-xl px-5 py-3 shadow-md grid grid-cols-2 sm:grid-cols-5 gap-3 text-center border-t-2 border-amber-500">
            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Keystrokes</span>
              <span className="text-lg font-black text-white">{keystrokesCount}</span>
            </div>
            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Gross Words</span>
              <span className="text-lg font-black text-amber-400">{wordsCount}</span>
            </div>
            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Gross Speed</span>
              <span className="text-lg font-black text-emerald-400">{liveGrossWpm} <span className="text-xs font-normal">WPM</span></span>
            </div>
            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Time Elapsed</span>
              <span className="text-lg font-black text-white">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Target</span>
              <span className="text-lg font-black text-amber-300">35 WPM</span>
            </div>
          </div>
        )}

        {/* Warning Notification Toast */}
        {warningMessage && (
          <div className="bg-rose-50 border-2 border-rose-500 text-rose-900 px-4 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold shadow-md animate-bounce">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Active Typing Input Area */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 space-y-3 relative">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <label htmlFor="exam-textarea" className="text-xs font-black uppercase tracking-wider text-slate-800">
                TYPE HERE (LOOK AT YOUR PHYSICAL PRINTED PAPER):
              </label>
            </div>
            <span className="text-xs text-rose-600 font-bold tracking-wide">
              🚫 BACKSPACE & DELETE DISABLED
            </span>
          </div>

          {/* Typing Area Textarea */}
          <textarea
            id="exam-textarea"
            ref={textareaRef}
            value={typedText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onCut={handleCut}
            onClick={handleSelectionOrClick}
            onMouseDown={handleSelectionOrClick}
            onSelect={handleSelectionOrClick}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            rows={12}
            className="w-full p-4 border border-slate-300 rounded-xl text-slate-900 font-mono text-base leading-relaxed tracking-normal focus:ring-4 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none resize-none shadow-inner bg-slate-50/40 select-none"
            placeholder="Place your physical printed paper on your desk and start typing here... As per official CAPF / BSF HCM rules, backspace and editing keys are disabled. Type forward accurately."
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <span>Keystrokes: <strong className="text-slate-800">{keystrokesCount}</strong></span>
              <span>•</span>
              <span>Words (strokes/5): <strong className="text-slate-800">{wordsCount}</strong></span>
            </div>
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="text-slate-400 hover:text-rose-600 transition-colors"
            >
              Cancel Test
            </button>
          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Flag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Submit Your Typing Test?</h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              You still have <strong className="text-slate-900">{formatTime(secondsRemaining)}</strong> remaining. 
              Once submitted, your typing performance will be evaluated against the selected passage and final result will be generated.
            </p>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue Typing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleManualSubmit();
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-200">
            <h3 className="text-lg font-bold text-center mb-2">Abort Active Test?</h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              Are you sure you want to cancel this test? Your current typing progress will not be evaluated or saved in test history.
            </p>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                No, Resume Test
              </button>
              <button
                type="button"
                onClick={onCancelTest}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold shadow-md"
              >
                Yes, Abort Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
