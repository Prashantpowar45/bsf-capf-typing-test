export interface Passage {
  id: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  charCount: number;
  source: string;
  category?: string;
  isCustom?: boolean;
}

export type QualificationStatus = 'QUALIFIED' | 'NOT_QUALIFIED';

export type PerformanceRating = 
  | 'EXCELLENT' 
  | 'VERY GOOD' 
  | 'GOOD' 
  | 'AVERAGE' 
  | 'NEEDS IMPROVEMENT';

export interface DiffWord {
  word: string;
  expectedWord?: string;
  status: 'correct' | 'incorrect' | 'missing' | 'extra';
}

export interface EvaluationResult {
  passageId: string;
  passageTitle: string;
  passageNumber: number;
  passageTotalWords: number;
  
  timeTakenSeconds: number; // e.g. 600s
  timeFormatted: string; // e.g. "10:00"
  
  totalKeystrokes: number;
  grossWords: number; // totalKeystrokes / 5
  totalWordsTyped: number;
  
  correctCharacters: number;
  incorrectCharacters: number;
  
  correctWords: number;
  incorrectWords: number;
  totalMistakes: number;
  
  allowedMistakes: number; // 5% of words typed
  allowedMistakesPercent: number; // 5
  excessMistakes: number; // Math.max(0, totalMistakes - allowedMistakes)
  mistakePenaltyWords: number; // excessMistakes * 10
  
  grossWpm: number;
  netWpm: number;
  accuracy: number; // percentage
  targetSpeed: number; // 35 WPM
  
  status: QualificationStatus;
  statusReason: string;
  performanceRating: PerformanceRating;
  
  diffTokens: DiffWord[];
  typedText: string;
  completedAt: string; // ISO date
}

export interface TestHistoryItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  passageId: string;
  passageNumber: number;
  passageTitle: string;
  passageLength: number;
  timeTakenSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  allowedMistakes: number;
  status: QualificationStatus;
  overallPerformance: PerformanceRating;
  totalKeystrokes: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  liveStatsEnabled: boolean;
  candidateName: string;
  rollNumber: string;
  fontSize: 'small' | 'medium' | 'large';
  darkMode: boolean;
}
