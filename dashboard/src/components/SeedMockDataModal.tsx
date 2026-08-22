import React, { useState } from 'react';
import { seedSampleSurveyResponse } from '../firebase';
import type { FirestoreSurveyDoc } from '../firebase';
import { calculateFactor1, calculateFactor2, calculateFactor3, calculateSBIS } from '../../../src/services/palinSurveyService';

interface SeedMockDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SeedMockDataModal: React.FC<SeedMockDataModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seededCount, setSeededCount] = useState(0);

  if (!isOpen) return null;

  const sampleAnswersList: Array<Record<number, any>> = [
    // Case 1
    {
      1536400327: 0, 712970807: 0, 1752391037: 0, 1134267425: '2020-04-12', 1439247192: '2_to_3', 1787834789: 1, 783262104: 0, 903264105: '6개월', 1204859102: 0,
      2015490662: 2, 1544182638: 2, 1140751121: 3, 2129570078: 2, 676432939: 3,
      1481741321: 4, 1575572212: 5, 107897978: 4, 914545063: 4, 146388951: 5, 859143932: 6, 1623691428: 5,
      2094095092: 3, 648032736: 4, 740503268: 4, 1050082798: 3, 341804199: 4, 905335102: 4, 1048848859: 3,
      1520832689: 5, 1667221451: 6, 1434469522: 5, 493302818: 6, 705539961: 6
    },
    // Case 2
    {
      1536400327: 0, 712970807: 0, 1752391037: 1, 1134267425: '2021-08-20', 1439247192: '3_to_4', 1787834789: 0, 783262104: 0, 903264105: '1년', 1204859102: 0,
      2015490662: 0, 1544182638: 1, 1140751121: 1, 2129570078: 1, 676432939: 1,
      1481741321: 7, 1575572212: 6, 107897978: 7, 914545063: 7, 146388951: 3, 859143932: 4, 1623691428: 3,
      2094095092: 6, 648032736: 2, 740503268: 6, 1050082798: 6, 341804199: 7, 905335102: 7, 1048848859: 5,
      1520832689: 3, 1667221451: 4, 1434469522: 3, 493302818: 4, 705539961: 4
    },
    // Case 3
    {
      1536400327: 0, 712970807: 0, 1752391037: 0, 1134267425: '2019-11-05', 1439247192: '2_to_3', 1787834789: 1, 783262104: 1, 903264105: '없음', 1204859102: 1,
      2015490662: 4, 1544182638: 4, 1140751121: 4, 2129570078: 3, 676432939: 4,
      1481741321: 1, 1575572212: 2, 107897978: 2, 914545063: 1, 146388951: 8, 859143932: 9, 1623691428: 8,
      2094095092: 1, 648032736: 8, 740503268: 1, 1050082798: 1, 341804199: 2, 905335102: 1, 1048848859: 1,
      1520832689: 7, 1667221451: 8, 1434469522: 7, 493302818: 8, 705539961: 8
    }
  ];

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeededCount(0);
    try {
      for (let i = 0; i < sampleAnswersList.length; i++) {
        const answers = sampleAnswersList[i];
        const sbisRes = calculateSBIS(answers as any);
        const f1Res = calculateFactor1(answers as any);
        const f2Res = calculateFactor2(answers as any);
        const f3Res = calculateFactor3(answers as any);

        const payload: Omit<FirestoreSurveyDoc, 'id'> = {
          answers,
          scores: {
            consentAgreed: true,
            sbisTotalScore: sbisRes.totalScore,
            sbisMaxScore: 25,
            pprsImpactAvg: f1Res.score,
            pprsConcernAvg: f2Res.score,
            pprsKnowledgeAvg: f3Res.score,
            totalAnsweredCount: 40,
            totalQuestionsCount: 40,
            sbis: sbisRes as any,
            factor1: f1Res as any,
            factor2: f2Res as any,
            factor3: f3Res as any,
          },
          locale: 'ko',
          submittedAtIso: new Date(Date.now() - i * 3600000 * 5).toISOString(),
          metadata: {
            platform: 'Web Dashboard Test',
            userAgent: navigator.userAgent,
          },
        };

        await seedSampleSurveyResponse(payload);
        setSeededCount((prev) => prev + 1);
      }
      onSuccess();
    } catch (err) {
      console.error('Error seeding sample data:', err);
      alert('샘플 데이터 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 border border-slate-200">
        <h3 className="font-bold text-slate-900 text-base mb-2">샘플 응답 데이터 생성</h3>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Firestore에 다양한 임상 점수를 포함한 샘플 설문 응답 3건을 생성합니다.
        </p>

        {seededCount > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-2.5 mb-4 text-xs font-medium">
            {seededCount}개의 샘플 응답 등록 완료.
          </div>
        )}

        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            disabled={isSeeding}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded transition"
          >
            취소
          </button>
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded transition disabled:opacity-50"
          >
            {isSeeding ? `생성 중 (${seededCount}/3)...` : '생성 시작'}
          </button>
        </div>
      </div>
    </div>
  );
};
