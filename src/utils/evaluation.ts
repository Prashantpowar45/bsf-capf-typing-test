import type { DiffWord, EvaluationResult, Passage, PerformanceRating, QualificationStatus } from '../types';

/**
 * Standard Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Word alignment algorithm to match typed words with original passage words
 * preventing cascade errors when a word is skipped or inserted.
 */
export function alignWords(targetWords: string[], typedWords: string[]): DiffWord[] {
  const m = targetWords.length;
  const n = typedWords.length;

  // dp table for word matching cost
  // Cost: 0 if exact match, distance / maxLen if substitution, 1 for insertion/deletion
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const wTarget = targetWords[i - 1];
      const wTyped = typedWords[j - 1];
      const matchCost = wTarget === wTyped ? 0 : 0.4 + 0.6 * (levenshteinDistance(wTarget, wTyped) / Math.max(wTarget.length, wTyped.length));

      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + matchCost, // substitution or match
        dp[i - 1][j] + 1,             // target word omitted by user
        dp[i][j - 1] + 1              // extra word inserted by user
      );
    }
  }

  // Backtrack to build the diff
  let i = m;
  let j = n;
  const aligned: DiffWord[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const wTarget = targetWords[i - 1];
      const wTyped = typedWords[j - 1];
      const matchCost = wTarget === wTyped ? 0 : 0.4 + 0.6 * (levenshteinDistance(wTarget, wTyped) / Math.max(wTarget.length, wTyped.length));

      if (Math.abs(dp[i][j] - (dp[i - 1][j - 1] + matchCost)) < 1e-5) {
        if (wTarget === wTyped) {
          aligned.push({ word: wTyped, expectedWord: wTarget, status: 'correct' });
        } else {
          aligned.push({ word: wTyped, expectedWord: wTarget, status: 'incorrect' });
        }
        i--;
        j--;
        continue;
      }
    }

    if (j > 0 && (i === 0 || Math.abs(dp[i][j] - (dp[i][j - 1] + 1)) < 1e-5)) {
      // User typed an extra word
      aligned.push({ word: typedWords[j - 1], status: 'extra' });
      j--;
    } else if (i > 0) {
      // User missed / omitted target word
      aligned.push({ word: '', expectedWord: targetWords[i - 1], status: 'missing' });
      i--;
    }
  }

  return aligned.reverse();
}

/**
 * CAPF / BSF HCM Official Evaluation Engine
 * Rules:
 * - 5 keystrokes = 1 word (Gross words = totalKeystrokes / 5)
 * - 5% mistake relaxation = (words typed * 5%)
 * - Penalty: for every mistake exceeding 5%, 10 words (50 strokes) deducted
 * - Target Speed: 35 WPM (Net WPM >= 35.0 required for Qualification)
 */
