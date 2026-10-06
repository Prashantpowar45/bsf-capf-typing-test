import React, { useState } from 'react';
import { 
  Printer, 
  Play, 
  Search, 
  BookOpen, 
  Shuffle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import type { Passage } from '../types';

interface PassageSelectionProps {
  passages: Passage[];
  selectedPassage: Passage;
  onSelectPassage: (passage: Passage) => void;
  onStartTest: () => void;
}

export const PassageSelection: React.FC<PassageSelectionProps> = ({
  passages,
  selectedPassage,
  onSelectPassage,
  onStartTest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hasPrintedOrViewed, setHasPrintedOrViewed] = useState(false);

  const filteredPassages = passages.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.number.toString().includes(q) ||
      `passage ${p.number}`.includes(q)
    );
  });

  const handleSelectAndPreview = (p: Passage) => {
    onSelectPassage(p);
    setShowPreviewModal(true);
  };

  const handleRandomSelect = () => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    const p = passages[randomIndex];
    onSelectPassage(p);
    setShowPreviewModal(true);
  };

  const handlePrint = () => {
    setHasPrintedOrViewed(true);
    document.body.dataset.printMode = 'passage';
    window.print();
    delete document.body.dataset.printMode;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Exam Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-l-8 border-amber-500 mb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exam-Style Practice Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Select & Print Your Examination Passage
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Use this paper-to-screen practice mode to type while looking at a printed passage. 
            Choose any passage from the official 50-matter library below, click <strong className="text-white">View / Print</strong>, 
            keep the physical sheet on your desk, and begin your 10-minute test.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-700/60">
            <div className="border-r border-slate-800 pr-2">
              <span className="text-slate-400 block">Exam Duration</span>
              <strong className="text-sm font-bold text-white">10 Minutes</strong>
            </div>
            <div className="border-r border-slate-800 pr-2">
              <span className="text-slate-400 block">Required Speed</span>
              <strong className="text-sm font-bold text-emerald-400">35 WPM Target</strong>
            </div>
            <div className="border-r border-slate-800 pr-2">
              <span className="text-slate-400 block">Backspace Key</span>
              <strong className="text-sm font-bold text-rose-400">Strictly Disabled</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Mistake Allowance</span>
              <strong className="text-sm font-bold text-amber-400">5% Relaxation</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Passage Quick Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-300 shrink-0">
            {selectedPassage.number < 10 ? `0${selectedPassage.number}` : selectedPassage.number}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Selected for Test
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {selectedPassage.wordCount} Words • {selectedPassage.charCount} Characters
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {selectedPassage.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 border border-slate-300 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>View / Print Passage</span>
          </button>

          <button
            onClick={onStartTest}
            className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start 10-Min Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Passage Library Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or passage number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-semibold">
            Showing {filteredPassages.length} of {passages.length} passages
          </span>

          <button
            onClick={handleRandomSelect}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-600" />
            <span>Random Passage</span>
          </button>
        </div>
      </div>

      {/* Passages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPassages.map((passage) => {
          const isSelected = selectedPassage.id === passage.id;
          return (
            <div
              key={passage.id}
              className={`bg-white rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                    Passage {passage.number < 10 ? `0${passage.number}` : passage.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {passage.wordCount} Words
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-2">
                  {passage.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-serif">
                  {passage.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSelectAndPreview(passage)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View / Print</span>
                </button>

                <button
                  onClick={() => {
                    onSelectPassage(passage);
                    onStartTest();
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  <span>Select & Start</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View & Print Passage Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-600 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  {selectedPassage.number < 10 ? `0${selectedPassage.number}` : selectedPassage.number}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white m-0">
                    {selectedPassage.title}
                  </h3>
                  <p className="text-xs text-slate-400 m-0">
                    Passage Length: {selectedPassage.wordCount} Words • {selectedPassage.charCount} Characters
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border-b border-amber-200 p-3.5 flex items-start space-x-3 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold uppercase tracking-wider text-amber-950 mb-0.5">
                  CRITICAL EXAMINATION NOTICE (PAPER-TO-SCREEN MODE):
                </p>
                Please print this passage or read it from your physical printed paper. 
                <strong className="text-amber-950"> Once you click "Start Typing Test", this passage will completely disappear from the screen!</strong> 
                You must type looking strictly at the physical paper.
              </div>
            </div>

            {/* Passage Body Text */}
            <div className="p-6 overflow-y-auto font-serif text-[15px] leading-relaxed text-slate-900 bg-slate-50/50 select-text">
              <div className="bg-white p-5 border border-slate-300 rounded-lg shadow-inner">
                {selectedPassage.content}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-sm font-bold flex items-center space-x-2 border border-slate-300 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Print Passage (Exam Sheet)</span>
                </button>
                {hasPrintedOrViewed && (
                  <span className="hidden sm:inline-flex items-center text-xs font-semibold text-emerald-700 space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ready for test</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    onStartTest();
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Typing Test Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
