import React, { useState } from 'react';
import type { FirestoreSurveyDoc } from '../firebase';
import {
  generateWideMatrixCsv,
  generateRelationalSqlDump,
  generateRelationalCsvTablesBundle,
  downloadFile,
} from '../services/dataExportService';
import { Database, FileSpreadsheet, Download, Table, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  responses: FirestoreSurveyDoc[];
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  responses,
}) => {
  const [exportFormat, setExportFormat] = useState<'csv_matrix' | 'sql_dump' | 'csv_relational'>('csv_matrix');
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);

    if (exportFormat === 'csv_matrix') {
      const csvData = generateWideMatrixCsv(responses);
      downloadFile(`med_research_survey_matrix_${timestamp}.csv`, csvData, 'text/csv;charset=utf-8;');
      setDownloadSuccessMsg('Google Sheets/Excel 스프레드시트용 CSV 파일이 다운로드 되었습니다!');
    } else if (exportFormat === 'sql_dump') {
      const sqlData = generateRelationalSqlDump(responses);
      downloadFile(`med_research_database_dump_${timestamp}.sql`, sqlData, 'text/plain;charset=utf-8;');
      setDownloadSuccessMsg('관계형 SQL 데이터베이스 덤프 (.sql) 파일이 다운로드 되었습니다!');
    } else if (exportFormat === 'csv_relational') {
      const bundle = generateRelationalCsvTablesBundle(responses);
      downloadFile(`1_participants_demographics_${timestamp}.csv`, bundle.participantsCsv, 'text/csv;charset=utf-8;');
      downloadFile(`2_clinical_factor_scores_${timestamp}.csv`, bundle.scoresCsv, 'text/csv;charset=utf-8;');
      downloadFile(`3_item_responses_detail_${timestamp}.csv`, bundle.responsesCsv, 'text/csv;charset=utf-8;');
      downloadFile(`4_questions_codebook_${timestamp}.csv`, bundle.codebookCsv, 'text/csv;charset=utf-8;');
      setDownloadSuccessMsg('4개의 관계형 SQL CSV 테이블 파일이 다운로드 되었습니다!');
    }

    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">SQL & 스프레드시트 데이터 내보내기</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                총 {responses.length}건의 전체 응답, 배경정보, 인구통계, 요인점수, Q1~Q40 문항 통합 추출
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Container */}
        <div className="p-6 space-y-6 bg-slate-50/50">
          {downloadSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{downloadSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              내보내기 형식 선택 (Export Format)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Wide Matrix CSV */}
              <div
                onClick={() => setExportFormat('csv_matrix')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  exportFormat === 'csv_matrix'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <FileSpreadsheet className={`w-6 h-6 ${exportFormat === 'csv_matrix' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {exportFormat === 'csv_matrix' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs">통합 매트릭스 CSV</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Google Sheets / Excel 1클릭 불러오기용 (1행=1참가자 전체데이터)
                  </p>
                </div>
              </div>

              {/* Option 2: SQL Dump */}
              <div
                onClick={() => setExportFormat('sql_dump')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  exportFormat === 'sql_dump'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Database className={`w-6 h-6 ${exportFormat === 'sql_dump' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {exportFormat === 'sql_dump' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs">관계형 SQL 덤프 (.sql)</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    PostgreSQL / MySQL / SQLite 직접 실행 가능한 CREATE & INSERT 스크립트
                  </p>
                </div>
              </div>

              {/* Option 3: Relational CSV Multi-Tables */}
              <div
                onClick={() => setExportFormat('csv_relational')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  exportFormat === 'csv_relational'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Table className={`w-6 h-6 ${exportFormat === 'csv_relational' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {exportFormat === 'csv_relational' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs">관계형 CSV 번들 (4종)</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    참가자, 배경정보, 요인점수, 문항응답 4개 독립 CSV 테이블
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Field Included Summary Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              추출 포함되는 전체 데이터 항목 (Full Data Coverage):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><b>초기 아동 배경정보:</b> 진단여부(Q2), 성별(Q3), 생년월일(Q4), 발병연령(Q5), 가족력(Q6), 치료이력(Q7~8), 작성자관계(Q9)</span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><b>임상 평가 점수 & 진단구간:</b> SBIS 기질점수/구간, Factor 1(아동반응), Factor 2(부모걱정), Factor 3(부모지식) 점수 및 구간</span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><b>개별 문항 응답 (Q17 ~ Q40):</b> 숫자 점수 및 한글 라벨 텍스트 동시 제공</span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><b>메타데이터 & 식별자:</b> ID, 제출일시, 언어(ko/en), 디바이스 플랫폼</span>
              </div>
            </div>
          </div>

          {/* Technical Encoding Info */}
          <p className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
            💡 <b>UTF-8 BOM 자동 적용:</b> CSV 파일에는 UTF-8 BOM 이 적용되어 Microsoft Excel 또는 Google Sheets 에서 한글 깨짐 현상 없이 100% 정상적으로 열립니다.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            취소
          </button>

          <button
            onClick={handleExport}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>데이터 추출 다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};