export function evaluateTypingTest(
  passage: Passage,
  typedText: string,
  timeTakenSeconds: number = 600
): EvaluationResult {
  const targetWords = passage.content.trim().split(/\s+/).filter(Boolean);
  const rawTypedWords = typedText.trim().split(/\s+/).filter(Boolean);

  const totalKeystrokes = typedText.length;
  // 5 Keystrokes = 1 word
  const grossWords = totalKeystrokes / 5;
  const totalWordsTyped = rawTypedWords.length;
  const timeInMinutes = Math.max(0.1, timeTakenSeconds / 60);

  // Align words to identify correct, incorrect, missing, and extra words
  const alignedTokens = alignWords(targetWords, rawTypedWords);

  let correctWords = 0;
  let incorrectWords = 0;
  let missingWords = 0;
  let extraWords = 0;

  // Only omissions inside the attempted portion should be penalized.
  // Trailing passage words that the candidate never reached are not mistakes.
  let lastAttemptedTokenIndex = -1;
  alignedTokens.forEach((token, index) => {
    if (token.status !== 'missing') {
      lastAttemptedTokenIndex = index;
    }
  });

  alignedTokens.forEach((token, index) => {
    if (token.status === 'correct') {
      correctWords++;
    } else if (token.status === 'incorrect') {
      incorrectWords++;
    } else if (token.status === 'missing' && index <= lastAttemptedTokenIndex) {
      missingWords++;
    } else if (token.status === 'extra') {
      extraWords++;
    }
  });

  // Actual mistakes inside the attempted stream include substitutions,
  // inserted words, and omitted words before the last attempted token.
  const totalMistakes = incorrectWords + extraWords + missingWords;

  // Do not flood the review with the untouched remainder of the passage.
  const diffTokens = lastAttemptedTokenIndex >= 0
    ? alignedTokens.slice(0, lastAttemptedTokenIndex + 1)
    : [];

  // Character level statistics
  let correctCharacters = 0;
  let incorrectCharacters = 0;
  for (let c = 0; c < typedText.length; c++) {
    if (c < passage.content.length && typedText[c] === passage.content[c]) {
      correctCharacters++;
    } else {
      incorrectCharacters++;
    }
  }

  // 5% Mistake Allowance calculation
  // Formula: Allowed Mistakes = Words Typed * 5%
  // Using standard exam rounding (Math.round)
  const allowedMistakes = Math.round(totalWordsTyped * 0.05);
  const excessMistakes = Math.max(0, totalMistakes - allowedMistakes);
  
  // BSF HCM Penalty Deduction:
  // For each excess mistake over 5%, 10 words are deducted from total gross words
  const mistakePenaltyWords = excessMistakes * 10;
  const netWords = Math.max(0, grossWords - mistakePenaltyWords);

  // Speed calculations
  const grossWpm = Math.round((grossWords / timeInMinutes) * 10) / 10;
  const netWpm = Math.round((netWords / timeInMinutes) * 10) / 10;

  // Accuracy calculation (percentage)
  const accuracy = totalKeystrokes > 0 
    ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - (totalMistakes * 5)) / totalKeystrokes) * 1000) / 10))
    : 0;

  // Target Speed
  const targetSpeed = 35;

  // Qualification Decision
  let status: QualificationStatus = 'NOT_QUALIFIED';
  let statusReason = '';

  if (netWpm >= targetSpeed) {
    status = 'QUALIFIED';
    statusReason = `Required target speed of ${targetSpeed} WPM achieved! Net speed of ${netWpm} WPM with ${totalMistakes} mistakes (${allowedMistakes} allowed under 5% practice relaxation).`;
  } else {
    status = 'NOT_QUALIFIED';
    if (grossWpm < targetSpeed) {
      statusReason = `Gross speed of ${grossWpm} WPM did not reach the minimum ${targetSpeed} WPM target speed threshold.`;
    } else if (excessMistakes > 0) {
      statusReason = `Net speed of ${netWpm} WPM is below the required ${targetSpeed} WPM target due to ${excessMistakes} excess mistakes exceeding the 5% allowance (${mistakePenaltyWords} words deducted).`;
    } else {
      statusReason = `Net speed of ${netWpm} WPM is below the mandatory ${targetSpeed} WPM requirement.`;
    }
  }

  // Performance Rating Determination
  let performanceRating: PerformanceRating = 'NEEDS IMPROVEMENT';
  if (netWpm >= 45 && accuracy >= 97) {
    performanceRating = 'EXCELLENT';
  } else if (netWpm >= 38 && accuracy >= 95) {
    performanceRating = 'VERY GOOD';
  } else if (netWpm >= 35 && accuracy >= 90) {
    performanceRating = 'GOOD';
  } else if (netWpm >= 28) {
    performanceRating = 'AVERAGE';
  } else {
    performanceRating = 'NEEDS IMPROVEMENT';
  }

  // Format time (e.g. 10:00)
  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    passageId: passage.id,
    passageTitle: passage.title,
    passageNumber: passage.number,
    passageTotalWords: passage.wordCount,
    
    timeTakenSeconds,
    timeFormatted,
    
    totalKeystrokes,
    grossWords: Math.round(grossWords * 10) / 10,
    totalWordsTyped,
    
    correctCharacters,
    incorrectCharacters,
    
    correctWords,
    incorrectWords,
    totalMistakes,
    
    allowedMistakes,
    allowedMistakesPercent: 5,
    excessMistakes,
    mistakePenaltyWords,
    
    grossWpm,
    netWpm,
    accuracy,
    targetSpeed,
    
    status,
    statusReason,
    performanceRating,
    
    diffTokens,
    typedText,
    completedAt: new Date().toISOString(),
  };
}
