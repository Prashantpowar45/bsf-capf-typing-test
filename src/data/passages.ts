// BSF HCM typing practice matter imported from the user-provided PDF.
import { PDF_PASSAGES_01 } from './pdfPassages01';
import { PDF_PASSAGES_02 } from './pdfPassages02';
import { PDF_PASSAGES_03 } from './pdfPassages03';
import { PDF_PASSAGES_04 } from './pdfPassages04';
import { PDF_PASSAGES_05 } from './pdfPassages05';
import { PDF_PASSAGES_06 } from './pdfPassages06';

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

export const INITIAL_PASSAGES: Passage[] = [
  ...PDF_PASSAGES_01,
  ...PDF_PASSAGES_02,
  ...PDF_PASSAGES_03,
  ...PDF_PASSAGES_04,
  ...PDF_PASSAGES_05,
  ...PDF_PASSAGES_06,
];
