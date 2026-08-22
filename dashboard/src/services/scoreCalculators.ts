import type { ClinicalRangeInfo } from '../types/dashboard';

export function getSBISRangeInfo(score: number): ClinicalRangeInfo {
  if (score <= 11) {
    return {
      rangeKey: 'sbis_low',
      rangeLabel: '0 ~ 11점',
      min: 0,
      max: 11,
      badgeColor: '#3B82F6',
      descriptionKr: '아이가 낯선 사람이나 새로운 상황에 대해 상당히 조심스럽고 위축된 반응을 보이는 편이에요. 부모님과 떨어지는 것을 어려워하거나, 낯선 사람에게 잘 다가가지 않고, 새로운 환경에 적응하는 데 시간이 오래 걸릴 수 있어요.',
    };
  } else if (score <= 18) {
    return {
      rangeKey: 'sbis_mid',
      rangeLabel: '12 ~ 18점',
      min: 12,
      max: 18,
      badgeColor: '#F59E0B',
      descriptionKr: '또래 아이들과 비슷한 수준으로, 낯선 상황에서 어느 정도 조심스러운 모습을 보이지만 특별히 심한 편은 아니에요.',
    };
  } else {
    return {
      rangeKey: 'sbis_high',
      rangeLabel: '19 ~ 25점',
      min: 19,
      max: 25,
      badgeColor: '#EF4444',
      descriptionKr: '아이가 낯선 사람이나 새로운 상황에도 비교적 쉽게 다가가고 빠르게 적응하는 편이에요. 활발하고 사교적인 성향을 보일 수 있어요.',
    };
  }
}

export function getFactor1RangeInfo(score: number): ClinicalRangeInfo {
  if (score <= 1.9) {
    return {
      rangeKey: 'f1_0_1_9',
      rangeLabel: '0 ~ 1.9점',
      min: 0,
      max: 1.9,
      badgeColor: '#10B981',
      descriptionKr: '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.',
    };
  } else if (score <= 2.7) {
    return {
      rangeKey: 'f1_2_0_2_7',
      rangeLabel: '2.0 ~ 2.7점',
      min: 2.0,
      max: 2.7,
      badgeColor: '#10B981',
      descriptionKr: '우리 아이는 말더듬으로 인한 어려움을 거의 느끼지 않고 있어요. 자신감 있게 말하고, 좌절감이나 불안감도 크지 않은 편입니다.',
    };
  } else if (score <= 3.4) {
    return {
      rangeKey: 'f1_2_8_3_4',
      rangeLabel: '2.8 ~ 3.4점',
      min: 2.8,
      max: 3.4,
      badgeColor: '#10B981',
      descriptionKr: '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.',
    };
  } else if (score <= 4.1) {
    return {
      rangeKey: 'f1_3_5_4_1',
      rangeLabel: '3.5 ~ 4.1점',
      min: 3.5,
      max: 4.1,
      badgeColor: '#10B981',
      descriptionKr: '아이가 말더듬 때문에 겪는 어려움이 적은 편이에요. 대체로 편안하게 말하고 있다고 볼 수 있어요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'f1_4_2_4_9',
      rangeLabel: '4.2 ~ 4.9점',
      min: 4.2,
      max: 4.9,
      badgeColor: '#F59E0B',
      descriptionKr: '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.',
    };
  } else if (score <= 5.5) {
    return {
      rangeKey: 'f1_5_0_5_5',
      rangeLabel: '5.0 ~ 5.5점',
      min: 5.0,
      max: 5.5,
      badgeColor: '#F59E0B',
      descriptionKr: '또래 아이들과 비슷한 수준으로, 말더듬으로 인해 어느 정도의 어려움은 있지만 특별히 심한 편은 아니에요.',
    };
  } else if (score <= 6.1) {
    return {
      rangeKey: 'f1_5_6_6_1',
      rangeLabel: '5.6 ~ 6.1점',
      min: 5.6,
      max: 6.1,
      badgeColor: '#F97316',
      descriptionKr: '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.',
    };
  } else if (score <= 6.6) {
    return {
      rangeKey: 'f1_6_2_6_6',
      rangeLabel: '6.2 ~ 6.6점',
      min: 6.2,
      max: 6.6,
      badgeColor: '#F97316',
      descriptionKr: '아이가 말더듬 때문에 다소 힘들어하고 있는 것으로 보여요. 좌절감이나 불안감을 자주 느끼거나, 말을 줄이려는 모습이 보일 수 있어요.',
    };
  } else {
    return {
      rangeKey: 'f1_6_7_above',
      rangeLabel: '6.7점 이상',
      min: 6.7,
      max: 10.0,
      badgeColor: '#EF4444',
      descriptionKr: '아이가 말더듬으로 인해 상당한 어려움을 겪고 있는 것으로 보여요. 정서적으로 힘들어하거나 말하는 것을 피하려는 모습이 두드러질 수 있어, 아이의 마음을 살펴보고 전문가와 상의해보시는 것이 도움이 될 수 있어요.',
    };
  }
}

