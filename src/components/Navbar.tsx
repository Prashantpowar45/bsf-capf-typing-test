import React, { useState } from 'react';
import { 
  Keyboard, 
  BarChart3, 
  History, 
  BookOpen, 
  FileText, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Settings, 
  ShieldCheck,
  User
} from 'lucide-react';
import type { UserSettings } from '../types';

interface NavbarProps {
  activeTab: 'test' | 'performance' | 'history' | 'passages' | 'guidelines';
  setActiveTab: (tab: 'test' | 'performance' | 'history' | 'passages' | 'guidelines') => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  isTestActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  isTestActive,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [candidateName, setCandidateName] = useState(settings.candidateName);
  const [rollNumber, setRollNumber] = useState(settings.rollNumber);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const openSettings = () => {
    setCandidateName(settings.candidateName);
    setRollNumber(settings.rollNumber);
    setShowSettingsModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      candidateName: candidateName.trim(),
      rollNumber: rollNumber.trim(),
    });
    setShowSettingsModal(false);
  };

  return (
    <header className="no-print bg-slate-950/95 backdrop-blur-xl text-white border-b border-white/10 shadow-lg shadow-slate-950/10 sticky top-0 z-40">
      {/* Top Government-Style Strip */}
      <div className="hidden sm:flex bg-black/20 px-4 py-1.5 text-[11px] text-slate-400 justify-between items-center border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold tracking-wider text-slate-300">
            CAPF & BSF HCM TYPING PRACTICE SIMULATOR
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span>Standard: 35 WPM / 10 Min</span>
          <span>•</span>
          <span>Paper-To-Screen Mode</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">5% Mistake Relaxation Enabled</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => !isTestActive && setActiveTab('test')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white m-0">
                  CAPF / BSF HCM
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
                  Paper-To-Screen
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                English Typing Examination Simulator (10 Minutes • 35 WPM Target)
              </p>
            </div>
          </div>

          {/* Navigation Links - Hidden during active test to prevent distraction */}
          {!isTestActive ? (
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => setActiveTab('test')}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'test'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                <span>Typing Test</span>
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'performance'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Performance</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Test History</span>
              </button>

              <button
                onClick={() => setActiveTab('passages')}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'passages'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Passages</span>
              </button>

              <button
                onClick={() => setActiveTab('guidelines')}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'guidelines'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Exam Rules</span>
              </button>
            </nav>
          ) : (
            <div className="flex items-center space-x-2 bg-rose-950/70 border border-rose-600/50 px-3 py-1 rounded-md text-rose-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Test in Progress • Strictly No Backspace</span>
            </div>
          )}

          {/* Action Utilities */}
          <div className="flex items-center space-x-2">
            {/* Audio Toggle */}
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              title={settings.soundEnabled ? 'Mute Sounds' : 'Enable Key Sound'}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Examination Mode'}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Candidate Profile / Settings */}
            {!isTestActive && (
              <button
                onClick={openSettings}
                title="Candidate Profile & Settings"
                className="flex items-center space-x-2 bg-white/8 hover:bg-white/12 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[100px] truncate">{settings.candidateName}</span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        {!isTestActive && (
          <div className="flex md:hidden overflow-x-auto py-2.5 space-x-2 border-t border-white/5 scrollbar-none">
            <button
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeTab === 'test' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Typing Test
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeTab === 'performance' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeTab === 'history' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('passages')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeTab === 'passages' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              50 Passages
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeTab === 'guidelines' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Rules
            </button>
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-600">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Candidate Exam Details</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Roll Number / Registration No.
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. BSF-HCM-2026-9021"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Typewriter Mechanical Sounds</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="h-4 w-4 text-amber-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-medium text-slate-700 block">Display Live Speed Stats</span>
                    <span className="text-[11px] text-slate-400">WPM, strokes and elapsed time during practice</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.liveStatsEnabled}
                    onChange={(e) => onUpdateSettings({ liveStatsEnabled: e.target.checked })}
                    className="h-4 w-4 text-amber-600 rounded"
                  />
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-700 block mb-2">Typing Font Size</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: 'small' })}
                      className={settings.fontSize === 'small'
                        ? 'px-3 py-2 rounded-lg border border-amber-500 bg-amber-50 text-amber-800 text-xs font-bold'
                        : 'px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50'}
                    >
                      Small
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: 'medium' })}
                      className={settings.fontSize === 'medium'
                        ? 'px-3 py-2 rounded-lg border border-amber-500 bg-amber-50 text-amber-800 text-xs font-bold'
                        : 'px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50'}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: 'large' })}
                      className={settings.fontSize === 'large'
                        ? 'px-3 py-2 rounded-lg border border-amber-500 bg-amber-50 text-amber-800 text-xs font-bold'
                        : 'px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50'}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-bold shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
