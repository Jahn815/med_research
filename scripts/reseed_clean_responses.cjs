const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAeEkILjMg4XWLYk3AbAeICJW6t72HDXWs",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "med-research-e4ae6.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "med-research-e4ae6",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "med-research-e4ae6.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "196756062260",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:196756062260:web:850302c2bd7b998c3d0a61"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getFactor1Level(score) {
  if (score <= 2.79) return { levelKey: 'very_high', levelLabelKr: '매우 높음', badgeColor: '#EF4444' };
  if (score <= 4.19) return { levelKey: 'high', levelLabelKr: '높음', badgeColor: '#F97316' };
  if (score <= 5.59) return { levelKey: 'moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  if (score <= 6.69) return { levelKey: 'low', levelLabelKr: '낮음', badgeColor: '#10B981' };
  return { levelKey: 'very_low', levelLabelKr: '매우 낮음', badgeColor: '#059669' };
}

function getFactor2Level(score) {
  if (score <= 1.79) return { levelKey: 'very_high', levelLabelKr: '매우 높음', badgeColor: '#EF4444' };
  if (score <= 2.79) return { levelKey: 'high', levelLabelKr: '높음', badgeColor: '#F97316' };
  if (score <= 4.19) return { levelKey: 'moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  if (score <= 5.39) return { levelKey: 'low', levelLabelKr: '낮음', badgeColor: '#10B981' };
  return { levelKey: 'very_low', levelLabelKr: '매우 낮음', badgeColor: '#059669' };
}

function getFactor3Level(score) {
  if (score >= 6.6) return { levelKey: 'very_high', levelLabelKr: '매우 높음', badgeColor: '#059669' };
  if (score >= 5.6) return { levelKey: 'high', levelLabelKr: '높음', badgeColor: '#10B981' };
  if (score >= 4.1) return { levelKey: 'moderate', levelLabelKr: '보통', badgeColor: '#F59E0B' };
  if (score >= 2.2) return { levelKey: 'low', levelLabelKr: '낮음', badgeColor: '#F97316' };
  return { levelKey: 'very_low', levelLabelKr: '매우 낮음', badgeColor: '#EF4444' };
}

function getSBISRangeInfo(score) {
  if (score <= 11) {
    return {
      rangeKey: 'range_0_11',
      rangeLabel: '0 ~ 11점',
      min: 0, max: 11, badgeColor: '#EF4444',
      descriptionKr: '아이가 낯선 사람이나 새로운 상황에 대해 상당히 조심스럽고 위축된 반응을 보이는 편이에요. 부모님과 떨어지는 것을 어려워하거나, 낯선 사람에게 잘 다가가지 않고, 새로운 환경에 적응하는 데 시간이 오래 걸릴 수 있어요.'
    };
  } else if (score <= 18) {
    return {
      rangeKey: 'range_12_18',
      rangeLabel: '12 ~ 18점',
      min: 12, max: 18, badgeColor: '#F59E0B',
      descriptionKr: '또래 아이들과 비슷한 수준으로, 낯선 상황에서 어느 정도 조심스러운 모습을 보이지만 특별히 심한 편은 아니에요.'
    };
  } else {
    return {
      rangeKey: 'range_19_25',
      rangeLabel: '19 ~ 25점',
      min: 19, max: 25, badgeColor: '#10B981',
      descriptionKr: '아이가 낯선 사람이나 새로운 상황에도 비교적 쉽게 다가가고 빠르게 적응하는 편이에요. 활발하고 사교적인 성향을 보일 수 있어요.'
    };
  }
}

function getFactor1RangeInfo(score) {
  if (score <= 1.9) return { rangeLabel: '0 ~ 1.9점', descriptionKr: '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.' };
  if (score <= 2.7) return { rangeLabel: '2.0 ~ 2.7점', descriptionKr: '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.' };
  if (score <= 3.4) return { rangeLabel: '2.8 ~ 3.4점', descriptionKr: '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.' };
  if (score <= 4.1) return { rangeLabel: '3.5 ~ 4.1점', descriptionKr: '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.' };
  if (score <= 4.9) return { rangeLabel: '4.2 ~ 4.9점', descriptionKr: '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.' };
  if (score <= 5.5) return { rangeLabel: '5.0 ~ 5.5점', descriptionKr: '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.' };
  if (score <= 6.1) return { rangeLabel: '5.6 ~ 6.1점', descriptionKr: '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.' };
  if (score <= 6.6) return { rangeLabel: '6.2 ~ 6.6점', descriptionKr: '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.' };
  return { rangeLabel: '6.7점 이상', descriptionKr: '아이가 말더듬으로 인해 상당한 어려움을 겪고 있는 것으로 보여요. 정서적으로 힘들어하거나 말하는 것을 피하려는 모습이 두드러질 수 있어, 아이의 마음을 살펴보고 전문가와 상의해보시는 것이 도움이 될 수 있어요.' };
}

function getFactor2RangeInfo(score) {
  if (score <= 1.1) return { rangeLabel: '0.0 ~ 1.1점', descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.' };
  if (score <= 1.7) return { rangeLabel: '1.2 ~ 1.7점', descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.' };
  if (score <= 2.1) return { rangeLabel: '1.8 ~ 2.1점', descriptionKr: '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.' };
  if (score <= 2.7) return { rangeLabel: '2.2 ~ 2.7점', descriptionKr: '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.' };
  if (score <= 3.3) return { rangeLabel: '2.8 ~ 3.3점', descriptionKr: '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.' };
  if (score <= 4.1) return { rangeLabel: '3.4 ~ 4.1점', descriptionKr: '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.' };
  if (score <= 4.9) return { rangeLabel: '4.2 ~ 4.9점', descriptionKr: '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.' };
  if (score <= 5.3) return { rangeLabel: '5.0 ~ 5.3점', descriptionKr: '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.' };
  return { rangeLabel: '5.4점 이상', descriptionKr: '아이의 말더듬으로 인해 상당히 걱정이 크고, 심리적 부담도 크신 상태로 보여요. 이런 마음을 혼자 감당하기보다 담당 언어재활사와 이 부분을 꼭 나누시길 권해드려요.' };
}

function getFactor3RangeInfo(score) {
  if (score <= 1.6) return { rangeLabel: '0.0 ~ 1.6점', descriptionKr: '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.' };
  if (score <= 2.1) return { rangeLabel: '1.7 ~ 2.1점', descriptionKr: '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.' };
  if (score <= 3.1) return { rangeLabel: '2.2 ~ 3.1점', descriptionKr: '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.' };
  if (score <= 4.0) return { rangeLabel: '3.2 ~ 4.0점', descriptionKr: '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.' };
  if (score <= 4.9) return { rangeLabel: '4.1 ~ 4.9점', descriptionKr: '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.' };
  if (score <= 5.5) return { rangeLabel: '5.0 ~ 5.5점', descriptionKr: '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.' };
  if (score <= 6.1) return { rangeLabel: '5.6 ~ 6.1점', descriptionKr: '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.' };
  if (score <= 6.5) return { rangeLabel: '6.2 ~ 6.5점', descriptionKr: '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.' };
  return { rangeLabel: '6.6점 이상', descriptionKr: '말더듬에 대해 잘 알고 계시고, 아이가 말을 더듬을 때 어떻게 반응하고 도와줘야 할지 자신감 있게 알고 계세요.' };
}

function calculateScores(answers) {
  // SBIS
  const sbisIds = [2015490662, 1544182638, 1140751121, 2129570078, 676432939];
  let sbisSum = 0;
  let sbisCount = 0;
  sbisIds.forEach(id => {
    if (answers[id] !== undefined) {
      sbisSum += Number(answers[id]);
      sbisCount++;
    }
  });
  const sbisRangeInfo = getSBISRangeInfo(sbisSum);

  // Factor 1 (Q22~Q28)
  const f1Qs = [
    { id: 1481741321, weight: 0.751 }, { id: 1575572212, weight: 0.775 },
    { id: 107897978, weight: 0.786 }, { id: 914545063, weight: 0.783 },
    { id: 146388951, weight: 0.747 }, { id: 859143932, weight: 0.59 },
    { id: 1623691428, weight: 0.525 }
  ];
  let f1Sum = 0; f1Qs.forEach(q => f1Sum += Number(answers[q.id] || 0) * q.weight);
  const f1Score = Number((f1Sum / 7).toFixed(3));
  const f1Level = getFactor1Level(f1Score);
  const f1Range = getFactor1RangeInfo(f1Score);

  // Factor 2 (Q29~Q35)
  const f2Qs = [
    { id: 2094095092, weight: 0.703 }, { id: 648032736, weight: 0.558 },
    { id: 740503268, weight: 0.797 }, { id: 1050082798, weight: 0.807 },
    { id: 341804199, weight: 0.798 }, { id: 905335102, weight: 0.779 },
    { id: 1048848859, weight: 0.424 }
  ];
  let f2Sum = 0; f2Qs.forEach(q => f2Sum += Number(answers[q.id] || 0) * q.weight);
  const f2Score = Number((f2Sum / 7).toFixed(3));
  const f2Level = getFactor2Level(f2Score);
  const f2Range = getFactor2RangeInfo(f2Score);

  // Factor 3 (Q36~Q40)
  const f3Qs = [
    { id: 1520832689, weight: 0.408 }, { id: 1667221451, weight: 0.771 },
    { id: 1434469522, weight: 0.882 }, { id: 493302818, weight: 0.836 },
    { id: 705539961, weight: 0.873 }
  ];
  let f3Sum = 0; f3Qs.forEach(q => f3Sum += Number(answers[q.id] || 0) * q.weight);
  const f3Score = Number((f3Sum / 5).toFixed(3));
  const f3Level = getFactor3Level(f3Score);
  const f3Range = getFactor3RangeInfo(f3Score);

  return {
    consentAgreed: true,
    sbisTotalScore: sbisSum,
    sbisMaxScore: 25,
    sbis: {
      totalScore: sbisSum,
      maxScore: 25,
      answeredCount: sbisCount,
      totalItems: 5,
      rangeInfo: sbisRangeInfo,
    },
    pprsImpactAvg: Number((f1Score * 0.9 + 1).toFixed(1)),
    pprsConcernAvg: Number((f2Score * 0.9 + 1).toFixed(1)),
    pprsKnowledgeAvg: Number((f3Score * 0.9 + 1).toFixed(1)),
    totalAnsweredCount: Object.keys(answers).length,
    totalQuestionsCount: 41,
    factor1: { score: f1Score, ...f1Level, rangeInfo: f1Range },
    factor2: { score: f2Score, ...f2Level, rangeInfo: f2Range },
    factor3: { score: f3Score, ...f3Level, rangeInfo: f3Range },
  };
}

async function run() {
  console.log('🧹 1. Cleaning existing survey responses from Cloud Firestore...');
  const querySnapshot = await getDocs(collection(db, 'survey_responses'));
  let deletedCount = 0;
  for (const document of querySnapshot.docs) {
    await deleteDoc(doc(db, 'survey_responses', document.id));
    deletedCount++;
  }
  console.log(`Deleted ${deletedCount} existing documents.`);

  console.log('🚀 2. Uploading 20 clean survey responses strictly adhering to exact survey schema...');

  for (let i = 0; i < 20; i++) {
    const isBoy = i % 2 === 0;

    let sbisRangeBase, factor1Base, factor2Base, factor3Base;
    if (i < 5) {
      sbisRangeBase = 4; factor1Base = 1.5; factor2Base = 1.2; factor3Base = 6.2;
    } else if (i < 12) {
      sbisRangeBase = 3; factor1Base = 3.5; factor2Base = 3.0; factor3Base = 4.5;
    } else if (i < 17) {
      sbisRangeBase = 2; factor1Base = 5.2; factor2Base = 4.5; factor3Base = 3.0;
    } else {
      sbisRangeBase = 1; factor1Base = 6.8; factor2Base = 5.8; factor3Base = 1.8;
    }

    // STRICTLY use ONLY the exact question IDs in palin_form_decoded.json
    const answers = {
      // Q1: Research Consent (1536400327)
      1536400327: 0, // '예'

      // Section 1: Background Info Q2~Q16
      712970807: i % 4 === 0 ? 1 : 0, // Q2: 진단 받은 적 있음/없음 (0: 예, 1: 아니오)
      148068858: i % 3 === 0 ? 1 : 0, // Q3: 보고자 (0: 어머니, 1: 아버지)
      1227784826: `${32 + (i % 8)}세`, // Q4: 보고자 연령
      1525865811: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2, // Q5: 최종 학력 (0: 고졸, 1: 대졸, 2: 대학원졸)
      1100613129: `만 ${4 + (i % 3)}세 ${(i * 2) % 12}개월`, // Q6: 아동 나이
      134861503: isBoy ? 0 : 1, // Q7: 성별 (0: 남, 1: 여)
      528139896: i % 5 === 0 ? 0 : 1, // Q8: 가족 말더듬 이력 (0: 예, 1: 아니오)
      669909246: i % 5 === 0 ? '삼촌' : '없음', // Q9: 가족 누구인지
      1016082815: i % 2 === 0 ? 0 : 1, // Q10: 치료 받은 적 있는지 (0: 예, 1: 아니오)
      1529614863: i % 2 === 0 ? 0 : 1, // Q11: 부모교육 받은 적 있는지 (0: 예, 1: 아니오)
      744630384: `2023년 ${((i * 3) % 12) + 1}월`, // Q12: 처음 더듬기 시작한 시기
      1665081174: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2, // Q13: 늘어남/줄어듦/유지 (0: 늘어남, 1: 줄어듦, 2: 유지)
      1512095907: i % 3 === 0 ? 1 : 0, // Q14: 아동 인지 여부 (0: 예, 1: 아니오)
      1466102584: 1, // Q15: 다른 문제 유무 (0: 예, 1: 아니오)
      1494434037: '특이사항 없음', // Q16: 어떤 문제인지

      // Section 2: SBIS (Q17~Q21) - 1~5 ratings
      2015490662: Math.min(5, Math.max(1, Math.round(sbisRangeBase + (Math.random() * 1 - 0.5)))),
      1544182638: Math.min(5, Math.max(1, Math.round(sbisRangeBase + (Math.random() * 1 - 0.5)))),
      1140751121: Math.min(5, Math.max(1, Math.round(sbisRangeBase + (Math.random() * 1 - 0.5)))),
      2129570078: Math.min(5, Math.max(1, Math.round(sbisRangeBase + (Math.random() * 1 - 0.5)))),
      676432939: Math.min(5, Math.max(1, Math.round(sbisRangeBase + (Math.random() * 1 - 0.5)))),

      // Section 3: Palin PPRS (Q22~Q40) - 0~10 ratings
      // Factor 1 (Q22~Q28)
      1481741321: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      1575572212: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      107897978: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      914545063: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      146388951: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      859143932: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),
      1623691428: Math.min(10, Math.max(0, Math.round(factor1Base + (Math.random() * 1.2 - 0.6)))),

      // Factor 2 (Q29~Q35)
      2094095092: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      648032736: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      740503268: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      1050082798: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      341804199: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      905335102: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),
      1048848859: Math.min(10, Math.max(0, Math.round(factor2Base + (Math.random() * 1.2 - 0.6)))),

      // Factor 3 (Q36~Q40)
      1520832689: Math.min(10, Math.max(0, Math.round(factor3Base + (Math.random() * 1.2 - 0.6)))),
      1667221451: Math.min(10, Math.max(0, Math.round(factor3Base + (Math.random() * 1.2 - 0.6)))),
      1434469522: Math.min(10, Math.max(0, Math.round(factor3Base + (Math.random() * 1.2 - 0.6)))),
      493302818: Math.min(10, Math.max(0, Math.round(factor3Base + (Math.random() * 1.2 - 0.6)))),
      705539961: Math.min(10, Math.max(0, Math.round(factor3Base + (Math.random() * 1.2 - 0.6)))),

      // Q41: Phone number (1043373993)
      1043373993: `010-${1000 + i * 42}-${5000 + i * 19}`
    };

    const scores = calculateScores(answers);
    const dateOffsetHours = (19 - i) * 12;
    const submittedDate = new Date(Date.now() - dateOffsetHours * 3600 * 1000);

    const payload = {
      answers,
      scores,
      locale: 'ko',
      submittedAtIso: submittedDate.toISOString(),
      metadata: {
        platform: i % 2 === 0 ? 'ios' : 'android',
        userAgent: i % 2 === 0 ? 'Mobile Safari / Expo Go iOS' : 'Chrome Mobile / Expo Go Android',
        sampleIndex: i + 1,
      },
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'survey_responses'), payload);
    console.log(`[${i + 1}/20] ✅ Uploaded clean response (Doc ID: ${docRef.id}) | F1: ${scores.factor1.score} | F2: ${scores.factor2.score} | F3: ${scores.factor3.score} | SBIS: ${scores.sbisTotalScore}`);
  }

  console.log('\n🎉 Successfully updated Firebase Cloud Firestore collection "survey_responses" with 20 strict-schema survey responses!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error executing script:', err);
  process.exit(1);
});