export function getFactor2RangeInfo(score: number): ClinicalRangeInfo {
  if (score <= 1.1) {
    return {
      rangeKey: 'f2_0_0_1_1',
      rangeLabel: '0.0 ~ 1.1점',
      min: 0,
      max: 1.1,
      badgeColor: '#10B981',
      descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.',
    };
  } else if (score <= 1.7) {
    return {
      rangeKey: 'f2_1_2_1_7',
      rangeLabel: '1.2 ~ 1.7점',
      min: 1.2,
      max: 1.7,
      badgeColor: '#10B981',
      descriptionKr: '아이의 말더듬에 대해 크게 걱정하지 않으시는 편이에요.',
    };
  } else if (score <= 2.1) {
    return {
      rangeKey: 'f2_1_8_2_1',
      rangeLabel: '1.8 ~ 2.1점',
      min: 1.8,
      max: 2.1,
      badgeColor: '#10B981',
      descriptionKr: '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.',
    };
  } else if (score <= 2.7) {
    return {
      rangeKey: 'f2_2_2_2_7',
      rangeLabel: '2.2 ~ 2.7점',
      min: 2.2,
      max: 2.7,
      badgeColor: '#10B981',
      descriptionKr: '말더듬으로 인한 걱정이나 부담이 적은 편이에요. 가족 생활에 미치는 영향도 크지 않다고 느끼고 계세요.',
    };
  } else if (score <= 3.3) {
    return {
      rangeKey: 'f2_2_8_3_3',
      rangeLabel: '2.8 ~ 3.3점',
      min: 2.8,
      max: 3.3,
      badgeColor: '#F59E0B',
      descriptionKr: '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.',
    };
  } else if (score <= 4.1) {
    return {
      rangeKey: 'f2_3_4_4_1',
      rangeLabel: '3.4 ~ 4.1점',
      min: 3.4,
      max: 4.1,
      badgeColor: '#F59E0B',
      descriptionKr: '다른 부모님들과 비슷한 정도로, 아이의 말더듬에 대해 어느 정도 걱정하고 계신 상태예요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'f2_4_2_4_9',
      rangeLabel: '4.2 ~ 4.9점',
      min: 4.2,
      max: 4.9,
      badgeColor: '#F97316',
      descriptionKr: '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.',
    };
  } else if (score <= 5.3) {
    return {
      rangeKey: 'f2_5_0_5_3',
      rangeLabel: '5.0 ~ 5.3점',
      min: 5.0,
      max: 5.3,
      badgeColor: '#F97316',
      descriptionKr: '아이의 말더듬 정도나 미래에 대한 걱정이 다소 크신 편이에요. 가족 전체에 미치는 영향도 적지 않다고 느끼고 계실 수 있어요.',
    };
  } else {
    return {
      rangeKey: 'f2_5_4_above',
      rangeLabel: '5.4점 이상',
      min: 5.4,
      max: 10.0,
      badgeColor: '#EF4444',
      descriptionKr: '아이의 말더듬으로 인해 상당히 걱정이 크고, 심리적 부담도 크신 상태로 보여요. 이런 마음을 혼자 감당하기보다 담당 언어재활사와 이 부분을 꼭 나누시길 권해드려요.',
    };
  }
}

