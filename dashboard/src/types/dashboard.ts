import type { FirestoreSurveyDoc } from '../firebase';

export type { FirestoreSurveyDoc };

export interface ClinicalRangeInfo {
  rangeKey: string;
  rangeLabel: string;
  min: number;
  max: number;
  badgeColor: string;
  descriptionKr: string;
}

export interface FactorScoreSummary {
  score: number;
  rangeInfo: ClinicalRangeInfo;
}

export interface SurveyCalculatedScores {
  sbisTotalScore: number;
  sbisRange: ClinicalRangeInfo;
  factor1Score: number;
  factor1Range: ClinicalRangeInfo;
  factor2Score: number;
  factor2Range: ClinicalRangeInfo;
  factor3Score: number;
  factor3Range: ClinicalRangeInfo;
}

export interface SurveyFilterOptions {
  searchQuery: string;
  sbisFilter: string;
  factor1Filter: string;
  dateSort: 'desc' | 'asc';
}
