import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getPositionsApi, createPositionApi, deletePositionApi, PositionItem } from '../../lib/api';
import { Candidate } from '../../data/candidates';

interface PositionsManagementViewProps {
  candidates?: Candidate[];
  onPositionCreated?: (position: PositionItem) => void;
}

export const PositionsManagementView: React.FC<PositionsManagementViewProps> = ({
  candidates = [],
  onPositionCreated,
}) => {
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for Admin to enter a new position
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Executive Council');
  const [description, setDescription] = useState('');
  const [maxSelections, setMaxSelections] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load positions from MongoDB API
  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    setIsLoading(true);
    try {
      const list = await getPositionsApi();
      setPositions(list);
    } catch (err) {
      console.warn('Failed to load positions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin enters and saves a new position
  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Position title is required.');
      return;
    }

    // Check duplicate
    if (positions.some((p) => p.title.toLowerCase() === title.trim().toLowerCase())) {
      setErrorMessage(`Position "${title.trim()}" is already registered.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const created = await createPositionApi({
        title: title.trim(),
        department: department.trim() || 'General',
        description: description.trim() || 'Official elective student union position',
        maxSelections: Number(maxSelections) || 1,
      });

      setPositions((prev) => [created, ...prev]);
      if (onPositionCreated) onPositionCreated(created);

      // Reset form
      setTitle('');
      setDescription('');
      setMaxSelections(1);
      setIsCreateModalOpen(false);
      showToast(`✓ Position "${created.title}" successfully entered and saved.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to enter position.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin deletes a position
  const handleDeletePosition = async (posId: string, posTitle: string) => {
    const candidateCount = candidates.filter(
      (c) => c.position.toLowerCase() === posTitle.toLowerCase()
    ).length;

    if (
      !window.confirm(
        `Are you sure you want to remove the position "${posTitle}"?${
          candidateCount > 0
            ? ` Note: ${candidateCount} candidate(s) currently hold this title.`
            : ''
        }`
      )
    ) {
      return;
    }

    try {
      await deletePositionApi(posId);
      setPositions((prev) => prev.filter((p) => p.id !== posId));
      showToast(`Position "${posTitle}" deleted.`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete position.');
    }
  };

  // Filter positions
  const filteredPositions = positions.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-left">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-700 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#1769E8] flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0D1B35] tracking-tight">
                Election Positions & Offices
              </h2>
              <p className="text-xs text-[#60708D] mt-0.5">
                Admin controls: enter, configure, and manage official ballot titles for the election.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setErrorMessage(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1769E8] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Enter New Position</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#DDE7F3] p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1769E8] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Total Positions Entered
            </span>
            <span className="text-2xl font-black text-[#0D1B35]">{positions.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE7F3] p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Candidates Contesting
            </span>
            <span className="text-2xl font-black text-[#0D1B35]">{candidates.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE7F3] p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Authority Level
            </span>
            <span className="text-sm font-bold text-[#0D1B35] flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Administrator Exclusive
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by position name, department or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredPositions.length} of {positions.length} positions
        </span>
      </div>

      {/* Positions Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDE7F3]">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading election positions...</p>
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDE7F3]">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No positions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? 'No positions match your search term. Clear the search or enter a new position.'
              : 'No positions have been entered yet. As the admin, you can enter the first position.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#1769E8] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Enter Position Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPositions.map((pos) => {
            const assignedCandidates = candidates.filter(
              (c) => c.position.toLowerCase() === pos.title.toLowerCase()
            );

            return (
              <div
                key={pos.id}
                className="bg-white rounded-2xl border border-[#DDE7F3] p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1769E8] text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-blue-100">
                        {pos.department || 'Executive'}
                      </span>
                      <h3 className="text-lg font-black text-[#0D1B35] tracking-tight">
                        {pos.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeletePosition(pos.id, pos.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {pos.description || 'Official elective student union position designated for election.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-slate-700">
                      {assignedCandidates.length}
                    </span>
                    <span>candidate{assignedCandidates.length === 1 ? '' : 's'} registered</span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                    Max: {pos.maxSelections || 1} Seat
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Enter Position Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
            {/* Modal Header */}
            <div className="bg-[#0D1B35] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1769E8] flex items-center justify-center text-white">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Enter Election Position</h3>
                  <p className="text-[11px] text-slate-300">
                    Admin creates a new elective office for the ballot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePosition} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Director of Sports, Senate President, Auditor..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This title will be available for candidates to contest and on official ballot papers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Directorate
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Executive Council">Executive Council</option>
                    <option value="Secretariat">Secretariat</option>
                    <option value="Finance Directorate">Finance Directorate</option>
                    <option value="Communications Bureau">Communications Bureau</option>
                    <option value="Student Life & Culture">Student Life & Culture</option>
                    <option value="Student Affairs">Student Affairs</option>
                    <option value="Legislative Arm (Senate)">Legislative Arm (Senate)</option>
                    <option value="Judicial Council">Judicial Council</option>
                    <option value="Faculty Representatives">Faculty Representatives</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Seats to Elect
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxSelections}
                    onChange={(e) => setMaxSelections(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duties & Office Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the responsibilities, statutory mandates, or prerequisites for this position..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-[#1769E8] hover:bg-blue-600 text-white rounded-lg transition-all shadow-xs disabled:opacity-60 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Position...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enter & Save Position</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
