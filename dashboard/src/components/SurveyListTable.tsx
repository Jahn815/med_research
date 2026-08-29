import React, { useState, useMemo } from 'react';
import type { FirestoreSurveyDoc } from '../firebase';
import { getSBISRangeInfo, getFactor1RangeInfo, getFactor2RangeInfo, getFactor3RangeInfo } from '../services/scoreCalculators';

interface SurveyListTableProps {
  responses: FirestoreSurveyDoc[];
  onSelectResponse: (doc: FirestoreSurveyDoc) => void;
  onOpenSeedModal?: () => void;
  onOpenExportModal?: () => void;
}

export const SurveyListTable: React.FC<SurveyListTableProps> = ({
  responses,
  onSelectResponse,
  onOpenSeedModal,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredResponses = useMemo(() => {
    return responses
      .filter((doc) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        const docIdMatches = doc.id.toLowerCase().includes(q);
        const submittedAtMatches = (doc.submittedAtIso || '').toLowerCase().includes(q);
        const localeMatches = (doc.locale || '').toLowerCase().includes(q);
        return docIdMatches || submittedAtMatches || localeMatches;
      })
      .sort((a, b) => {
        const timeA = new Date(a.submittedAtIso || 0).getTime();
        const timeB = new Date(b.submittedAtIso || 0).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [responses, searchTerm, sortOrder]);

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Search & Action Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-900">설문 응답 목록</h2>
          <p className="text-xs text-slate-500">총 {filteredResponses.length}건의 수집 응답</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ID 또는 날짜 검색..."
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 w-full sm:w-56"
          />

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 transition"
          >
            {sortOrder === 'desc' ? '최신순' : '오래된순'}
          </button>

          {onOpenExportModal && (
            <button
              onClick={onOpenExportModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <span>📊</span>
              <span>SQL / 엑셀 데이터 추출</span>
            </button>
          )}

          {onOpenSeedModal && (
            <button
              onClick={onOpenSeedModal}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition"
            >
              샘플 추가
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      {filteredResponses.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <p className="font-medium text-slate-700">표시할 설문 응답 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">응답 ID</th>
                <th className="py-3 px-4">제출 일시</th>
                <th className="py-3 px-4 text-center">SBIS 점수</th>
                <th className="py-3 px-4 text-center">Factor 1 (아동)</th>
                <th className="py-3 px-4 text-center">Factor 2 (부모 걱정)</th>
                <th className="py-3 px-4 text-center">Factor 3 (부모 지식)</th>
                <th className="py-3 px-4 text-right">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredResponses.map((doc) => {
                const sbisVal = doc.scores?.sbisTotalScore ?? doc.scores?.sbis?.totalScore ?? 0;
                const f1Val = doc.scores?.factor1?.score ?? doc.scores?.pprsImpactAvg ?? 0;
                const f2Val = doc.scores?.factor2?.score ?? doc.scores?.pprsConcernAvg ?? 0;
                const f3Val = doc.scores?.factor3?.score ?? doc.scores?.pprsKnowledgeAvg ?? 0;

                const sbisRange = getSBISRangeInfo(sbisVal);
                const f1Range = getFactor1RangeInfo(f1Val);
                const f2Range = getFactor2RangeInfo(f2Val);
                const f3Range = getFactor3RangeInfo(f3Val);

                return (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectResponse(doc)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {doc.id.slice(0, 12)}...
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(doc.submittedAtIso)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-900">{sbisVal}</span>
                      <span
                        className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] text-white"
                        style={{ backgroundColor: sbisRange.badgeColor }}
                      >
                        {sbisRange.rangeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-900">{Number(f1Val).toFixed(1)}</span>
                      <span
                        className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] text-white"
                        style={{ backgroundColor: f1Range.badgeColor }}
                      >
                        {f1Range.rangeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-900">{Number(f2Val).toFixed(1)}</span>
                      <span
                        className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] text-white"
                        style={{ backgroundColor: f2Range.badgeColor }}
                      >
                        {f2Range.rangeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-900">{Number(f3Val).toFixed(1)}</span>
                      <span
                        className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] text-white"
                        style={{ backgroundColor: f3Range.badgeColor }}
                      >
                        {f3Range.rangeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-indigo-600">
                      보기 &rarr;
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