export function getFactor3RangeInfo(score: number): ClinicalRangeInfo {
  if (score <= 1.6) {
    return {
      rangeKey: 'f3_0_0_1_6',
      rangeLabel: '0.0 ~ 1.6점',
      min: 0,
      max: 1.6,
      badgeColor: '#EF4444',
      descriptionKr: '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.',
    };
  } else if (score <= 2.1) {
    return {
      rangeKey: 'f3_1_7_2_1',
      rangeLabel: '1.7 ~ 2.1점',
      min: 1.7,
      max: 2.1,
      badgeColor: '#EF4444',
      descriptionKr: '말더듬에 대해 잘 모르시거나, 아이의 말더듬 앞에서 어떻게 반응해야 할지 막막하게 느끼고 계신 것으로 보여요. 담당 언어재활사와의 상담을 통해 구체적인 안내를 받으시면 자신감을 키우는 데 큰 도움이 될 수 있어요.',
    };
  } else if (score <= 3.1) {
    return {
      rangeKey: 'f3_2_2_3_1',
      rangeLabel: '2.2 ~ 3.1점',
      min: 2.2,
      max: 3.1,
      badgeColor: '#F97316',
      descriptionKr: '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.',
    };
  } else if (score <= 4.0) {
    return {
      rangeKey: 'f3_3_2_4_0',
      rangeLabel: '3.2 ~ 4.0점',
      min: 3.2,
      max: 4.0,
      badgeColor: '#F97316',
      descriptionKr: '말더듬에 대한 정보가 아직 충분하지 않거나, 아이를 어떻게 도와줘야 할지 확신이 서지 않는 편이에요. 관련 교육이나 상담을 통해 도움을 받으시면 좋을 것 같아요.',
    };
  } else if (score <= 4.9) {
    return {
      rangeKey: 'f3_4_1_4_9',
      rangeLabel: '4.1 ~ 4.9점',
      min: 4.1,
      max: 4.9,
      badgeColor: '#F59E0B',
      descriptionKr: '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.',
    };
  } else if (score <= 5.5) {
    return {
      rangeKey: 'f3_5_0_5_5',
      rangeLabel: '5.0 ~ 5.5점',
      min: 5.0,
      max: 5.5,
      badgeColor: '#F59E0B',
      descriptionKr: '말더듬에 대해 기본적인 지식은 있으시지만, 상황에 따라 어떻게 대처해야 할지 조금 더 확신이 필요하신 상태예요.',
    };
  } else if (score <= 6.1) {
    return {
      rangeKey: 'f3_5_6_6_1',
      rangeLabel: '5.6 ~ 6.1점',
      min: 5.6,
      max: 6.1,
      badgeColor: '#10B981',
      descriptionKr: '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.',
    };
  } else if (score <= 6.5) {
    return {
      rangeKey: 'f3_6_2_6_5',
      rangeLabel: '6.2 ~ 6.5점',
      min: 6.2,
      max: 6.5,
      badgeColor: '#10B981',
      descriptionKr: '말더듬에 대한 이해도가 높은 편이고, 아이를 대하는 데 있어 어느 정도 자신감을 갖고 계세요.',
    };
  } else {
    return {
      rangeKey: 'f3_6_6_above',
      rangeLabel: '6.6점 이상',
      min: 6.6,
      max: 10.0,
      badgeColor: '#059669',
      descriptionKr: '말더듬에 대해 잘 알고 계시고, 아이가 말을 더듬을 때 어떻게 반응하고 도와줘야 할지 자신감 있게 알고 계세요.',
    };
  }
}
