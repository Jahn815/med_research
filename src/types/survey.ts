export interface ChildInfo {
  childName: string;
  birthDate: string;
  ageMonths: string;
  gender: 'male' | 'female' | '';
  respondentRole: 'mother' | 'father' | 'grandparent' | 'other' | '';
  surveyDate: string;
}

export interface StutteringOnset {
  onsetAge: string;
  onsetSpeed: 'sudden' | 'gradual' | '';
  symptoms: string[];
  severityRating: number; // 1 to 5
}

export interface SituationalImpact {
  worseningSituations: string[];
  childReaction: string[];
  avoidanceBehavior: string;
}

export interface FamilyAndConcerns {
  familyHistory: 'yes' | 'no' | 'unknown' | '';
  parentConcernLevel: number; // 1 to 5
  therapistNotes: string;
}

export interface SurveyState {
  childInfo: ChildInfo;
  onset: StutteringOnset;
  situations: SituationalImpact;
  family: FamilyAndConcerns;
}

export type SurveySection = 'info' | 'onset' | 'situations' | 'family';
