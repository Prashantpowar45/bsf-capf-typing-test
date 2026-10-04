import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Search,
  ArrowUpDown
} from 'lucide-react';
import type { TestHistoryItem } from '../types';

interface TestHistoryProps {
  history: TestHistoryItem[];
  onClearHistory: () => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({ history, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'QUALIFIED' | 'NOT_QUALIFIED'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'netWpm' | 'accuracy'>('date');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = 
        item.passageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.passageNumber.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'netWpm') return b.netWpm - a.netWpm;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
    });

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Date', 'Time', 'Passage No', 'Passage Title', 'Length (Words)', 'Gross WPM', 'Net WPM', 'Accuracy (%)', 'Mistakes', 'Allowed 5%', 'Status', 'Performance'];
    const rows = history.map(h => [
      h.date,
      h.time,
      h.passageNumber,
      `"${h.passageTitle.replace(/"/g, '""')}"`,
      h.passageLength,
      h.grossWpm,
      h.netWpm,
      h.accuracy,
      h.errors,
      h.allowedMistakes,
      h.status,
      h.overallPerformance
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BSF_CAPF_Typing_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Complete Audit Log</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Examination Test History
          </h2>
          <p className="text-xs text-slate-500">
            Records of all 10-minute examination attempts with speed, error and pass/fail metrics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search passage title or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded font-bold ${filterStatus === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterStatus('QUALIFIED')}
              className={`px-2.5 py-1 rounded font-bold ${filterStatus === 'QUALIFIED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'}`}
            >
              Pass ({history.filter(h => h.status === 'QUALIFIED').length})
            </button>
            <button
              onClick={() => setFilterStatus('NOT_QUALIFIED')}
              className={`px-2.5 py-1 rounded font-bold ${filterStatus === 'NOT_QUALIFIED' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700'}`}
            >
              Fail ({history.filter(h => h.status === 'NOT_QUALIFIED').length})
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'netWpm' | 'accuracy')}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="date">Sort by Latest Date</option>
              <option value="netWpm">Sort by Highest Net WPM</option>
              <option value="accuracy">Sort by Accuracy</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">No test records matching your filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase tracking-wider font-extrabold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Passage</th>
                  <th className="py-3 px-4 text-right">Gross WPM</th>
                  <th className="py-3 px-4 text-right">Net WPM</th>
                  <th className="py-3 px-4 text-right">Accuracy</th>
                  <th className="py-3 px-4 text-right">Errors / 5%</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      {item.date} <span className="text-[10px] text-slate-400 block">{item.time}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        Passage {item.passageNumber < 10 ? `0${item.passageNumber}` : item.passageNumber}
                      </span>
                      <span className="text-slate-500 text-[11px] line-clamp-1 max-w-[200px]">
                        {item.passageTitle}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-700">
                      {item.grossWpm} <span className="text-[10px] font-normal text-slate-400">WPM</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                      <span className={item.netWpm >= 35 ? 'text-emerald-700 font-black' : 'text-rose-600 font-bold'}>
                        {item.netWpm}
                      </span>{' '}
                      <span className="text-[10px] font-normal text-slate-400">WPM</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      {item.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      <span className="font-bold text-slate-900">{item.errors}</span>
                      <span className="text-[10px] text-slate-400 ml-1">/ {item.allowedMistakes} allowed</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'QUALIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {item.status === 'QUALIFIED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item.overallPerformance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-slate-900 border border-slate-200">
            <h3 className="text-base font-bold text-center mb-2">Clear All Test History?</h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              This will permanently delete all your saved typing test attempts and performance analytics from this browser. This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
