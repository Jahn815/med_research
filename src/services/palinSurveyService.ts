import rawData from '../../resources/palin_form_decoded.json';
import type { PalinFormSchema, PalinAnswers, PalinQuestion } from '../types/palinSurvey';
import { palinTranslationsEn } from '../i18n/palinTranslationsEn';

export const palinFormSchema: PalinFormSchema = rawData as unknown as PalinFormSchema;

export interface Factor1Item {
  qNum: number;
  text: string;
  value: number | null;
  weight: number;
  weightedValue: number;
}

export type Factor1LevelKey = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

export interface Factor1Result {
  score: number;
  weightedSum: number;
  answeredCount: number;
  totalItems: number;
  itemDetails: Factor1Item[];
  levelKey: Factor1LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
  rangeInfo: PalinRangeInfo;
}

export interface Factor2Item {
  qNum: number;
  text: string;
  value: number | null;
  weight: number;
  weightedValue: number;
}

export type Factor2RangeKey =
  | 'range_0_0_1_1'
  | 'range_1_2_1_7'
  | 'range_1_8_2_1'
  | 'range_2_2_2_7'
  | 'range_2_8_3_3'
  | 'range_3_4_4_1'
  | 'range_4_2_4_9'
  | 'range_5_0_5_3'
  | 'range_5_4_above';

export interface Factor2RangeInfo {
  rangeKey: Factor2RangeKey;
  rangeLabel: string;
  min: number;
  max: number;
  badgeColor: string;
  descriptionKr: string;
}

export function getFactor2RangeInfo(score: number): Factor2RangeInfo {
  if (score <= 1.1) {
    return {
      rangeKey: 'range_0_0_1_1',
      rangeLabel: '0.0 ~ 1.1점',
      min: 0,
      max: 1.1,
      badgeColor: '#10B981',
      descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.',
    };
  } else if (score <= 1.7) {
    return {
      rangeKey: 'range_1_2_1_7',
      rangeLabel: '1.2 ~ 1.7점',
      min: 1.2,
      max: 1.7,
      badgeColor: '#10B981',
      descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.',
    };
  } else if (score <= 2.1) {
    return {
      rangeKey: 'range_1_8_2_1',
      rangeLabel: '1.8 ~ 2.1점',
      min: 1.8,
      max: 2.1,
      badgeColor: '#10B981',
      descriptionKr:
        '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.',
    };
  } else if (score <= 2.7) {
    return {
      rangeKey: 'range_2_2_2_7',
      rangeLabel: '2.2 ~ 2.7점',
      min: 2.2,
      max: 2.7,
      badgeColor: '#10B981',
      descriptionKr:
        '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.',
    };
  } else if (score <= 3.3) {
    return {
      rangeKey: 'range_2_8_3_3',
      rangeLabel: '2.8 ~ 3.3점',
      min: 2.8,
      max: 3.3,
      badgeColor: '#F59E0B',
      descriptionKr:
        '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.',
    };
  } else if (score <= 4.1) {
    return {
      rangeKey: 'range_3_4_4_1',
      rangeLabel: '3.4 ~ 4.1점',
      min: 3.4,
      max: 4.1,
      badgeColor: '#F59E0B',
      descriptionKr:
        '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'range_4_2_4_9',
      rangeLabel: '4.2 ~ 4.9점',
      min: 4.2,
      max: 4.9,
      badgeColor: '#F97316',
      descriptionKr:
        '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.',
    };
  } else if (score <= 5.3) {
    return {
      rangeKey: 'range_5_0_5_3',
      rangeLabel: '5.0 ~ 5.3점',
      min: 5.0,
      max: 5.3,
      badgeColor: '#F97316',
      descriptionKr:
        '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.',
    };
  } else {
    return {
      rangeKey: 'range_5_4_above',
      rangeLabel: '5.4점 이상',
      min: 5.4,
      max: 10.0,
      badgeColor: '#EF4444',
      descriptionKr:
        '아이의 말더듬으로 인해 상당히 걱정이 크고, 심리적 부담도 크신 상태로 보여요. 이런 마음을 혼자 감당하기보다 담당 언어재활사와 이 부분을 꼭 나누시길 권해드려요.',
    };
  }
}

