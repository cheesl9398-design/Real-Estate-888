import React, { useState } from 'react';
import { Database, Key, ShieldCheck, CheckCircle2, AlertTriangle, X, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { getStoredFirebaseConfig, saveStoredFirebaseConfig, clearStoredFirebaseConfig, FirebaseCustomConfig } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isFirebaseActive, reloadConfig } = useAuth();
  const currentConfig = getStoredFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setStatusMessage('Please enter at least an API Key and Project ID.');
      return;
    }

    const newConfig: FirebaseCustomConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: `${projectId.trim()}.appspot.com`,
      appId: appId.trim() || undefined,
    };

    saveStoredFirebaseConfig(newConfig);
    reloadConfig();
    setStatusMessage('Configuration saved! Reconnecting...');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearStoredFirebaseConfig();
    setApiKey('');
    setProjectId('');
    setAuthDomain('');
    setAppId('');
    reloadConfig();
    setStatusMessage('Cleared custom config. Switched to offline/local reactive sync.');
  };

  const sampleEnv = `# Vercel / GitHub .env.production configuration:
VITE_FIREBASE_API_KEY="${apiKey || 'AIzaSyExample...'}"
VITE_FIREBASE_PROJECT_ID="${projectId || 'your-estateguru-project'}"
VITE_FIREBASE_AUTH_DOMAIN="${projectId ? `${projectId}.firebaseapp.com` : 'your-estateguru-project.firebaseapp.com'}"
VITE_FIREBASE_APP_ID="${appId || '1:123456789:web:abcdef'}"`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Firebase & Cloud Sync Settings</h3>
              <p className="text-xs text-slate-300">Firestore database & Google Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isFirebaseActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {isFirebaseActive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <span className="font-semibold block">
                {isFirebaseActive
                  ? 'Live Firebase Backend Active'
                  : 'Zero-Config Local Sync Active (Safe Mode)'}
              </span>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isFirebaseActive
                  ? 'The app is successfully linked to your Firebase project. All property edits and inquiries persist directly to Firestore and Google Auth.'
                  : 'The platform is operating with an in-memory & localStorage reactive state engine with simulated Google Auth. You can paste your Firebase credentials below or deploy with environment variables on Vercel.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-rose-600" /> Connect Custom Firebase Project
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Firebase Web API Key (apiKey)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project ID (projectId)
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  placeholder="estateguru-portal-123"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  App ID (optional)
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={e => setAppId(e.target.value)}
                  placeholder="1:123456789:web:..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Auth Domain (authDomain)
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                placeholder="your-project.firebaseapp.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>

            {statusMessage && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2 rounded-lg">
                {statusMessage}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Clear Custom Keys
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </form>

          {/* Vercel & GitHub instructions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vercel & GitHub Deployment
              </h5>
              <button
                onClick={copyEnv}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied .env!' : 'Copy .env variables'}
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              When committing to GitHub and deploying to Vercel, simply add these Environment Variables in your Vercel Project Settings:
            </p>
            <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto leading-relaxed">
              {sampleEnv}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
