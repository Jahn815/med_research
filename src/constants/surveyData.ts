export const SURVEY_SECTIONS = [
  { id: 'info', title: '1. 기본 정보', icon: 'person-outline', description: '아동 및 작성자의 기본 정보' },
  { id: 'onset', title: '2. 말더듬 시작 및 증상', icon: 'time-outline', description: '말더듬 시작 시기 및 주요 행동 증상' },
  { id: 'situations', title: '3. 상황별 양상 및 반응', icon: 'chatbubbles-outline', description: '악화 상황 및 아동의 정서/행동 반응' },
  { id: 'family', title: '4. 가족력 및 부모 소견', icon: 'heart-outline', description: '가족력, 부모 걱정 정도 및 상담 요구사항' },
];

export const ONSET_AGE_OPTIONS = [
  { label: '만 2세 이전', value: 'under_2' },
  { label: '만 2세 ~ 3세', value: '2_to_3' },
  { label: '만 3세 ~ 4세', value: '3_to_4' },
  { label: '만 4세 이후', value: 'after_4' },
  { label: '잘 기억나지 않음', value: 'unknown' },
];

export const ONSET_SPEED_OPTIONS = [
  { label: '갑자기 시작됨 (며칠 내 급격히 발생)', value: 'sudden' },
  { label: '서서히 시작됨 (시간이 지나며 조금씩 증가)', value: 'gradual' },
];

export const SYMPTOM_OPTIONS = [
  { id: 'sound_rep', label: '음소/음절 반복', detail: "예: '아-아-아빠', '가-가-가방'" },
  { id: 'word_rep', label: '단어 반복', detail: "예: '나-나-나 학교 가요'" },
  { id: 'prolongation', label: '음소 연장', detail: "예: '아-------빠', '사-------과'" },
  { id: 'blocking', label: '막힘 현상 (말문이 막힘)', detail: "말을 시작하려고 하나 소리가 나오지 않음" },
  { id: 'secondary', label: '신체 수반 행동', detail: "눈 깜빡임, 입술 떨림, 고개 끄덕임, 발 굴르기 등" },
  { id: 'pitch_raise', label: '피치/음성 변화', detail: "말을 할 때 목소리가 들뜨거나 높아짐" },
];

export const SITUATION_OPTIONS = [
  { id: 'excited', label: '기쁘거나 흥분했을 때' },
  { id: 'angry', label: '화가 나거나 떼를 쓸 때' },
  { id: 'fast', label: '빠르게 말하려고 할 때' },
  { id: 'stranger', label: '낯선 사람이나 어른과 말할 때' },
  { id: 'questioned', label: '질문을 받아서 대답해야 할 때' },
  { id: 'fatigued', label: '피곤하거나 졸릴 때' },
  { id: 'presentation', label: '여럿 앞에서 이야기할 때' },
];

export const REACTION_OPTIONS = [
  { id: 'give_up', label: '말하기를 중간에 포기함' },
  { id: 'frustrated', label: '짜증을 내거나 좌절감을 보임' },
  { id: 'self_aware', label: '자신의 말더듬을 의식하거나 눈치를 봄' },
  { id: 'substitute', label: '다른 단어로 바꾸어 말함' },
  { id: 'unaware', label: '특별히 의식하지 않고 자연스럽게 계속 말함' },
];

export const AVOIDANCE_OPTIONS = [
  { label: '말하기를 적극적으로 피하거나 침묵함', value: 'frequent' },
  { label: '가끔 말하기를 주저하거나 멈칫함', value: 'sometimes' },
  { label: '피하지 않고 적극적으로 말하려고 함', value: 'never' },
];

export const FAMILY_HISTORY_OPTIONS = [
  { label: '있음 (친가/외가 포함)', value: 'yes' },
  { label: '없음', value: 'no' },
  { label: '잘 모름', value: 'unknown' },
];
