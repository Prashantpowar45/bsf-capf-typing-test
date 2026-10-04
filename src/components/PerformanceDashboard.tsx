import React from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Percent, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  BarChart2, 
  Play
} from 'lucide-react';
import type { TestHistoryItem } from '../types';

interface PerformanceDashboardProps {
  history: TestHistoryItem[];
  onStartNewTest: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  history,
  onStartNewTest,
}) => {
  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Typing Tests Recorded Yet</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
          Complete your first 10-minute CAPF / BSF HCM paper-to-screen typing examination test to unlock comprehensive analytics and speed improvement graphs.
        </p>
        <button
          onClick={onStartNewTest}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Your First Test</span>
        </button>
      </div>
    );
  }

  // Calculate Aggregates
  const totalTests = history.length;
  const qualifiedTests = history.filter(h => h.status === 'QUALIFIED').length;
  const notQualifiedTests = totalTests - qualifiedTests;
  const qualificationRate = Math.round((qualifiedTests / totalTests) * 100);

  const bestGrossWpm = Math.max(...history.map(h => h.grossWpm));
  const bestNetWpm = Math.max(...history.map(h => h.netWpm));
  const averageGrossWpm = Math.round((history.reduce((acc, h) => acc + h.grossWpm, 0) / totalTests) * 10) / 10;
  const averageNetWpm = Math.round((history.reduce((acc, h) => acc + h.netWpm, 0) / totalTests) * 10) / 10;

  const bestAccuracy = Math.max(...history.map(h => h.accuracy));
  const averageAccuracy = Math.round((history.reduce((acc, h) => acc + h.accuracy, 0) / totalTests) * 10) / 10;
  const lowestErrors = Math.min(...history.map(h => h.errors));

  // Prepare data for line charts (oldest to newest, up to 15 tests)
  const chartHistory = [...history].reverse().slice(-15);
  const maxNetSpeed = Math.max(50, ...chartHistory.map(h => h.netWpm)) + 5;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Progress Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            My Examination Performance Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Real-time statistics across {totalTests} completed 10-minute typing tests
          </p>
        </div>

        <button
          onClick={onStartNewTest}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>New Typing Test</span>
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Best Net Speed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Best Net Speed</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{bestNetWpm}</span>
            <span className="text-xs font-bold text-slate-500">WPM</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Avg Net: {averageNetWpm} WPM</span>
        </div>

        {/* Best Gross Speed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Best Gross Speed</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{bestGrossWpm}</span>
            <span className="text-xs font-bold text-slate-500">WPM</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Avg Gross: {averageGrossWpm} WPM</span>
        </div>

        {/* Best Accuracy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Best Accuracy</span>
            <Percent className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{bestAccuracy}%</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Avg Acc: {averageAccuracy}%</span>
        </div>

        {/* Lowest Errors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Lowest Errors</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{lowestErrors}</span>
            <span className="text-xs font-bold text-slate-500">mistakes</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">In 10 min session</span>
        </div>

        {/* Qualification Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pass Rate</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{qualificationRate}%</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {qualifiedTests} Pass / {notQualifiedTests} Fail
          </span>
        </div>
      </div>

      {/* SVG Interactive Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Net Speed Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Net WPM Improvement Over Tests</h3>
              <p className="text-xs text-slate-500">Target benchmark: 35 WPM (dotted line)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Target: 35 WPM
            </span>
          </div>

          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Background horizontal grid lines */}
              {[10, 20, 30, 35, 40, 50].map((val) => {
                const y = 190 - (val / maxNetSpeed) * 180;
                const isTarget = val === 35;
                return (
                  <g key={val}>
                    <line
                      x1="30"
                      y1={y}
                      x2="490"
                      y2={y}
                      stroke={isTarget ? '#059669' : '#e2e8f0'}
                      strokeWidth={isTarget ? 2 : 1}
                      strokeDasharray={isTarget ? '4 3' : 'none'}
                    />
                    <text x="5" y={y + 3} fontSize="9" fill={isTarget ? '#059669' : '#94a3b8'} fontWeight={isTarget ? 'bold' : 'normal'}>
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Data line */}
              {chartHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartHistory.map((item, idx) => {
                    const x = 30 + (idx / (chartHistory.length - 1)) * 460;
                    const y = 190 - (item.netWpm / maxNetSpeed) * 180;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}

              {/* Data points */}
              {chartHistory.map((item, idx) => {
                const x = chartHistory.length === 1 ? 250 : 30 + (idx / (chartHistory.length - 1)) * 460;
                const y = 190 - (item.netWpm / maxNetSpeed) * 180;
                const isPass = item.status === 'QUALIFIED';
                return (
                  <g key={item.id} className="cursor-pointer group">
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      fill={isPass ? '#10b981' : '#f43f5e'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#1e293b"
                    >
                      {item.netWpm}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
            <span>Earlier Tests</span>
            <span>Latest Tests</span>
          </div>
        </div>

        {/* Accuracy Progress Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Typing Accuracy (%) Progression</h3>
              <p className="text-xs text-slate-500">Target minimum: 90% accuracy</p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Goal: &gt; 95%
            </span>
          </div>

          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {[80, 85, 90, 95, 100].map((val) => {
                const y = 190 - ((val - 75) / 25) * 180;
                return (
                  <g key={val}>
                    <line
                      x1="35"
                      y1={y}
                      x2="490"
                      y2={y}
                      stroke={val === 90 ? '#9333ea' : '#e2e8f0'}
                      strokeWidth={val === 90 ? 1.5 : 1}
                      strokeDasharray={val === 90 ? '4 3' : 'none'}
                    />
                    <text x="5" y={y + 3} fontSize="9" fill="#94a3b8">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {chartHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartHistory.map((item, idx) => {
                    const x = 35 + (idx / (chartHistory.length - 1)) * 455;
                    const clampedAcc = Math.max(75, Math.min(100, item.accuracy));
                    const y = 190 - ((clampedAcc - 75) / 25) * 180;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}

              {chartHistory.map((item, idx) => {
                const x = chartHistory.length === 1 ? 250 : 35 + (idx / (chartHistory.length - 1)) * 455;
                const clampedAcc = Math.max(75, Math.min(100, item.accuracy));
                const y = 190 - ((clampedAcc - 75) / 25) * 180;
                return (
                  <g key={item.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#1e293b"
                    >
                      {item.accuracy}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
            <span>Earlier Tests</span>
            <span>Latest Tests</span>
          </div>
        </div>

      </div>

      {/* Recent Tests Table Snippet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-amber-600" />
          <span>Recent Tests Breakdown</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider">
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Passage</th>
                <th className="pb-3">Gross WPM</th>
                <th className="pb-3">Net WPM</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Mistakes / 5%</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice(0, 5).map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-600">{test.date} {test.time}</td>
                  <td className="py-3 font-bold text-slate-900">Passage {test.passageNumber < 10 ? `0${test.passageNumber}` : test.passageNumber}</td>
                  <td className="py-3 font-bold text-slate-700">{test.grossWpm} WPM</td>
                  <td className="py-3 font-black text-slate-900">{test.netWpm} WPM</td>
                  <td className="py-3 font-semibold text-slate-700">{test.accuracy}%</td>
                  <td className="py-3 font-medium text-slate-600">{test.errors} (Allow: {test.allowedMistakes})</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      test.status === 'QUALIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {test.status === 'QUALIFIED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{test.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
