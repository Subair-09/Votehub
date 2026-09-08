import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Check,
  Ban,
  Download,
  Filter,
  ShieldCheck,
  Sparkles,
  Database,
} from 'lucide-react';
import {
  getSignupCodesApi,
  generateSignupCodesApi,
  assignSignupCodeApi,
  revokeSignupCodeApi,
  SignupCodeItem,
} from '../../lib/api';

export interface AdminSignupCode {
  id?: string;
  code: string;
  createdAt: string;
  status: 'unused' | 'used' | 'revoked';
  assignedTo?: string;
  department?: string;
  usedAt?: string;
}

const STORAGE_KEY_GENERATED = 'votehub_admin_generated_codes';
const STORAGE_KEY_USED = 'votehub_used_signup_codes';

// Default initial codes if none exists
const DEFAULT_CODES: AdminSignupCode[] = [
  { code: '7842910', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '9138402', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '6294715', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '8401923', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '5729104', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '3910482', createdAt: '2026-09-08 08:30', status: 'unused' },
  { code: '7F3A2B1', createdAt: '2026-09-08 08:00', status: 'used', assignedTo: 'Student 2026-0418', usedAt: '7 minutes ago' },
  { code: '4D9C8E2', createdAt: '2026-09-08 07:45', status: 'used', assignedTo: 'Student 2026-0891', usedAt: '15 minutes ago' },
  { code: '1092834', createdAt: '2026-09-07 14:20', status: 'used', assignedTo: 'John Doe', usedAt: '1 hour ago' },
  { code: '4829103', createdAt: '2026-09-07 12:10', status: 'revoked', assignedTo: 'Disqualified' },
];