export type Factor2LevelKey = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

export interface Factor2Result {
  score: number;
  weightedSum: number;
  answeredCount: number;
  totalItems: number;
  itemDetails: Factor2Item[];
  levelKey: Factor2LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
  rangeInfo: Factor2RangeInfo;
}

export interface Factor3Item {
  qNum: number;
  text: string;
  value: number | null;
  weight: number;
  weightedValue: number;
}

export type Factor3RangeKey =
  | 'range_0_0_1_6'
  | 'range_1_7_2_1'
  | 'range_2_2_3_1'
  | 'range_3_2_4_0'
  | 'range_4_1_4_9'
  | 'range_5_0_5_5'
  | 'range_5_6_6_1'
  | 'range_6_2_6_5'
  | 'range_6_6_above';

export interface Factor3RangeInfo {
  rangeKey: Factor3RangeKey;
  rangeLabel: string;
  min: number;
  max: number;
  badgeColor: string;
  descriptionKr: string;
}

export function getFactor3RangeInfo(score: number): Factor3RangeInfo {
  if (score <= 1.6) {
    return {
      rangeKey: 'range_0_0_1_6',
      rangeLabel: '0.0 ~ 1.6점',
      min: 0,
      max: 1.6,
      badgeColor: '#EF4444',
      descriptionKr:
        '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.',
    };
  } else if (score <= 2.1) {
    return {
      rangeKey: 'range_1_7_2_1',
      rangeLabel: '1.7 ~ 2.1점',
      min: 1.7,
      max: 2.1,
      badgeColor: '#EF4444',
      descriptionKr:
        '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.',
    };
  } else if (score <= 3.1) {
    return {
      rangeKey: 'range_2_2_3_1',
      rangeLabel: '2.2 ~ 3.1점',
      min: 2.2,
      max: 3.1,
      badgeColor: '#F97316',
      descriptionKr:
        '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.',
    };
  } else if (score <= 4.0) {
    return {
      rangeKey: 'range_3_2_4_0',
      rangeLabel: '3.2 ~ 4.0점',
      min: 3.2,
      max: 4.0,
      badgeColor: '#F97316',
      descriptionKr:
        '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'range_4_1_4_9',
      rangeLabel: '4.1 ~ 4.9점',
      min: 4.1,
      max: 4.9,
      badgeColor: '#F59E0B',
      descriptionKr:
        '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.',
    };
  } else if (score <= 5.5) {
    return {
      rangeKey: 'range_5_0_5_5',
      rangeLabel: '5.0 ~ 5.5점',
      min: 5.0,
      max: 5.5,
      badgeColor: '#F59E0B',
      descriptionKr:
        '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.',
    };
  } else if (score <= 6.1) {
    return {
      rangeKey: 'range_5_6_6_1',
      rangeLabel: '5.6 ~ 6.1점',
      min: 5.6,
      max: 6.1,
      badgeColor: '#10B981',
      descriptionKr:
        '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.',
    };
  } else if (score <= 6.5) {
    return {
      rangeKey: 'range_6_2_6_5',
      rangeLabel: '6.2 ~ 6.5점',
      min: 6.2,
      max: 6.5,
      badgeColor: '#10B981',
      descriptionKr:
        '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.',
    };
  } else {
    return {
      rangeKey: 'range_6_6_above',
      rangeLabel: '6.6점 이상',
      min: 6.6,
      max: 10.0,
      badgeColor: '#059669',
      descriptionKr:
        '말더듬에 대해 잘 알고 계시고, 아이가 말을 더듬을 때 어떻게 반응하고 도와줘야 할지 자신감 있게 알고 계세요.',
    };
  }
}

export type Factor3LevelKey = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

