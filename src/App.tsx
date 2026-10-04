import { useState } from 'react';
import type { 
  Passage, 
  EvaluationResult, 
  TestHistoryItem, 
  UserSettings 
} from './types';
import { 
  getPassages, 
  savePassage, 
  deletePassage, 
  resetPassagesToDefault, 
  getLastSelectedPassageId, 
  setLastSelectedPassageId, 
  getTestHistory, 
  saveTestResult, 
  clearTestHistory, 
  getUserSettings, 
  saveUserSettings 
} from './utils/storage';
import { evaluateTypingTest } from './utils/evaluation';

import { Navbar } from './components/Navbar';
import { PassageSelection } from './components/PassageSelection';
import { TypingScreen } from './components/TypingScreen';
import { ResultDashboard } from './components/ResultDashboard';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { TestHistory } from './components/TestHistory';
import { PassageManager } from './components/PassageManager';
import { ExamGuidelines } from './components/ExamGuidelines';
import { PrintPassageSheet } from './components/PrintPassageSheet';

export function App() {
  const [activeTab, setActiveTab] = useState<'test' | 'performance' | 'history' | 'passages' | 'guidelines'>('test');
  
  // Storage states
  const [passages, setPassages] = useState<Passage[]>(() => getPassages());
  const [history, setHistory] = useState<TestHistoryItem[]>(() => getTestHistory());
  const [settings, setSettings] = useState<UserSettings>(() => getUserSettings());

  // Active test state
  const [selectedPassage, setSelectedPassage] = useState<Passage>(() => {
    const lastId = getLastSelectedPassageId();
    const found = passages.find(p => p.id === lastId);
    return found || passages[0];
  });
  const [isTestActive, setIsTestActive] = useState(false);
  const [activeResult, setActiveResult] = useState<EvaluationResult | null>(null);

  // Settings handler
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = saveUserSettings(newSettings);
    setSettings(updated);
  };

  // Passage selection handler
  const handleSelectPassage = (passage: Passage) => {
    setSelectedPassage(passage);
    setLastSelectedPassageId(passage.id);
  };

  // Test control handlers
  const handleStartTest = () => {
    setActiveResult(null);
    setIsTestActive(true);
    setActiveTab('test');
  };

  const handleFinishTest = (typedText: string, timeTakenSeconds: number) => {
    const result = evaluateTypingTest(selectedPassage, typedText, timeTakenSeconds);
    saveTestResult(result);
    setHistory(getTestHistory());
    setActiveResult(result);
    setIsTestActive(false);
  };

  const handleCancelTest = () => {
    setIsTestActive(false);
  };

  const handleRetakeTest = () => {
    setActiveResult(null);
    setIsTestActive(true);
  };

  // Passage management handlers
  const handleSavePassage = (passage: Passage) => {
    savePassage(passage);
    const updated = getPassages();
    setPassages(updated);
    if (selectedPassage.id === passage.id) {
      setSelectedPassage(passage);
    }
  };

  const handleDeletePassage = (passageId: string) => {
    deletePassage(passageId);
    const updated = getPassages();
    setPassages(updated);
    if (selectedPassage.id === passageId && updated.length > 0) {
      setSelectedPassage(updated[0]);
    }
  };

  const handleResetPassages = () => {
    resetPassagesToDefault();
    const updated = getPassages();
    setPassages(updated);
    if (updated.length > 0) {
      setSelectedPassage(updated[0]);
    }
  };

  // Clear history handler
  const handleClearHistory = () => {
    clearTestHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveResult(null);
          setActiveTab(tab);
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isTestActive={isTestActive}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full pb-12">
        {/* TAB 1: TYPING TEST */}
        {activeTab === 'test' && (
          <>
            {isTestActive ? (
              <TypingScreen
                passage={selectedPassage}
                settings={settings}
                onFinishTest={handleFinishTest}
                onCancelTest={handleCancelTest}
              />
            ) : activeResult ? (
              <ResultDashboard
                result={activeResult}
                settings={settings}
                onRetakeTest={handleRetakeTest}
                onViewHistory={() => {
                  setActiveResult(null);
                  setActiveTab('history');
                }}
              />
            ) : (
              <PassageSelection
                passages={passages}
                selectedPassage={selectedPassage}
                onSelectPassage={handleSelectPassage}
                onStartTest={handleStartTest}
              />
            )}
          </>
        )}

        {/* TAB 2: PERFORMANCE DASHBOARD */}
        {activeTab === 'performance' && (
          <PerformanceDashboard
            history={history}
            onStartNewTest={() => {
              setActiveResult(null);
              setActiveTab('test');
            }}
          />
        )}

        {/* TAB 3: TEST HISTORY */}
        {activeTab === 'history' && (
          <TestHistory
            history={history}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* TAB 4: PASSAGE MANAGEMENT */}
        {activeTab === 'passages' && (
          <PassageManager
            passages={passages}
            onSavePassage={handleSavePassage}
            onDeletePassage={handleDeletePassage}
            onResetPassages={handleResetPassages}
            onSelectForTest={(p) => {
              handleSelectPassage(p);
              setActiveTab('test');
              setActiveResult(null);
            }}
          />
        )}

        {/* TAB 5: EXAM GUIDELINES */}
        {activeTab === 'guidelines' && (
          <ExamGuidelines
            onStartTest={() => {
              setActiveTab('test');
              setActiveResult(null);
            }}
          />
        )}
      </main>

      {/* Hidden during screen viewing, visible ONLY when printing A4 question paper sheet */}
      <PrintPassageSheet
        passage={selectedPassage}
        settings={settings}
      />

      {/* Footer (hidden when test is active or when printing) */}
      {!isTestActive && (
        <footer className="no-print bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <p className="font-semibold text-slate-400">
              CAPF / BSF HCM (Head Constable Ministerial) English Typing Examination Simulator
            </p>
            <p>
              Simulates authentic 10-Minute Paper-to-Screen examination environment with 35 WPM standard, 5-keystroke word calculation, and 5% practice mistake allowance.
            </p>
            <p className="text-slate-600 text-[11px] pt-2">
              All 50 official passages preserved with 100% exact text fidelity • Created for Prashant Powar
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
