export interface PalinChoice {
  value: number;
  label: string;
  score?: number | null;
  is_other?: boolean;
}

export interface PalinScale {
  low: number;
  high: number;
  low_label: string;
  high_label: string;
}

export interface PalinGroup {
  group_id: number;
  choices: PalinChoice[];
  shuffle?: boolean;
  scale?: PalinScale | null;
}

export interface PalinQuestionOptions {
  groups?: PalinGroup[];
  choices?: PalinChoice[];
  shuffle?: boolean;
  scale?: PalinScale | null;
}

export type PalinQuestionType = 'radio' | 'paragraph' | 'short_answer' | 'grid' | 'dropdown';

export interface PalinQuestion {
  id: number;
  number: number;
  text: string;
  description?: string | null;
  type: PalinQuestionType;
  options?: PalinQuestionOptions | null;
}

export interface PalinSubsection {
  title: string;
  description?: string;
  questions?: PalinQuestion[];
}

export interface PalinSection {
  title: string;
  description?: string | null;
  extra?: any;
  subsections?: PalinSubsection[];
  questions: PalinQuestion[];
}

export interface PalinFormSchema {
  title: string;
  description: string;
  confirmation_message: string;
  locale: string;
  sections: PalinSection[];
}

export type PalinAnswers = Record<number, string | number>;
