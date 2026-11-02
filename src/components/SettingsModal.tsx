import React, { useState } from 'react';
import { X, Shield, Download, Trash2, LogOut, Key, User, HardDrive, AlertTriangle, Database, CheckCircle2, ChevronDown, ChevronUp, Mail, Edit3, Check } from 'lucide-react';
import { UserAccount, authService, validateEmailFormat } from '../lib/auth';
import { memoryStorage } from '../lib/storage';
import { supabaseConfig, saveLocalSupabaseConfig } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUpdateUser?: (user: UserAccount) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onDeleteAccount,
  onUpdateUser
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Email update state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Cloud DB Config Form
  const [showDbConfig, setShowDbConfig] = useState(false);
  const [dbUrl, setDbUrl] = useState(supabaseConfig.url || '');
  const [dbKey, setDbKey] = useState(supabaseConfig.anonKey || '');
  const [dbSaved, setDbSaved] = useState(false);

  if (!isOpen) return null;

  const emailValidation = isEditingEmail ? validateEmailFormat(emailInput) : { isValid: true };

  const handleSaveEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    const val = validateEmailFormat(emailInput);
    if (!val.isValid) {
      setEmailError(val.error || 'Please enter a valid email address.');
      return;
    }

    try {
      const updated = authService.updateEmail(emailInput);
      if (onUpdateUser) {
        onUpdateUser(updated);
      }
      setEmailSuccess('Email updated successfully!');
      setIsEditingEmail(false);
      setTimeout(() => setEmailSuccess(''), 3000);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email');
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const memories = memoryStorage.getMemories();
      const blob = await memoryStorage.createMonthlyArchive('Full_Backup', memories);
      memoryStorage.triggerDownload(blob, `mymemories_full_backup_${currentUser.username}.zip`);
      alert('Full memory archive backup downloaded successfully!');
    } catch (e: any) {
      alert(e.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDb = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalSupabaseConfig(dbUrl.trim(), dbKey.trim());
    setDbSaved(true);
    setTimeout(() => setDbSaved(false), 3000);
  };

  const handleConfirmDelete = () => {
    if (deleteInput.toLowerCase() !== currentUser.username.toLowerCase()) {
      alert(`Please type "${currentUser.username}" to confirm deletion.`);
      return;
    }
    onDeleteAccount();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-md border border-[#dbdbdb] dark:border-[#383838] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#dbdbdb] dark:border-[#383838] flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">Settings & Privacy</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs text-neutral-700 dark:text-neutral-300">
          {/* User Account Info */}
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-12 h-12 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
              />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-black dark:text-white truncate">
                  {currentUser.username}
                </span>
                <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified {currentUser.provider === 'google' ? 'Google' : 'Email'}
                  </span>
                  <span className="text-[10px] text-neutral-400">·</span>
                  <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3 text-sky-500" /> Private Vault
                  </span>
                </div>
              </div>
            </div>

            {/* Email change section */}
            {!isEditingEmail ? (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Need to update your email?</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput(currentUser.email);
                    setEmailError('');
                    setIsEditingEmail(true);
                  }}
                  className="text-[11px] font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> Change Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveEmail} className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Change Registered Email
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmail(false);
                      setEmailError('');
                    }}
                    className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="Enter valid email (e.g. name@gmail.com)"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-black dark:text-white outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                </div>

                {/* Email typo suggestion */}
                {emailValidation.suggestion && (
                  <button
                    type="button"
                    onClick={() => setEmailInput(emailValidation.suggestion!)}
                    className="text-[11px] text-amber-500 hover:underline block text-left"
                  >
                    💡 Did you mean <strong>{emailValidation.suggestion}</strong>? Click to apply.
                  </button>
                )}

                {emailError && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {emailError}
                  </p>
                )}
              </form>
            )}

            {emailSuccess && (
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {emailSuccess}
              </p>
            )}
          </div>

          {/* Online Safe Database (Supabase) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Online Safe Database
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                supabaseConfig.isConfigured 
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              }`}>
                {supabaseConfig.isConfigured ? '● Cloud Connected' : '● Local Encrypted Vault'}
              </span>
            </div>
            
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2.5 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-black dark:text-white">
                    PostgreSQL with Row Level Security (RLS)
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
                    Database keys are protected via Render Environment Variables and client-side encryption. Keys are never committed or exposed on GitHub.
                  </p>
                </div>
              </div>

              {/* Toggle manual key entry */}
              <button
                type="button"
                onClick={() => setShowDbConfig(!showDbConfig)}
                className="w-full flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-sky-500 hover:text-sky-600 transition-colors"
              >
                <span>{showDbConfig ? 'Hide Cloud Key Settings' : 'Connect Custom Supabase Credentials'}</span>
                {showDbConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDbConfig && (
                <form onSubmit={handleSaveDb} className="pt-2 space-y-2 animate-fade-in">
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase font-semibold block mb-1">
                      Project URL (e.g., https://xyz.supabase.co)
                    </label>
                    <input
                      type="url"
                      value={dbUrl}
                      onChange={e => setDbUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase font-semibold block mb-1">
                      Anon Public Key
                    </label>
                    <input
                      type="password"
                      value={dbKey}
                      onChange={e => setDbKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400">Saved only in your private browser</span>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-sky-500 text-white font-semibold text-xs hover:bg-sky-600 transition-colors"
                    >
                      {dbSaved ? 'Saved!' : 'Save Credentials'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Privacy & Cloud Storage */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Media & Storage Vault
            </span>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <HardDrive className="w-4 h-4 text-sky-500" />
                  <span>Smart 90-Day Cold Vault</span>
                </span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Media older than 90 days automatically packages into monthly ZIP bundles with sha256 checksums, freeing active browser storage.
              </p>

              {/* Download Backup */}
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-black dark:text-white"
              >
                <Download className="w-4 h-4 text-sky-500" />
                <span>{isExporting ? 'Creating ZIP Backup...' : 'Download Complete Data (ZIP)'}</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
              Account Management
            </span>

            {/* Log Out */}
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <LogOut className="w-4 h-4 text-neutral-500" />
              <span>Log Out ({currentUser.username})</span>
            </button>

            {/* Delete Account */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 text-xs font-semibold flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account & Purge Data</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Permanently Delete Account?</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-normal">
                  This action is irreversible. All your memories, photos, videos, stories, and archive bundles will be completely deleted from your browser and vault.
                </p>
                <div>
                  <span className="text-[11px] text-neutral-500 block mb-1">
                    Type your username <strong className="text-black dark:text-white font-mono">{currentUser.username}</strong> to confirm:
                  </span>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value)}
                    placeholder={currentUser.username}
                    className="w-full p-2 rounded-lg bg-white dark:bg-neutral-900 border border-rose-300 dark:border-rose-800 text-xs text-black dark:text-white outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleteInput.toLowerCase() !== currentUser.username.toLowerCase()}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold disabled:opacity-40"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