export interface Factor3Result {
  score: number;
  weightedSum: number;
  answeredCount: number;
  totalItems: number;
  itemDetails: Factor3Item[];
  levelKey: Factor3LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
  rangeInfo: Factor3RangeInfo;
}

export type SBISRangeKey = 'range_0_11' | 'range_12_18' | 'range_19_25';

export interface SBISRangeInfo {
  rangeKey: SBISRangeKey;
  rangeLabel: string;
  min: number;
  max: number;
  badgeColor: string;
  descriptionKr: string;
}

export interface SBISItem {
  id: number;
  qNum: number;
  text: string;
  textEn: string;
  value: number | null;
  score: number;
  selectedLabel: string;
  selectedLabelEn: string;
}

export interface SBISResult {
  totalScore: number;
  maxScore: number;
  answeredCount: number;
  totalItems: number;
  itemDetails: SBISItem[];
  rangeInfo: SBISRangeInfo;
}

export type PalinRangeKey =
  | 'range_0_1_9'
  | 'range_2_0_2_7'
  | 'range_2_8_3_4'
  | 'range_3_5_4_1'
  | 'range_4_2_4_9'
  | 'range_5_0_5_5'
  | 'range_5_6_6_1'
  | 'range_6_2_6_6'
  | 'range_6_7_above';

export interface PalinRangeInfo {
  rangeKey: PalinRangeKey;
  rangeLabel: string;
  min: number;
  max: number;
  badgeColor: string;
  descriptionKr: string;
}

export function getPalinRangeInfo(score: number): PalinRangeInfo {
  if (score <= 1.9) {
    return {
      rangeKey: 'range_0_1_9',
      rangeLabel: '0 ~ 1.9점',
      min: 0,
      max: 1.9,
      badgeColor: '#10B981',
      descriptionKr:
        '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.',
    };
  } else if (score <= 2.7) {
    return {
      rangeKey: 'range_2_0_2_7',
      rangeLabel: '2.0 ~ 2.7점',
      min: 2.0,
      max: 2.7,
      badgeColor: '#10B981',
      descriptionKr:
        '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.',
    };
  } else if (score <= 3.4) {
    return {
      rangeKey: 'range_2_8_3_4',
      rangeLabel: '2.8 ~ 3.4점',
      min: 2.8,
      max: 3.4,
      badgeColor: '#10B981',
      descriptionKr:
        '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.',
    };
  } else if (score <= 4.1) {
    return {
      rangeKey: 'range_3_5_4_1',
      rangeLabel: '3.5 ~ 4.1점',
      min: 3.5,
      max: 4.1,
      badgeColor: '#10B981',
      descriptionKr:
        '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'range_4_2_4_9',
      rangeLabel: '4.2 ~ 4.9점',
      min: 4.2,
      max: 4.9,
      badgeColor: '#F59E0B',
      descriptionKr:
        '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.',
    };
  } else if (score <= 5.5) {
    return {
      rangeKey: 'range_5_0_5_5',
      rangeLabel: '5.0 ~ 5.5점',
      min: 5.0,
      max: 5.5,
      badgeColor: '#F59E0B',
      descriptionKr:
        '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.',
    };
  } else if (score <= 6.1) {
    return {
      rangeKey: 'range_5_6_6_1',
      rangeLabel: '5.6 ~ 6.1점',
      min: 5.6,
      max: 6.1,
      badgeColor: '#F97316',
      descriptionKr:
        '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.',
    };
  } else if (score <= 6.6) {
    return {
      rangeKey: 'range_6_2_6_6',
      rangeLabel: '6.2 ~ 6.6점',
      min: 6.2,
      max: 6.6,
      badgeColor: '#F97316',
      descriptionKr:
        '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.',
    };
  } else {
    return {
      rangeKey: 'range_6_7_above',
      rangeLabel: '6.7점 이상',
      min: 6.7,
      max: 10.0,
      badgeColor: '#EF4444',
      descriptionKr:
        '아이가 말더듬으로 인해 상당한 어려움을 겪고 있는 것으로 보여요. 정서적으로 힘들어하거나 말하는 것을 피하려는 모습이 두드러질 수 있어, 아이의 마음을 살펴보고 전문가와 상의해보시는 것이 도움이 될 수 있어요.',
    };
  }
}

