import React, { useState, useEffect } from 'react';
import { X, Settings, Lock, Server, Cloud, Save, LogIn, AlertTriangle, RefreshCw } from 'lucide-react';
import { AIConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (newConfig: AIConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [provider, setProvider] = useState<'gemini' | 'ollama'>(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [modelName, setModelName] = useState(config.modelName);
  const [ollamaUrl, setOllamaUrl] = useState(config.ollamaUrl || 'http://localhost:11434');

  // Ollama Models State
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      setError('');
      
      setProvider(config.provider);
      setApiKey(config.apiKey || '');
      setModelName(config.modelName);
      setOllamaUrl(config.ollamaUrl || 'http://localhost:11434');
      setAvailableModels([]);
      setModelError('');
    }
  }, [isOpen, config]);

  const fetchOllamaModels = async () => {
    if (!ollamaUrl) return;
    setIsLoadingModels(true);
    setModelError('');
    try {
      const cleanUrl = ollamaUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/api/tags`);
      if (!response.ok) throw new Error('Failed to connect');
      const data = await response.json();
      
      if (data.models && Array.isArray(data.models)) {
        const models = data.models.map((m: any) => m.name);
        setAvailableModels(models);
        
        // If current model is not in list, keep it selected but user can switch
        // If no model selected and we have models, select first
        if (!modelName && models.length > 0) {
          setModelName(models[0]);
        }
      } else {
        setAvailableModels([]);
      }
    } catch (err) {
      console.error(err);
      setModelError('Connection failed. Is Ollama running?');
      setAvailableModels([]); // Reset on error
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Auto-fetch when provider is ollama and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && provider === 'ollama') {
      fetchOllamaModels();
    }
  }, [isOpen, isAuthenticated, provider]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid ID or Password');
    }
  };

  const handleSave = () => {
    onSave({
      provider,
      apiKey,
      modelName,
      ollamaUrl
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings className="h-5 w-5 text-slate-500" />
            <h2 className="font-bold text-lg">Admin Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-6">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">Please login to access configuration</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin ID</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Enter ID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Enter Password"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                <LogIn className="h-4 w-4" /> Login
              </button>
            </form>
          ) : (
            // Settings Form
            <div className="space-y-6">
              
              {/* Provider Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">AI Model Provider</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setProvider('ollama'); }}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      provider === 'ollama' 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Server className="h-6 w-6" />
                    <span className="font-bold text-sm">Local (Ollama)</span>
                  </button>
                  <button
                    onClick={() => { setProvider('gemini'); setModelName('gemini-2.5-flash'); }}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      provider === 'gemini' 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Cloud className="h-6 w-6" />
                    <span className="font-bold text-sm">Online (Gemini)</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                {provider === 'ollama' ? (
                  <>
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Local Model Name</label>
                      <div className="flex gap-2">
                        <select 
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                          disabled={isLoadingModels}
                        >
                          <option value="" disabled>Select a model...</option>
                          {/* Option for current model if not in list */}
                          {modelName && !availableModels.includes(modelName) && (
                             <option value={modelName}>{modelName} (Current)</option>
                          )}
                          {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                          {availableModels.length === 0 && !isLoadingModels && (
                             <option value="" disabled>No models found</option>
                          )}
                        </select>

                        <button 
                          onClick={fetchOllamaModels}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-600 transition-colors"
                          title="Refresh Models"
                        >
                          <RefreshCw className={`h-5 w-5 ${isLoadingModels ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      
                      {modelError ? (
                         <div className="flex items-center gap-1 mt-1 text-red-500">
                           <AlertTriangle className="h-3 w-3" />
                           <p className="text-[10px]">{modelError}</p>
                         </div>
                      ) : (
                         <p className="text-[10px] text-slate-400 mt-1">
                           {availableModels.length > 0 ? `${availableModels.length} models found.` : "Click refresh to load models."}
                         </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ollama URL</label>
                      <input 
                        type="text" 
                        value={ollamaUrl}
                        onChange={(e) => setOllamaUrl(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="http://localhost:11434"
                      />
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 p-2 rounded border border-amber-100">
                       <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                       <p className="text-[10px] text-amber-700 leading-tight">
                         <strong>Important:</strong> Ensure Ollama is launched with CORS enabled: <br/>
                         <code className="bg-amber-100 px-1 rounded mt-1 inline-block">set OLLAMA_ORIGINS="*" && ollama serve</code>
                       </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Key</label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Paste your Gemini API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Model Version</label>
                      <input 
                        type="text" 
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="e.g. gemini-2.5-flash"
                      />
                    </div>
                  </>
                )}
              </div>

              <button onClick={handleSave} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                <Save className="h-4 w-4" /> Save Configuration
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};