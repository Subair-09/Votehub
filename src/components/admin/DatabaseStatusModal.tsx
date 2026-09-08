import React, { useState } from 'react';
import { Database, Cloud, CheckCircle, AlertCircle, RefreshCw, X, HardDrive, Key, ExternalLink } from 'lucide-react';
import { IntegrationStatus, getIntegrationStatus } from '../../lib/api';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: IntegrationStatus | null;
  onRefresh: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isMongoLive = status?.mongodb?.connected;
  const isCloudinaryLive = status?.cloudinary?.configured;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1769E8]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">Database & Media Storage</h3>
              <p className="text-xs text-slate-500 mt-0.5">MongoDB Atlas & Cloudinary Storage Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* MongoDB Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMongoLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">MongoDB Database</h4>
                  <p className="text-xs text-slate-500">Database: <code className="bg-white px-1 py-0.5 rounded text-slate-700 border border-slate-200">{status?.mongodb?.database || 'votehub'}</code></p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isMongoLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isMongoLive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                {isMongoLive ? 'Connected' : 'In-Memory Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {status?.mongodb?.message || 'Connecting to database backend...'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Configure <code className="text-blue-600 font-semibold">MONGODB_URI</code> in environment settings for permanent cloud synchronization.</span>
            </div>
          </div>

          {/* Cloudinary Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCloudinaryLive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Cloudinary Cloud Storage</h4>
                  <p className="text-xs text-slate-500">
                    Cloud Name: <code className="bg-white px-1 py-0.5 rounded text-slate-700 border border-slate-200">{status?.cloudinary?.cloudName || 'Local Buffer'}</code>
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isCloudinaryLive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudinaryLive ? 'bg-emerald-600' : 'bg-slate-500'}`} />
                {isCloudinaryLive ? 'Active' : 'Fallback Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {status?.cloudinary?.message || 'Connecting to media storage backend...'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Configure <code className="text-blue-600 font-semibold">CLOUDINARY_CLOUD_NAME</code>, <code className="text-blue-600 font-semibold">CLOUDINARY_API_KEY</code>, & <code className="text-blue-600 font-semibold">CLOUDINARY_API_SECRET</code> for automatic asset CDN delivery.</span>
            </div>
          </div>

          {/* Active Collections Info */}
          <div className="border border-slate-100 rounded-xl p-3.5 bg-white">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Active Collections & Schema</h5>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span><code>candidates</code> collection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span><code>signup_codes</code> (7-digit)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span><code>votes</code> audit ledger</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span><code>activity_logs</code> feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Check Status</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