export interface PalinScores {
  consentAgreed: boolean;
  sbisTotalScore: number;
  sbisMaxScore: number;
  sbis: SBISResult;
  pprsImpactAvg: number;
  pprsConcernAvg: number;
  pprsKnowledgeAvg: number;
  palinRange: PalinRangeInfo;
  totalAnsweredCount: number;
  totalQuestionsCount: number;
  factor1: Factor1Result;
  factor2: Factor2Result;
  factor3: Factor3Result;
}

export function getAllPalinQuestions(): PalinQuestion[] {
  const allQs: PalinQuestion[] = [];
  palinFormSchema.sections.forEach((sec) => {
    sec.questions.forEach((q) => allQs.push(q));
  });
  return allQs;
}

export function getFactor1Level(score: number): {
  levelKey: Factor1LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
} {
  if (score <= 2.79) {
    return { levelKey: 'very_high', levelLabelEn: 'Very High', levelLabelKr: '매우 높음', badgeColor: '#EF4444' };
  } else if (score <= 4.19) {
    return { levelKey: 'high', levelLabelEn: 'High', levelLabelKr: '높음', badgeColor: '#F97316' };
  } else if (score <= 5.59) {
    return { levelKey: 'moderate', levelLabelEn: 'Moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  } else if (score <= 6.69) {
    return { levelKey: 'low', levelLabelEn: 'Low', levelLabelKr: '낮음', badgeColor: '#10B981' };
  } else {
    return { levelKey: 'very_low', levelLabelEn: 'Very Low', levelLabelKr: '매우 낮음', badgeColor: '#059669' };
  }
}

export function getFactor2Level(score: number): {
  levelKey: Factor2LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
} {
  if (score <= 1.79) {
    return { levelKey: 'very_high', levelLabelEn: 'Very High', levelLabelKr: '매우 높음', badgeColor: '#EF4444' };
  } else if (score <= 2.79) {
    return { levelKey: 'high', levelLabelEn: 'High', levelLabelKr: '높음', badgeColor: '#F97316' };
  } else if (score <= 4.19) {
    return { levelKey: 'moderate', levelLabelEn: 'Moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  } else if (score <= 5.39) {
    return { levelKey: 'low', levelLabelEn: 'Low', levelLabelKr: '낮음', badgeColor: '#10B981' };
  } else {
    return { levelKey: 'very_low', levelLabelEn: 'Very Low', levelLabelKr: '매우 낮음', badgeColor: '#059669' };
  }
}

export function getFactor3Level(score: number): {
  levelKey: Factor3LevelKey;
  levelLabelEn: string;
  levelLabelKr: string;
  badgeColor: string;
} {
  if (score >= 6.6) {
    return { levelKey: 'very_high', levelLabelEn: 'Very High', levelLabelKr: '매우 높음', badgeColor: '#059669' };
  } else if (score >= 5.6) {
    return { levelKey: 'high', levelLabelEn: 'High', levelLabelKr: '높음', badgeColor: '#10B981' };
  } else if (score >= 4.1) {
    return { levelKey: 'moderate', levelLabelEn: 'Moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  } else if (score >= 2.2) {
    return { levelKey: 'low', levelLabelEn: 'Low', levelLabelKr: '낮음', badgeColor: '#F97316' };
  } else {
    return { levelKey: 'very_low', levelLabelEn: 'Very Low', levelLabelKr: '매우 낮음', badgeColor: '#EF4444' };
  }
}

export function calculateFactor1(answers: PalinAnswers): Factor1Result {
  const factor1Questions = [
    { id: 1481741321, qNum: 22, text: '1) 아이가 말더듬 때문에 말을 적게 합니까?', weight: 0.751 },
    { id: 1575572212, qNum: 23, text: '2) 아이가 얼마나 자신의 말에 좌절감을 느낍니까?', weight: 0.775 },
    { id: 107897978, qNum: 24, text: '3) 아이가 얼마나 자신의 말더듬에 짜증을 냅니까?', weight: 0.786 },
    { id: 914545063, qNum: 25, text: '4) 아이가 얼마나 자신의 말에 대해 불안감을 느낍니까?', weight: 0.783 },
    { id: 146388951, qNum: 26, text: '5) 아이가 얼마나 자신 있게 말합니까?', weight: 0.747 },
    { id: 859143932, qNum: 27, text: '6) 아이가 대체로 얼마나 행복합니까?', weight: 0.59 },
    { id: 1623691428, qNum: 28, text: '7) 아이가 얼마나 자신의 감정을 잘 이야기할 수 있습니까?', weight: 0.525 },
  ];

  let weightedSum = 0;
  let answeredCount = 0;

  const itemDetails: Factor1Item[] = factor1Questions.map((q) => {
    const rawVal = answers[q.id];
    let val: number | null = null;

    if (typeof rawVal === 'number') {
      val = rawVal;
    } else if (typeof rawVal === 'string' && rawVal.trim() !== '' && !isNaN(Number(rawVal))) {
      val = Number(rawVal);
    }

    if (val !== null) {
      weightedSum += val * q.weight;
      answeredCount++;
    }

    return {
      qNum: q.qNum,
      text: q.text,
      value: val,
      weight: q.weight,
      weightedValue: val !== null ? Number((val * q.weight).toFixed(3)) : 0,
    };
  });

  const divisor = answeredCount > 0 ? answeredCount : 7;
  const score = Number((weightedSum / divisor).toFixed(3));
  const levelInfo = getFactor1Level(score);
  const rangeInfo = getPalinRangeInfo(score);

  return {
    score,
    weightedSum: Number(weightedSum.toFixed(3)),
    answeredCount,
    totalItems: 7,
    itemDetails,
    ...levelInfo,
    rangeInfo,
  };
}

export function calculateFactor2(answers: PalinAnswers): Factor2Result {
  const factor2Questions = [
    { id: 2094095092, qNum: 29, text: '8) 아이가 말할 때 얼마나 말하는 것을 힘들어합니까?', weight: 0.703 },
    { id: 648032736, qNum: 30, text: '9) 아이가 유창할 때가 있습니까?', weight: 0.558 },
    { id: 740503268, qNum: 31, text: '10) 아이가 얼마나 자주 말을 더듬습니까?', weight: 0.797 },
    { id: 1050082798, qNum: 32, text: '11) 아이가 얼마나 심하게 말을 더듬습니까?', weight: 0.807 },
    { id: 341804199, qNum: 33, text: '12) 당신은 아이의 말더듬에 대해 얼마나 걱정하고 있습니까?', weight: 0.798 },
    { id: 905335102, qNum: 34, text: '13) 당신은 아이의 말더듬 때문에 얼마나 아이의 미래에 대해 불안해합니까?', weight: 0.779 },
    { id: 1048848859, qNum: 35, text: '14) 말더듬이 당신의 가족에 어느 정도 영향을 끼치고 있습니까?', weight: 0.424 },
  ];

  let weightedSum = 0;
  let answeredCount = 0;

  const itemDetails: Factor2Item[] = factor2Questions.map((q) => {
    const rawVal = answers[q.id];
    let val: number | null = null;

    if (typeof rawVal === 'number') {
      val = rawVal;
    } else if (typeof rawVal === 'string' && rawVal.trim() !== '' && !isNaN(Number(rawVal))) {
      val = Number(rawVal);
    }

    if (val !== null) {
      weightedSum += val * q.weight;
      answeredCount++;
    }

    return {
      qNum: q.qNum,
      text: q.text,
      value: val,
      weight: q.weight,
      weightedValue: val !== null ? Number((val * q.weight).toFixed(3)) : 0,
    };
  });

  const divisor = answeredCount > 0 ? answeredCount : 7;
  const score = Number((weightedSum / divisor).toFixed(3));
  const levelInfo = getFactor2Level(score);
  const rangeInfo = getFactor2RangeInfo(score);

  return {
    score,
    weightedSum: Number(weightedSum.toFixed(3)),
    answeredCount,
    totalItems: 7,
    itemDetails,
    ...levelInfo,
    rangeInfo,
  };
}

export function calculateFactor3(answers: PalinAnswers): Factor3Result {
  const factor3Questions = [
    { id: 1520832689, qNum: 36, text: '15) 당신은 무엇이 아이의 말더듬에 영향을 끼치는지 알고 있습니까?', weight: 0.408 },
    { id: 1667221451, qNum: 37, text: '16a) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? a) 아이가 말을 더듬을 때 적절히 반응하기', weight: 0.771 },
    { id: 1434469522, qNum: 38, text: '16b) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? b) 아이의 말더듬에 대한 인식과 걱정에 대처하기', weight: 0.882 },
    { id: 493302818, qNum: 39, text: '16c) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? c) 아이의 자신감을 키워 주기', weight: 0.836 },
    { id: 705539961, qNum: 40, text: '16d) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? d) 아이의 유창성을 격려하기', weight: 0.873 },
  ];

  let weightedSum = 0;
  let answeredCount = 0;

  const itemDetails: Factor3Item[] = factor3Questions.map((q) => {
    const rawVal = answers[q.id];
    let val: number | null = null;

    if (typeof rawVal === 'number') {
      val = rawVal;
    } else if (typeof rawVal === 'string' && rawVal.trim() !== '' && !isNaN(Number(rawVal))) {
      val = Number(rawVal);
    }

    if (val !== null) {
      weightedSum += val * q.weight;
      answeredCount++;
    }

    return {
      qNum: q.qNum,
      text: q.text,
      value: val,
      weight: q.weight,
      weightedValue: val !== null ? Number((val * q.weight).toFixed(3)) : 0,
    };
  });

  const divisor = answeredCount > 0 ? answeredCount : 5;
  const score = Number((weightedSum / divisor).toFixed(3));
  const levelInfo = getFactor3Level(score);
  const rangeInfo = getFactor3RangeInfo(score);

  return {
    score,
    weightedSum: Number(weightedSum.toFixed(3)),
    answeredCount,
    totalItems: 5,
    itemDetails,
    ...levelInfo,
    rangeInfo,
  };
}

export function calculateSBIS(answers: PalinAnswers): SBISResult {
  const sbisQuestions = [
    { id: 2015490662, qNum: 17, text: '1) 낯선 사람이나 물건에 다가가지 않는다. 또는 가까이 다가간다.' },
    { id: 1544182638, qNum: 18, text: '2) 부모에게서 떨어지지 않는다. 또는 부모에게서 쉽게 떨어진다.' },
    { id: 1140751121, qNum: 19, text: '3) 처음 방문하는 장소에서 조용히 부모 곁에 있는다. 또는 곧바로 주위를 탐색하며 논다.' },
    { id: 2129570078, qNum: 20, text: '4) 새로운 일(게임, 과제)을 할 때 먼저 지켜본다. 또는 곧바로 참여한다.' },
    { id: 676432939, qNum: 21, text: '5) 처음 만나는 사람(어른, 친구)에게 말을 거의 건네지 않는다. 또는 쉽게 말을 건넨다.' },
  ];

  let totalScore = 0;
  let answeredCount = 0;
  const allQs = getAllPalinQuestions();

  const itemDetails: SBISItem[] = sbisQuestions.map((q) => {
    const rawVal = answers[q.id];
    let val: number | null = null;
    let score = 0;

    if (typeof rawVal === 'number') {
      val = rawVal;
    } else if (typeof rawVal === 'string' && rawVal.trim() !== '' && !isNaN(Number(rawVal))) {
      val = Number(rawVal);
    }

    const enObj = palinTranslationsEn[q.id];
    const textEn = enObj?.text || q.text;

    let selectedLabel = '미응답';
    let selectedLabelEn = 'Not answered';

    if (val !== null) {
      score = val + 1; // 1st option = 1 pt, 2nd = 2 pts, 3rd = 3 pts, 4th = 4 pts, 5th = 5 pts
      totalScore += score;
      answeredCount++;

      const qObj = allQs.find((item) => item.id === q.id);
      const choices = qObj?.options?.choices || qObj?.options?.groups?.[0]?.choices;
      const foundChoice = choices?.find((c) => c.value === val);
      if (foundChoice) {
        selectedLabel = foundChoice.label;
      } else {
        selectedLabel = `${score}점`;
      }

      if (enObj?.choices && enObj.choices[val]) {
        selectedLabelEn = enObj.choices[val];
      } else {
        selectedLabelEn = `${score} pts`;
      }
    }

    return {
      id: q.id,
      qNum: q.qNum,
      text: q.text,
      textEn,
      value: val,
      score,
      selectedLabel,
      selectedLabelEn,
    };
  });

  const rangeInfo = getSBISRangeInfo(totalScore);

  return {
    totalScore,
    maxScore: 25,
    answeredCount,
    totalItems: 5,
    itemDetails,
    rangeInfo,
  };
}

export function getSBISRangeInfo(score: number): SBISRangeInfo {
  if (score <= 11) {
    return {
      rangeKey: 'range_0_11',
      rangeLabel: '0 ~ 11점',
      min: 0,
      max: 11,
      badgeColor: '#3B82F6',
      descriptionKr:
        '아이가 낯선 사람이나 새로운 상황에 대해 상당히 조심스럽고 위축된 반응을 보이는 편이에요. 부모님과 떨어지는 것을 어려워하거나, 낯선 사람에게 잘 다가가지 않고, 새로운 환경에 적응하는 데 시간이 오래 걸릴 수 있어요.',
    };
  } else if (score <= 18) {
    return {
      rangeKey: 'range_12_18',
      rangeLabel: '12 ~ 18점',
      min: 12,
      max: 18,
      badgeColor: '#F59E0B',
      descriptionKr:
        '또래 아이들과 비슷한 수준으로, 낯선 상황에서 어느 정도 조심스러운 모습을 보이지만 특별히 심한 편은 아니에요.',
    };
  } else {
    return {
      rangeKey: 'range_19_25',
      rangeLabel: '19 ~ 25점',
      min: 19,
      max: 25,
      badgeColor: '#EF4444',
      descriptionKr:
        '아이가 낯선 사람이나 새로운 상황에도 비교적 쉽게 다가가고 빠르게 적응하는 편이에요. 활발하고 사교적인 성향을 보일 수 있어요.',
    };
  }
}

export function calculatePalinScores(answers: PalinAnswers): PalinScores {
  const allQuestions = getAllPalinQuestions();
  const totalQuestionsCount = allQuestions.length;

  // 1. Consent
  const consentAns = answers[1536400327]; // Q1 id
  const consentAgreed = consentAns === 0 || consentAns === '예' || consentAns === 0;

  // 2. SBIS (Q17 ~ Q21)
  const sbis = calculateSBIS(answers);
  const sbisTotalScore = sbis.totalScore;

  // 3. PPRS Subscales (Q22 ~ Q40)
  const impactIds = [1481741321, 1575572212, 107897978, 914545063, 146388951, 859143932, 1623691428, 2094095092, 648032736, 740503268];
  const concernIds = [1050082798, 341804199, 905335102, 1048848859]; // Q32 ~ Q35
  const knowledgeIds = [1520832689, 1667221451, 1434469522, 493302818, 705539961]; // Q36 ~ Q40

  const calcAvg = (ids: number[]) => {
    let sum = 0;
    let count = 0;
    ids.forEach((id) => {
      const val = answers[id];
      if (typeof val === 'number') {
        sum += val;
        count++;
      }
    });
    return count > 0 ? Number((sum / count).toFixed(1)) : 0;
  };

  const pprsImpactAvg = calcAvg(impactIds);
  const pprsConcernAvg = calcAvg(concernIds);
  const pprsKnowledgeAvg = calcAvg(knowledgeIds);
  const palinRange = getPalinRangeInfo(pprsImpactAvg);

  const totalAnsweredCount = Object.keys(answers).filter(
    (k) => answers[Number(k)] !== undefined && answers[Number(k)] !== ''
  ).length;

  const factor1 = calculateFactor1(answers);
  const factor2 = calculateFactor2(answers);
  const factor3 = calculateFactor3(answers);

  return {
    consentAgreed,
    sbisTotalScore,
    sbisMaxScore: 25,
    sbis,
    pprsImpactAvg,
    pprsConcernAvg,
    pprsKnowledgeAvg,
    palinRange,
    totalAnsweredCount,
    totalQuestionsCount,
    factor1,
    factor2,
    factor3,
  };
}

export function generatePalinSummaryText(answers: PalinAnswers): string {
  const scores = calculatePalinScores(answers);
  const allQs = getAllPalinQuestions();

  let text = `[Palin 부모 평가지 & 기질검사 (Palin Parent Rating Scale) 응답 및 요인 분석 결과 보고서]\n\n`;
  text += `작성 현황: ${scores.totalAnsweredCount} / ${scores.totalQuestionsCount} 문항 완료\n`;
  text += `연구 동의 여부: ${scores.consentAgreed ? '동의함 (Yes)' : '미동의 (No)'}\n\n`;

  text += `=== 1. 요인 점수 (Factor Scores) ===\n`;
  text += `- Factor 1: ${scores.factor1.score}점 [ 평가: ${scores.factor1.levelLabelKr} / ${scores.factor1.levelLabelEn} ] (응답 문항: ${scores.factor1.answeredCount}/${scores.factor1.totalItems})\n`;
  text += `- Factor 2: ${scores.factor2.score}점 [ 평가: ${scores.factor2.levelLabelKr} / ${scores.factor2.levelLabelEn} ] (응답 문항: ${scores.factor2.answeredCount}/${scores.factor2.totalItems})\n`;
  text += `- Factor 3: ${scores.factor3.score}점 [ 평가: ${scores.factor3.levelLabelKr} / ${scores.factor3.levelLabelEn} ] (응답 문항: ${scores.factor3.answeredCount}/${scores.factor3.totalItems})\n\n`;

  text += `=== 2. 주요 하위척도 점수 요약 ===\n`;
  text += `- 간편 행동억제기질검사 (SBIS): ${scores.sbisTotalScore}점 / 20점 만점\n`;
  text += `- Palin PPRS [영향 척도]: 평균 ${scores.pprsImpactAvg} / 10점\n`;
  text += `- Palin PPRS [심도 및 부모 걱정]: 평균 ${scores.pprsConcernAvg} / 10점\n`;
  text += `- Palin PPRS [부모 지식 및 대처 자신감]: 평균 ${scores.pprsKnowledgeAvg} / 10점\n\n`;

  text += `=== 3. 세부 문항별 응답 내용 ===\n`;
  allQs.forEach((q) => {
    const val = answers[q.id];
    let displayVal = '미응답';

    if (val !== undefined && val !== '') {
      if (q.options?.choices) {
        const found = q.options.choices.find((c) => c.value === val);
        displayVal = found ? `${val}: ${found.label}` : String(val);
      } else {
        displayVal = String(val);
      }
    }

    text += `Q${q.number}. ${q.text.trim()}\n   답변: ${displayVal}\n`;
  });

  return text;
}
