import { useState, useEffect, useCallback } from 'react';
import { fetchSurveyResponses } from './firebase';
import type { FirestoreSurveyDoc } from './firebase';
import { AverageStatsHeader } from './components/AverageStatsHeader';
import { SurveyListTable } from './components/SurveyListTable';
import { SurveyDetailModal } from './components/SurveyDetailModal';
import { SeedMockDataModal } from './components/SeedMockDataModal';

export function App() {
  const [responses, setResponses] = useState<FirestoreSurveyDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<FirestoreSurveyDoc | null>(null);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSurveyResponses();
      setResponses(data);
    } catch (err: any) {
      console.error('Error loading survey responses:', err);
      setError(err?.message || 'Firestore 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              말더듬 연구 설문 데이터 대시보드
            </span>
            <span className="text-xs text-slate-400 font-mono">med_research</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Firestore Live</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-3 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadData}
              className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {isLoading && responses.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <>
            <AverageStatsHeader
              responses={responses}
              onRefresh={loadData}
              isLoading={isLoading}
            />

            <SurveyListTable
              responses={responses}
              onSelectResponse={(doc) => setSelectedDoc(doc)}
              onOpenSeedModal={() => setIsSeedModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Detail Modal */}
      {selectedDoc && (
        <SurveyDetailModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* Seed Mock Data Modal */}
      {isSeedModalOpen && (
        <SeedMockDataModal
          isOpen={isSeedModalOpen}
          onClose={() => setIsSeedModalOpen(false)}
          onSuccess={() => {
            setIsSeedModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default App;
