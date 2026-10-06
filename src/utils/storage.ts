import { INITIAL_PASSAGES } from '../data/passages';
import type { EvaluationResult, Passage, TestHistoryItem, UserSettings } from '../types';

const STORAGE_KEYS = {
  PASSAGES: 'bsf_capf_passages_v2',
  HISTORY: 'bsf_capf_history_v1',
  SETTINGS: 'bsf_capf_settings_v1',
  LAST_SELECTED_PASSAGE: 'bsf_capf_last_passage_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  liveStatsEnabled: true,
  candidateName: 'Candidate',
  rollNumber: 'CAPF-2026-001',
  fontSize: 'medium',
  darkMode: false,
};

// -------------------------------------------------------------
// Passages Storage (Default 50 + Custom)
// -------------------------------------------------------------

export function getPassages(): Passage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(INITIAL_PASSAGES));
      return INITIAL_PASSAGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading passages from localStorage:', err);
  }
  return INITIAL_PASSAGES;
}

export function savePassage(passage: Passage): void {
  const passages = getPassages();
  const existingIdx = passages.findIndex(p => p.id === passage.id);
  if (existingIdx >= 0) {
    passages[existingIdx] = passage;
  } else {
    passages.push(passage);
  }
  localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(passages));
}

export function deletePassage(passageId: string): void {
  const passages = getPassages().filter(p => p.id !== passageId);
  localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(passages));
}

export function resetPassagesToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(INITIAL_PASSAGES));
}

export function getLastSelectedPassageId(): string {
  return localStorage.getItem(STORAGE_KEYS.LAST_SELECTED_PASSAGE) || 'passage-01';
}

export function setLastSelectedPassageId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_SELECTED_PASSAGE, id);
}

// -------------------------------------------------------------
// Test History Storage
// -------------------------------------------------------------

export function getTestHistory(): TestHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading history from localStorage:', err);
  }
  return [];
}

export function saveTestResult(result: EvaluationResult): TestHistoryItem {
  const history = getTestHistory();
  const now = new Date();
  
  const historyItem: TestHistoryItem = {
    id: 'test-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    passageId: result.passageId,
    passageNumber: result.passageNumber,
    passageTitle: result.passageTitle,
    passageLength: result.passageTotalWords,
    timeTakenSeconds: result.timeTakenSeconds,
    grossWpm: result.grossWpm,
    netWpm: result.netWpm,
    accuracy: result.accuracy,
    errors: result.totalMistakes,
    allowedMistakes: result.allowedMistakes,
    status: result.status,
    overallPerformance: result.performanceRating,
    totalKeystrokes: result.totalKeystrokes,
  };

  history.unshift(historyItem); // most recent first
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  return historyItem;
}

export function clearTestHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// -------------------------------------------------------------
// Settings Storage
// -------------------------------------------------------------

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error reading settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}