export const CodeManagementView: React.FC = () => {
  const [codes, setCodes] = useState<AdminSignupCode[]>(DEFAULT_CODES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unused' | 'used' | 'revoked'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [assignModalCode, setAssignModalCode] = useState<string | null>(null);
  const [assigneeName, setAssigneeName] = useState('');
  const [departmentName, setDepartmentName] = useState('Faculty of Social Sciences');
  const [batchCount, setBatchCount] = useState<number>(5);
  const [toast, setToast] = useState<string | null>(null);

  // Load codes from MongoDB API
  useEffect(() => {
    async function loadBackendCodes() {
      try {
        const apiCodes = await getSignupCodesApi();
        if (apiCodes && apiCodes.length > 0) {
          setCodes(
            apiCodes.map((c: any) => ({
              id: c.id,
              code: c.code,
              createdAt: c.createdAt,
              status: c.status === 'assigned' ? 'used' : (c.status as any),
              assignedTo: c.assignedTo,
              department: c.department,
              usedAt: c.usedAt,
            }))
          );
        } else {
          // Check localStorage as fallback
          const stored = localStorage.getItem(STORAGE_KEY_GENERATED);
          if (stored) setCodes(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('API codes failed, using cached list', err);
      }
    }
    loadBackendCodes();
  }, []);

  // Sync used status from global used codes
  useEffect(() => {
    try {
      const usedRaw = localStorage.getItem(STORAGE_KEY_USED);
      if (usedRaw) {
        const usedList: string[] = JSON.parse(usedRaw);
        setCodes((prev) =>
          prev.map((c) =>
            usedList.includes(c.code) && c.status === 'unused'
              ? { ...c, status: 'used', usedAt: 'Just now' }
              : c
          )
        );
      }
    } catch {
      // fallback
    }
  }, []);

  // Persist to localStorage whenever codes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GENERATED, JSON.stringify(codes));
    } catch {
      // ignore
    }
  }, [codes]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Generate a random 7-digit code
  const generateSingle7DigitCode = (): string => {
    let newCode = '';
    do {
      // Exactly 7 digits (1000000 to 9999999)
      newCode = Math.floor(1000000 + Math.random() * 9000000).toString();
    } while (codes.some((c) => c.code === newCode));
    return newCode;
  };

  // Add 1 new code
  const handleGenerateOne = async () => {
    try {
      const generated = await generateSignupCodesApi(1);
      if (generated && generated.length > 0) {
        const item = generated[0];
        setCodes((prev) => [
          {
            id: item.id,
            code: item.code,
            createdAt: item.createdAt,
            status: item.status === 'assigned' ? 'used' : (item.status as any),
            assignedTo: item.assignedTo,
          },
          ...prev,
        ]);
        showNotification(`Generated new 7-digit signup code: ${item.code} (Saved to MongoDB)`);
        return;
      }
    } catch (err) {
      console.warn('API generate code failed, falling back locally', err);
    }

    const code = generateSingle7DigitCode();
    const newEntry: AdminSignupCode = {
      code,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unused',
    };
    setCodes([newEntry, ...codes]);
    showNotification(`Generated new 7-digit signup code: ${code}`);
  };

  // Batch generate
  const handleBatchGenerate = async (count: number) => {
    try {
      const generated = await generateSignupCodesApi(count);
      if (generated && generated.length > 0) {
        const newMapped = generated.map((item) => ({
          id: item.id,
          code: item.code,
          createdAt: item.createdAt,
          status: item.status === 'assigned' ? 'used' : (item.status as any),
          assignedTo: item.assignedTo,
        }));
        setCodes((prev) => [...newMapped, ...prev]);
        showNotification(`Generated ${count} unique 7-digit signup codes in MongoDB.`);
        return;
      }
    } catch (err) {
      console.warn('Batch generation API error, falling back locally', err);
    }

    const newEntries: AdminSignupCode[] = [];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    for (let i = 0; i < count; i++) {
      let code = '';
      do {
        code = Math.floor(1000000 + Math.random() * 9000000).toString();
      } while (
        codes.some((c) => c.code === code) ||
        newEntries.some((e) => e.code === code)
      );

      newEntries.push({
        code,
        createdAt: timestamp,
        status: 'unused',
      });
    }

    setCodes([...newEntries, ...codes]);
    showNotification(`Successfully generated ${count} unique 7-digit signup codes.`);
  };

  // Copy code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showNotification(`Code ${code} copied to clipboard!`);
  };

  // Revoke code
  const handleRevoke = async (code: string) => {
    const target = codes.find((c) => c.code === code);
    if (target?.id) {
      try {
        await revokeSignupCodeApi(target.id);
      } catch (err) {
        console.warn('Revoke API error', err);
      }
    }
    setCodes((prev) =>
      prev.map((c) => (c.code === code ? { ...c, status: 'revoked' } : c))
    );
    showNotification(`Code ${code} has been revoked.`);
  };

  // Assign code to a specific student / voter
  const handleSaveAssignment = async () => {
    if (!assignModalCode || !assigneeName.trim()) return;
    const target = codes.find((c) => c.code === assignModalCode);
    if (target?.id) {
      try {
        await assignSignupCodeApi(target.id, assigneeName.trim(), departmentName);
      } catch (err) {
        console.warn('Assign API error', err);
      }
    }
    setCodes((prev) =>
      prev.map((c) =>
        c.code === assignModalCode ? { ...c, assignedTo: assigneeName.trim(), department: departmentName } : c
      )
    );
    showNotification(`Code ${assignModalCode} assigned to ${assigneeName.trim()}`);
    setAssignModalCode(null);
    setAssigneeName('');
  };

  // Export codes as CSV
  const handleExportCSV = () => {
    const headers = 'Code,Status,Assigned To,Created At,Used At\n';
    const rows = codes
      .map(
        (c) =>
          `"${c.code}","${c.status}","${c.assignedTo || ''}","${c.createdAt}","${c.usedAt || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `votehub-signup-codes-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported signup codes to CSV.');
  };

  // Filtered code list
  const filteredCodes = codes.filter((c) => {
    const matchesQuery =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.assignedTo && c.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesQuery) return false;
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const totalCodes = codes.length;
  const unusedCount = codes.filter((c) => c.status === 'unused').length;
  const usedCount = codes.filter((c) => c.status === 'used').length;
  const revokedCount = codes.filter((c) => c.status === 'revoked').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D1B35] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1B35] tracking-tight">
            Code Management
          </h2>
          <p className="text-xs text-[#60708D] mt-1">
            Generate and manage one-time 7-digit registration security codes for accredited voters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#10234D] bg-white border border-[#DDE7F3] rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#60708D]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleGenerateOne}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-[#1257C4] rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Code</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#DDE7F3] shadow-xs">
          <span className="text-xs text-[#60708D] font-medium">Total Generated</span>
          <p className="text-2xl font-black text-[#0D1B35] mt-0.5">{totalCodes}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DDE7F3] shadow-xs">
          <span className="text-xs text-[#18A968] font-semibold">Available (Unused)</span>
          <p className="text-2xl font-black text-[#18A968] mt-0.5">{unusedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DDE7F3] shadow-xs">
          <span className="text-xs text-[#1769E8] font-semibold">Registered (Used)</span>
          <p className="text-2xl font-black text-[#1769E8] mt-0.5">{usedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DDE7F3] shadow-xs">
          <span className="text-xs text-rose-600 font-semibold">Revoked</span>
          <p className="text-2xl font-black text-rose-600 mt-0.5">{revokedCount}</p>
        </div>
      </div>

      {/* Batch Generator Panel */}
      <div className="bg-gradient-to-r from-[#EBF3FE] to-[#F5F9FF] p-5 rounded-2xl border border-[#D0E2FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1769E8] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0D1B35]">
              Quick Batch Code Generator
            </h4>
            <p className="text-xs text-[#60708D]">
              Create cryptographic 7-digit tokens in bulk for a department or hall.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBatchGenerate(5)}
            className="px-3 py-1.5 bg-white text-xs font-bold text-[#1769E8] border border-[#D0E2FF] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            +5 Codes
          </button>
          <button
            onClick={() => handleBatchGenerate(10)}
            className="px-3 py-1.5 bg-white text-xs font-bold text-[#1769E8] border border-[#D0E2FF] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            +10 Codes
          </button>
          <button
            onClick={() => handleBatchGenerate(25)}
            className="px-3 py-1.5 bg-[#1769E8] text-xs font-bold text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            +25 Codes
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE7F3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#60708D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or assignee..."
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium text-[#10234D] bg-slate-50/70 border border-[#DDE7F3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1769E8]/20 focus:border-[#1769E8]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['all', 'unused', 'used', 'revoked'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#1769E8] text-white shadow-xs'
                  : 'text-[#60708D] hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Code Table */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#DDE7F3] bg-[#F8FAFD]/70">
                <th className="py-3 px-5 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                  Signup Code
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                  Created / Used
                </th>
                <th className="py-3 px-5 text-[11px] font-bold text-[#60708D] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7F3]/60">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs text-[#60708D]">
                    No signup codes match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCodes.map((item) => (
                  <tr key={item.code} className="hover:bg-[#F9FBFE] transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#0D1B35]">
                        <KeyRound className="w-4 h-4 text-[#1769E8]" />
                        <span>{item.code}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {item.status === 'unused' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#18A968] border border-[#C6EED7]">
                          ● Available
                        </span>
                      ) : item.status === 'used' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          ✓ Used
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          ✕ Revoked
                        </span>
                      )}
                    </td>

                    {/* Assigned To */}
                    <td className="py-3.5 px-4 text-xs font-medium text-[#10234D]">
                      {item.assignedTo || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Created / Used */}
                    <td className="py-3.5 px-4 text-xs text-[#60708D]">
                      {item.status === 'used'
                        ? `Used (${item.usedAt || 'Recent'})`
                        : `Created: ${item.createdAt}`}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(item.code)}
                          className="p-1.5 text-slate-500 hover:text-[#1769E8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === item.code ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Assign button */}
                        {item.status === 'unused' && (
                          <button
                            onClick={() => {
                              setAssignModalCode(item.code);
                              setAssigneeName(item.assignedTo || '');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-[#1769E8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Assign
                          </button>
                        )}

                        {/* Revoke button */}
                        {item.status === 'unused' && (
                          <button
                            onClick={() => handleRevoke(item.code)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Revoke code"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Voter Modal */}
      {assignModalCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DDE7F3] shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-[#0D1B35]">
              Assign Code: <span className="font-mono text-[#1769E8]">{assignModalCode}</span>
            </h3>
            <p className="text-xs text-[#60708D] mt-1">
              Enter the name, matriculation number, or email of the voter receiving this code.
            </p>

            <input
              type="text"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              placeholder="e.g. Subair Nurudeen / U2026/0418"
              className="w-full mt-4 px-3.5 py-2.5 text-xs font-medium border border-[#DDE7F3] rounded-xl focus:ring-2 focus:ring-[#1769E8]/20 focus:border-[#1769E8] outline-hidden"
              autoFocus
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setAssignModalCode(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-blue-700 rounded-xl cursor-pointer"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
