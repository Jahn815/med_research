import rawData from '../../palin_form_decoded.json';
import { PalinFormSchema, PalinAnswers, PalinSection, PalinQuestion } from '../types/palinSurvey';

export const palinFormSchema: PalinFormSchema = rawData as unknown as PalinFormSchema;

export interface PalinScores {
  consentAgreed: boolean;
  sbisTotalScore: number;
  sbisMaxScore: number;
  pprsImpactAvg: number;
  pprsConcernAvg: number;
  pprsKnowledgeAvg: number;
  totalAnsweredCount: number;
  totalQuestionsCount: number;
}

export function getAllPalinQuestions(): PalinQuestion[] {
  const allQs: PalinQuestion[] = [];
  palinFormSchema.sections.forEach((sec) => {
    sec.questions.forEach((q) => allQs.push(q));
  });
  return allQs;
}

export function calculatePalinScores(answers: PalinAnswers): PalinScores {
  const allQuestions = getAllPalinQuestions();
  const totalQuestionsCount = allQuestions.length;

  // 1. Consent
  const consentAns = answers[1536400327]; // Q1 id
  const consentAgreed = consentAns === 0 || consentAns === '예' || consentAns === 0;

  // 2. SBIS (Q17 ~ Q21, ids: 2015490662, 1544182638, 1140751121, 2129570078, 676432939)
  const sbisIds = [2015490662, 1544182638, 1140751121, 2129570078, 676432939];
  let sbisTotalScore = 0;
  sbisIds.forEach((id) => {
    const val = answers[id];
    if (typeof val === 'number') {
      sbisTotalScore += val;
    }
  });

  // 3. PPRS Subscales (Q22 ~ Q40, drop-downs with 0-10 values)
  // Subscale 1: Impact on child (Q22~Q31, ids: 1481741321, 1575572212, 107897978, 914545063, 146388951, 859143932, 1623691428, 2094095092, 648032736, 740503268)
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

  const totalAnsweredCount = Object.keys(answers).filter(
    (k) => answers[Number(k)] !== undefined && answers[Number(k)] !== ''
  ).length;

  return {
    consentAgreed,
    sbisTotalScore,
    sbisMaxScore: 20,
    pprsImpactAvg,
    pprsConcernAvg,
    pprsKnowledgeAvg,
    totalAnsweredCount,
    totalQuestionsCount,
  };
}

export function generatePalinSummaryText(answers: PalinAnswers): string {
  const scores = calculatePalinScores(answers);
  const allQs = getAllPalinQuestions();

  let text = `[Palin 부모 평가지 & 기질검사 (Palin Parent Rating Scale) 응답 결과 보고서]\n\n`;
  text += `작성 현황: ${scores.totalAnsweredCount} / ${scores.totalQuestionsCount} 문항 완료\n`;
  text += `연구 동의 여부: ${scores.consentAgreed ? '동의함 (Yes)' : '미동의 (No)'}\n\n`;

  text += `=== 1. 주요 척도 점수 요약 ===\n`;
  text += `- 간편 행동억제기질검사 (SBIS): ${scores.sbisTotalScore}점 / 20점 만점\n`;
  text += `- Palin PPRS [영향 척도]: 평균 ${scores.pprsImpactAvg} / 10점\n`;
  text += `- Palin PPRS [심도 및 부모 걱정]: 평균 ${scores.pprsConcernAvg} / 10점\n`;
  text += `- Palin PPRS [부모 지식 및 대처 자신감]: 평균 ${scores.pprsKnowledgeAvg} / 10점\n\n`;

  text += `=== 2. 세부 문항별 응답 내용 ===\n`;
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
