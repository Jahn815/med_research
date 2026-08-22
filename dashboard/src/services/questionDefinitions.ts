export interface QuestionDef {
  id: number;
  qNum: number;
  sectionTitle: string;
  text: string;
  type?: 'radio' | 'text' | 'checkbox' | 'rating';
  options?: Array<{ value: any; label: string }>;
}

export const QUESTION_DEFINITIONS: Record<number, QuestionDef> = {
  // Section 1: Consent & Demographics
  1536400327: { id: 1536400327, qNum: 1, sectionTitle: '연구 동의', text: '본 연구에 동의하십니까?', options: [{ value: 0, label: '예' }, { value: 1, label: '아니오' }] },
  712970807: { id: 712970807, qNum: 2, sectionTitle: '아동 배경정보', text: '아동이 이전에 언어재활사로부터 말더듬으로 진단받은 적이 있나요?', options: [{ value: 0, label: '예' }, { value: 1, label: '아니오' }] },
  1752391037: { id: 1752391037, qNum: 3, sectionTitle: '아동 배경정보', text: '아동의 성별을 선택해 주세요.', options: [{ value: 0, label: '남아' }, { value: 1, label: '여아' }] },
  1134267425: { id: 1134267425, qNum: 4, sectionTitle: '아동 배경정보', text: '아동의 생년월일을 입력해 주세요.' },
  1439247192: { id: 1439247192, qNum: 5, sectionTitle: '아동 배경정보', text: '아동이 말을 더듬기 시작한 연령은 언제인가요?' },
  1787834789: { id: 1787834789, qNum: 6, sectionTitle: '아동 배경정보', text: '가족 중 말을 더듬는 사람이 있나요?', options: [{ value: 0, label: '예' }, { value: 1, label: '아니오' }] },
  783262104: { id: 783262104, qNum: 7, sectionTitle: '아동 배경정보', text: '아동이 현재 언어치료를 받고 있나요?', options: [{ value: 0, label: '예' }, { value: 1, label: '아니오' }] },
  903264105: { id: 903264105, qNum: 8, sectionTitle: '아동 배경정보', text: '언어치료를 받은 기간은 얼마인가요?' },
  1204859102: { id: 1204859102, qNum: 9, sectionTitle: '아동 배경정보', text: '작성자와 아동의 관계를 선택해 주세요.', options: [{ value: 0, label: '어머니' }, { value: 1, label: '아버지' }, { value: 2, label: '기타' }] },

  // SBIS Questions (Q17 ~ Q21)
  2015490662: { 
    id: 2015490662, 
    qNum: 17, 
    sectionTitle: 'SBIS 행동억제기질 (Q1)', 
    text: '1) 낯선 사람이나 물건에 다가가지 않는다. 또는 가까이 다가간다.',
    options: [
      { value: 0, label: '1 - 낯선 사람/물건에 거의 다가지 않음 (1점)' },
      { value: 1, label: '2 - 다가가지 않는 편 (2점)' },
      { value: 2, label: '3 - 보통 (3점)' },
      { value: 3, label: '4 - 다가가는 편 (4점)' },
      { value: 4, label: '5 - 매우 잘 다가감 (5점)' }
    ]
  },
  1544182638: { 
    id: 1544182638, 
    qNum: 18, 
    sectionTitle: 'SBIS 행동억제기질 (Q2)', 
    text: '2) 부모에게서 떨어지지 않는다. 또는 부모에게서 쉽게 떨어진다.',
    options: [
      { value: 0, label: '1 - 전혀 떨어지지 않음 (1점)' },
      { value: 1, label: '2 - 떨이지기 힘들어함 (2점)' },
      { value: 2, label: '3 - 보통 (3점)' },
      { value: 3, label: '4 - 잘 떨어지는 편 (4점)' },
      { value: 4, label: '5 - 매우 쉽게 떨어짐 (5점)' }
    ]
  },
  1140751121: { 
    id: 1140751121, 
    qNum: 19, 
    sectionTitle: 'SBIS 행동억제기질 (Q3)', 
    text: '3) 처음 방문하는 장소에서 조용히 부모 곁에 있는다. 또는 곧바로 주위를 탐색하며 논다.',
    options: [
      { value: 0, label: '1 - 부모 곁에만 있음 (1점)' },
      { value: 1, label: '2 - 주저하는 편 (2점)' },
      { value: 2, label: '3 - 보통 (3점)' },
      { value: 3, label: '4 - 탐색하는 편 (4점)' },
      { value: 4, label: '5 - 즉시 적극적으로 탐색함 (5점)' }
    ]
  },
  2129570078: { 
    id: 2129570078, 
    qNum: 20, 
    sectionTitle: 'SBIS 행동억제기질 (Q4)', 
    text: '4) 새로운 일(게임, 과제)을 할 때 먼저 지켜본다. 또는 곧바로 참여한다.',
    options: [
      { value: 0, label: '1 - 지켜보기만 함 (1점)' },
      { value: 1, label: '2 - 주저하는 편 (2점)' },
      { value: 2, label: '3 - 보통 (3점)' },
      { value: 3, label: '4 - 참여하는 편 (4점)' },
      { value: 4, label: '5 - 곧바로 즐겁게 참여함 (5점)' }
    ]
  },
  676432939: { 
    id: 676432939, 
    qNum: 21, 
    sectionTitle: 'SBIS 행동억제기질 (Q5)', 
    text: '5) 처음 만나는 사람(어른, 친구)에게 말을 거의 건네지 않는다. 또는 쉽게 말을 건넨다.',
    options: [
      { value: 0, label: '1 - 전혀 건네지 않음 (1점)' },
      { value: 1, label: '2 - 거의 건네지 않는 편 (2점)' },
      { value: 2, label: '3 - 보통 (3점)' },
      { value: 3, label: '4 - 건네는 편 (4점)' },
      { value: 4, label: '5 - 매우 쉽게 건넸음 (5점)' }
    ]
  },

  // Palin Factor 1 Questions (Q22 ~ Q28)
  1481741321: { id: 1481741321, qNum: 22, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '1) 아이가 말더듬 때문에 말을 적게 합니까?' },
  1575572212: { id: 1575572212, qNum: 23, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '2) 아이가 얼마나 자신의 말에 좌절감을 느낍니까?' },
  107897978: { id: 107897978, qNum: 24, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '3) 아이가 얼마나 자신의 말더듬에 짜증을 냅니까?' },
  914545063: { id: 914545063, qNum: 25, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '4) 아이가 얼마나 자신의 말에 대해 불안감을 느낍니까?' },
  146388951: { id: 146388951, qNum: 26, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '5) 아이가 얼마나 자신 있게 말합니까?' },
  859143932: { id: 859143932, qNum: 27, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '6) 아이가 대체로 얼마나 행복합니까?' },
  1623691428: { id: 1623691428, qNum: 28, sectionTitle: 'Palin Factor 1 (아동 반응)', text: '7) 아이가 얼마나 자신의 감정을 잘 이야기할 수 있습니까?' },

  // Palin Factor 2 Questions (Q29 ~ Q35)
  2094095092: { id: 2094095092, qNum: 29, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '8) 아이가 말할 때 얼마나 말하는 것을 힘들어합니까?' },
  648032736: { id: 648032736, qNum: 30, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '9) 아이가 유창할 때가 있습니까?' },
  740503268: { id: 740503268, qNum: 31, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '10) 아이가 얼마나 자주 말을 더듬습니까?' },
  1050082798: { id: 1050082798, qNum: 32, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '11) 아이가 얼마나 심하게 말을 더듬습니까?' },
  341804199: { id: 341804199, qNum: 33, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '12) 당신은 아이의 말더듬에 대해 얼마나 걱정하고 있습니까?' },
  905335102: { id: 905335102, qNum: 34, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '13) 당신은 아이의 말더듬 때문에 얼마나 아이의 미래에 대해 불안해합니까?' },
  1048848859: { id: 1048848859, qNum: 35, sectionTitle: 'Palin Factor 2 (부모 걱정/영향)', text: '14) 말더듬이 당신의 가족에 어느 정도 영향을 끼치고 있습니까?' },

  // Palin Factor 3 Questions (Q36 ~ Q40)
  1520832689: { id: 1520832689, qNum: 36, sectionTitle: 'Palin Factor 3 (부모 지식/대처)', text: '15) 당신은 무엇이 아이의 말더듬에 영향을 끼치는지 알고 있습니까?' },
  1667221451: { id: 1667221451, qNum: 37, sectionTitle: 'Palin Factor 3 (부모 지식/대처)', text: '16a) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? a) 아이가 말을 더듬을 때 적절히 반응하기' },
  1434469522: { id: 1434469522, qNum: 38, sectionTitle: 'Palin Factor 3 (부모 지식/대처)', text: '16b) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? b) 아이의 말더듬에 대한 인식과 걱정에 대처하기' },
  493302818: { id: 493302818, qNum: 39, sectionTitle: 'Palin Factor 3 (부모 지식/대처)', text: '16c) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? c) 아이의 자신감을 키워 주기' },
  705539961: { id: 705539961, qNum: 40, sectionTitle: 'Palin Factor 3 (부모 지식/대처)', text: '16d) 당신은 다음의 내용을 얼마나 자신있게 알고 있습니까? d) 아이의 유창성을 격려하기' },
};
