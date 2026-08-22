import React, { useState } from 'react';
import type { FirestoreSurveyDoc } from '../firebase';
import { getSBISRangeInfo, getFactor1RangeInfo, getFactor2RangeInfo, getFactor3RangeInfo } from '../services/scoreCalculators';
import { QUESTION_DEFINITIONS } from '../services/questionDefinitions';

interface SurveyDetailModalProps {
  doc: FirestoreSurveyDoc | null;
  onClose: () => void;
}

export const SurveyDetailModal: React.FC<SurveyDetailModalProps> = ({ doc, onClose }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'questions' | 'raw'>('summary');

  if (!doc) return null;

  const sbisVal = doc.scores?.sbisTotalScore ?? doc.scores?.sbis?.totalScore ?? 0;
  const f1Val = doc.scores?.factor1?.score ?? doc.scores?.pprsImpactAvg ?? 0;
  const f2Val = doc.scores?.factor2?.score ?? doc.scores?.pprsConcernAvg ?? 0;
  const f3Val = doc.scores?.factor3?.score ?? doc.scores?.pprsKnowledgeAvg ?? 0;

  const sbisRange = getSBISRangeInfo(sbisVal);
  const f1Range = getFactor1RangeInfo(f1Val);
  const f2Range = getFactor2RangeInfo(f2Val);
  const f3Range = getFactor3RangeInfo(f3Val);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const answers = doc.answers || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              설문 응답 상세 리포트
            </h2>
            <div className="text-xs text-slate-500 mt-0.5 flex gap-3">
              <span>ID: {doc.id}</span>
              <span>•</span>
              <span>제출일: {formatDate(doc.submittedAtIso)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
          >
            닫기
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 flex gap-6 text-xs font-medium text-slate-600 bg-slate-50">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            임상 점수 리포트 (단일 구간)
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'questions'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            문항별 응답 (Q1 ~ Q40)
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'raw'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            원본 JSON
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {/* Research Consent */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <span className="font-semibold">연구 동의 여부:</span> 동의함 (수집 완료)
              </div>

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                임상 활성 구간 평가 결과 카드
              </div>

              {/* SBIS Card */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">SBIS 행동억제기질</h3>
                  <span className="text-base font-bold text-slate-900">{sbisVal} / 25점</span>
                </div>
                <div className="mt-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
                    style={{ backgroundColor: sbisRange.badgeColor }}
                  >
                    해당 구간: {sbisRange.rangeLabel}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {sbisRange.descriptionKr}
                  </p>
                </div>
              </div>

              {/* Factor 1 Card */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Palin Factor 1: 아동 반응</h3>
                    <p className="text-[11px] text-slate-500">말더듬에 대한 아동의 정서 및 행동 반응</p>
                  </div>
                  <span className="text-base font-bold text-slate-900">{Number(f1Val).toFixed(2)} / 10점</span>
                </div>
                <div className="mt-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
                    style={{ backgroundColor: f1Range.badgeColor }}
                  >
                    해당 구간: {f1Range.rangeLabel}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {f1Range.descriptionKr}
                  </p>
                </div>
              </div>

              {/* Factor 2 Card */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Palin Factor 2: 부모 걱정</h3>
                    <p className="text-[11px] text-slate-500">말더듬에 관한 부모의 염려 및 가족 영향</p>
                  </div>
                  <span className="text-base font-bold text-slate-900">{Number(f2Val).toFixed(2)} / 10점</span>
                </div>
                <div className="mt-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
                    style={{ backgroundColor: f2Range.badgeColor }}
                  >
                    해당 구간: {f2Range.rangeLabel}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {f2Range.descriptionKr}
                  </p>
                </div>
              </div>

              {/* Factor 3 Card */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Palin Factor 3: 부모 지식/대처</h3>
                    <p className="text-[11px] text-slate-500">말더듬 지식 및 대처 자신감</p>
                  </div>
                  <span className="text-base font-bold text-slate-900">{Number(f3Val).toFixed(2)} / 10점</span>
                </div>
                <div className="mt-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
                    style={{ backgroundColor: f3Range.badgeColor }}
                  >
                    해당 구간: {f3Range.rangeLabel}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {f3Range.descriptionKr}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {Object.entries(answers).map(([key, rawVal]) => {
                const numKey = Number(key);
                const qDef = QUESTION_DEFINITIONS[numKey];
                let displayVal = String(rawVal);

                if (qDef?.options && typeof rawVal === 'number') {
                  const matchedOption = qDef.options.find((o) => o.value === rawVal);
                  if (matchedOption) {
                    displayVal = matchedOption.label;
                  }
                }

                return (
                  <div key={key} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">
                        {qDef ? `Q${qDef.qNum}` : `ID ${key}`}
                      </span>
                      <span className="text-slate-700">{qDef?.text || key}</span>
                    </div>
                    <div className="font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded shrink-0 self-start sm:self-auto">
                      {displayVal}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(doc, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
