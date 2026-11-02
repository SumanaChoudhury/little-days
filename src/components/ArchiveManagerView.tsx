import React, { useState } from 'react';
import { Archive, Download, CheckCircle, ShieldCheck, HardDrive, RotateCcw, AlertCircle, Sparkles, FolderArchive, FileText, ArrowDown } from 'lucide-react';
import { ArchiveBundle, MemoryPost } from '../types';
import { memoryStorage, isOlderThan90Days, formatMemoryDate } from '../lib/storage';

interface ArchiveManagerViewProps {
  memories: MemoryPost[];
  bundles: ArchiveBundle[];
  onRefresh: () => void;
  onRestoreMemory: (id: string) => void;
}

export const ArchiveManagerView: React.FC<ArchiveManagerViewProps> = ({
  memories,
  bundles,
  onRefresh,
  onRestoreMemory
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [selectedBundle, setSelectedBundle] = useState<ArchiveBundle | null>(null);

  const stats = memoryStorage.getStorageStats();

  const olderEligibleMemories = memories.filter(m => isOlderThan90Days(m.date) && !m.isArchived);

  const handleRunArchiving = async () => {
    try {
      setIsProcessing(true);
      const res = await memoryStorage.run90DayArchiving(status => setProgressMsg(status));
      alert(`Success! Created ${res.bundle.fileName} containing ${res.archivedCount} memories.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Archiving failed.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDownloadExistingBundle = async (bundle: ArchiveBundle) => {
    // Generate and download zip for the bundle's memories
    const bundleMemories = memories.filter(m => bundle.postIds.includes(m.id));
    if (bundleMemories.length === 0) {
      alert('No media found for this bundle.');
      return;
    }
    const blob = await memoryStorage.createMonthlyArchive(bundle.monthYear, bundleMemories);
    memoryStorage.triggerDownload(blob, bundle.fileName);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pb-20 pt-2 select-none">
      {/* Title & Concept Header */}
      <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 border border-sky-400/20 dark:border-sky-800/30 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              Smart Memory Archiving
            </h2>
            <p className="text-[11px] text-neutral-500">
              Personal Storage Blueprint • 90-Day Cold Vault
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2">
          Your life memories are preserved with full original quality. Memories newer than 90 days remain instantly accessible in hot storage; memories older than 90 days are bundled into monthly ZIP archives while staying visible in your feed.
        </p>
      </div>

      {/* Storage Tier Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Hot Storage (0-90 Days) */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Hot Storage (0–90d)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
              {stats.hotCount} <span className="text-xs font-normal">memories</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {formatBytes(stats.hotBytes)}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-2">
            Originals ready for instant viewing & sharing.
          </p>
        </div>

        {/* Cold Storage (90+ Days) */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Cold Storage (90d+)
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-lg font-bold text-sky-950 dark:text-sky-200">
              {stats.coldCount} <span className="text-xs font-normal">memories</span>
            </div>
            <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
              {formatBytes(stats.coldBytes)}
            </span>
          </div>
          <p className="text-[10px] text-sky-600/80 dark:text-sky-400/80 mt-2">
            Bundled in verified monthly ZIP containers.
          </p>
        </div>
      </div>

      {/* Action: Run 90-Day Archiving */}
      <div className="bg-white dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Smart Archive Execution</span>
            </h3>
            <span className="text-[11px] text-neutral-500">
              {olderEligibleMemories.length > 0
                ? `${olderEligibleMemories.length} memories ready to be archived into a monthly ZIP.`
                : 'All memories older than 90 days are currently archived and verified.'}
            </span>
          </div>
        </div>

        {isProcessing ? (
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-center text-xs text-sky-600 dark:text-sky-400 font-medium animate-pulse">
            {progressMsg || 'Processing Smart Archive...'}
          </div>
        ) : (
          <button
            onClick={handleRunArchiving}
            disabled={olderEligibleMemories.length === 0}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <FolderArchive className="w-4 h-4" />
            <span>
              {olderEligibleMemories.length > 0
                ? `Bundle ${olderEligibleMemories.length} Memories into Monthly ZIP`
                : 'Everything Up to Date'}
            </span>
          </button>
        )}
      </div>

      {/* Monthly ZIP Archive Bundles List */}
      <div className="bg-white dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] rounded-2xl p-4 shadow-sm mb-4">
        <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FolderArchive className="w-3.5 h-3.5 text-indigo-500" />
            <span>Monthly Archive Bundles</span>
          </span>
          <span className="text-[10px] text-neutral-400 font-normal">
            {bundles.length} archives created
          </span>
        </h3>

        {bundles.length === 0 ? (
          <p className="text-xs text-neutral-400 py-4 text-center">
            No archives created yet.
          </p>
        ) : (
          <div className="space-y-2">
            {bundles.map((bundle, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {bundle.fileName}
                    </h4>
                    <span className="text-[10px] text-neutral-500">
                      {bundle.itemCount} items • {formatBytes(bundle.totalBytes)} • Created {bundle.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadExistingBundle(bundle)}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 transition-colors shadow-xs"
                    title="Download ZIP"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security & Recovery Notice */}
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-3 text-[11px] text-neutral-500 leading-normal flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Safety Guarantee:
          </span>{' '}
          Original high-res photos and videos are never removed until the monthly ZIP archive is verified and checksum-checked. You can restore any archived memory with one tap.
        </div>
      </div>
    </div>
  );
};
