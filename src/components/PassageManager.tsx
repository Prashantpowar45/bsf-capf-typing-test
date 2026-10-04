import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  AlertCircle
} from 'lucide-react';
import type { Passage } from '../types';

interface PassageManagerProps {
  passages: Passage[];
  onSavePassage: (passage: Passage) => void;
  onDeletePassage: (passageId: string) => void;
  onResetPassages: () => void;
  onSelectForTest: (passage: Passage) => void;
}

export const PassageManager: React.FC<PassageManagerProps> = ({
  passages,
  onSavePassage,
  onDeletePassage,
  onResetPassages,
  onSelectForTest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPassage, setEditingPassage] = useState<Passage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formNumber, setFormNumber] = useState<number>(passages.length + 1);

  const filteredPassages = passages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.number.toString().includes(searchTerm)
  );

  const handleOpenCreate = () => {
    setIsCreatingNew(true);
    setEditingPassage(null);
    setFormTitle('');
    setFormContent('');
    setFormNumber(passages.length + 1);
  };

  const handleOpenEdit = (p: Passage) => {
    setEditingPassage(p);
    setIsCreatingNew(false);
    setFormTitle(p.title);
    setFormContent(p.content);
    setFormNumber(p.number);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const words = formContent.trim().split(/\s+/).length;
    const chars = formContent.length;

    const newOrUpdated: Passage = {
      id: editingPassage ? editingPassage.id : `custom-passage-${Date.now()}`,
      number: formNumber,
      title: formTitle.trim(),
      content: formContent.trim(),
      wordCount: words,
      charCount: chars,
      source: 'User Custom Exam Matter',
      isCustom: true,
    };

    onSavePassage(newOrUpdated);
    setIsCreatingNew(false);
    setEditingPassage(null);
  };

  const exportPassagesJSON = () => {
    const jsonStr = JSON.stringify(passages, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAPF_BSF_HCM_Passages_${passages.length}_Matter.json`;
    a.click();
  };

  const importPassagesJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            if (p.title && p.content) {
              onSavePassage(p);
            }
          });
          alert(`Successfully imported ${parsed.length} passages!`);
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Passage Database Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official 50 Passages & Custom Matter Library
          </h2>
          <p className="text-xs text-slate-500">
            Internal database containing {passages.length} official CAPF / BSF HCM typing examination passages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Passage</span>
          </button>

          <button
            onClick={exportPassagesJSON}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <label className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 shadow-sm flex items-center space-x-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={importPassagesJSON} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
            title="Reset to default 50 passages"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search passages by title, number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Passages Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase tracking-wider font-extrabold text-[11px]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">#</th>
                <th className="py-3 px-4">Passage Title</th>
                <th className="py-3 px-4 w-32 text-center">Words / Chars</th>
                <th className="py-3 px-4 w-32 text-center">Origin</th>
                <th className="py-3 px-4 w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPassages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                    {p.number < 10 ? `0${p.number}` : p.number}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span>{p.title}</span>
                      {p.isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-700">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal line-clamp-1 max-w-md mt-0.5 font-serif">
                      {p.content}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-800">{p.wordCount} words</span>
                    <span className="text-[10px] text-slate-400 block">{p.charCount} chars</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {p.isCustom ? 'User Created' : 'Official CAPF'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onSelectForTest(p)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-xs transition-colors"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Edit Passage"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {p.isCustom && (
                        <button
                          onClick={() => onDeletePassage(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Custom Passage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Passage Modal */}
      {(isCreatingNew || editingPassage) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-600">
              <h3 className="text-base font-bold">
                {editingPassage ? `Edit Passage ${editingPassage.number}` : 'Add New Typing Matter Passage'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingPassage(null);
                }}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Passage No.
                  </label>
                  <input
                    type="number"
                    value={formNumber}
                    onChange={(e) => setFormNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Passage Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Public Administration and Ethics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Passage Content (Matter)
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    {formContent.trim() ? formContent.trim().split(/\s+/).length : 0} Words • {formContent.length} Characters
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Paste or type the exact English examination passage here..."
                  className="w-full p-3.5 border border-slate-300 rounded-lg font-serif text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> Passages must preserve every word, punctuation, and capitalization as intended in official examination booklets.
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingPassage(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  Save Passage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-slate-900 border border-slate-200">
            <h3 className="text-base font-bold text-center mb-2">Reset to Default 50 Passages?</h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              This will restore the original 50 official CAPF / BSF HCM passages from the examination matter booklet and remove any custom changes.
            </p>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetPassages();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
