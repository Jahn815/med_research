import React from 'react';
import type { FirestoreSurveyDoc } from '../firebase';
import { getSBISRangeInfo, getFactor1RangeInfo, getFactor2RangeInfo, getFactor3RangeInfo } from '../services/scoreCalculators';

interface AverageStatsHeaderProps {
  responses: FirestoreSurveyDoc[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AverageStatsHeader: React.FC<AverageStatsHeaderProps> = ({ responses, onRefresh, isLoading }) => {
  const totalCount = responses.length;

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">응답 통계 Overview</h2>
            <p className="text-xs text-slate-500 mt-1">수집된 설문 응답 데이터가 없습니다.</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
            >
              {isLoading ? '새로고침 중...' : '새로고침'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Calculate Averages
  let sbisSum = 0;
  let sbisCount = 0;
  let f1Sum = 0;
  let f1Count = 0;
  let f2Sum = 0;
  let f2Count = 0;
  let f3Sum = 0;
  let f3Count = 0;

  responses.forEach((doc) => {
    const scores = doc.scores;
    if (!scores) return;

    const sbisVal = scores.sbisTotalScore ?? scores.sbis?.totalScore;
    if (typeof sbisVal === 'number' && !isNaN(sbisVal)) {
      sbisSum += sbisVal;
      sbisCount++;
    }

    const f1Val = scores.factor1?.score ?? scores.pprsImpactAvg;
    if (typeof f1Val === 'number' && !isNaN(f1Val)) {
      f1Sum += f1Val;
      f1Count++;
    }

    const f2Val = scores.factor2?.score ?? scores.pprsConcernAvg;
    if (typeof f2Val === 'number' && !isNaN(f2Val)) {
      f2Sum += f2Val;
      f2Count++;
    }

    const f3Val = scores.factor3?.score ?? scores.pprsKnowledgeAvg;
    if (typeof f3Val === 'number' && !isNaN(f3Val)) {
      f3Sum += f3Val;
      f3Count++;
    }
  });

  const sbisAvg = sbisCount > 0 ? Number((sbisSum / sbisCount).toFixed(1)) : 0;
  const f1Avg = f1Count > 0 ? Number((f1Sum / f1Count).toFixed(2)) : 0;
  const f2Avg = f2Count > 0 ? Number((f2Sum / f2Count).toFixed(2)) : 0;
  const f3Avg = f3Count > 0 ? Number((f3Sum / f3Count).toFixed(2)) : 0;

  const sbisRange = getSBISRangeInfo(sbisAvg);
  const f1Range = getFactor1RangeInfo(f1Avg);
  const f2Range = getFactor2RangeInfo(f2Avg);
  const f3Range = getFactor3RangeInfo(f3Avg);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            설문 요약 및 평균 통계
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Firestore 수집 데이터 기준 전체 평균 점수 및 영역별 임상 구간입니다.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start sm:self-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition disabled:opacity-50"
          >
            {isLoading ? '불러오는 중...' : '데이터 새로고침'}
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Count */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500">전체 응답 수</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCount} <span className="text-xs font-normal text-slate-500">건</span></div>
          <div className="text-[11px] text-slate-400 mt-2">수집 완료 내역</div>
        </div>

        {/* SBIS Average */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500">SBIS 평균</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {sbisAvg} <span className="text-xs font-normal text-slate-500">/ 25</span>
          </div>
          <div className="mt-2">
            <span
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-white"
              style={{ backgroundColor: sbisRange.badgeColor }}
            >
              {sbisRange.rangeLabel}
            </span>
          </div>
        </div>

        {/* Factor 1 Average */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500">Factor 1 (아동 반응)</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {f1Avg} <span className="text-xs font-normal text-slate-500">/ 10</span>
          </div>
          <div className="mt-2">
            <span
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-white"
              style={{ backgroundColor: f1Range.badgeColor }}
            >
              {f1Range.rangeLabel}
            </span>
          </div>
        </div>

        {/* Factor 2 Average */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500">Factor 2 (부모 걱정)</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {f2Avg} <span className="text-xs font-normal text-slate-500">/ 10</span>
          </div>
          <div className="mt-2">
            <span
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-white"
              style={{ backgroundColor: f2Range.badgeColor }}
            >
              {f2Range.rangeLabel}
            </span>
          </div>
        </div>

        {/* Factor 3 Average */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500">Factor 3 (부모 지식)</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {f3Avg} <span className="text-xs font-normal text-slate-500">/ 10</span>
          </div>
          <div className="mt-2">
            <span
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-white"
              style={{ backgroundColor: f3Range.badgeColor }}
            >
              {f3Range.rangeLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
