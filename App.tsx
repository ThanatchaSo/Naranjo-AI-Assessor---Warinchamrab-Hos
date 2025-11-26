
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { SettingsModal } from './components/SettingsModal';
import { NaranjoTab } from './components/NaranjoTab';
import { TimelineTab } from './components/TimelineTab';
import { TRANSLATIONS } from './constants';
import { Language, PatientDetails, AIConfig } from './types';
import { Activity, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('th');
  const [activeTab, setActiveTab] = useState<'naranjo' | 'timeline'>('naranjo');
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'ollama',
    modelName: 'medgemma',
    ollamaUrl: 'http://localhost:11434',
    apiKey: ''
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('naranjo_ai_config');
    if (savedConfig) {
      try {
        setAiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse saved config");
      }
    }
  }, []);

  const handleSaveSettings = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem('naranjo_ai_config', JSON.stringify(newConfig));
  };
  
  // Initialize patient details (Shared State)
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    fullName: '',
    hn: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    pharmacistName: '',
    licenseNo: '',
    history: []
  });

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header 
        lang={language} 
        setLang={setLanguage} 
        t={t} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={handleSaveSettings}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Shared Patient Info */}
        <PatientForm 
            t={t} 
            data={patientDetails} 
            onChange={setPatientDetails} 
        />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'timeline' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                    <Activity className="h-4 w-4" />
                    {t.tabTimeline}
                </button>
                <button
                    onClick={() => setActiveTab('naranjo')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'naranjo' 
                            ? 'bg-teal-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                    <ClipboardList className="h-4 w-4" />
                    {t.tabNaranjo}
                </button>
            </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
            {activeTab === 'timeline' ? (
                <TimelineTab t={t} />
            ) : (
                <NaranjoTab 
                    t={t} 
                    patientDetails={patientDetails}
                    onPatientChange={setPatientDetails}
                    language={language}
                    aiConfig={aiConfig}
                />
            )}
        </div>

      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
            <p className="text-slate-400 text-xs">
                Reference: Naranjo CA, et al. A method for estimating the probability of adverse drug reactions. Clin Pharmacol Ther. 1981;30:239-245.
            </p>
            <div className="text-slate-500 text-[10px] sm:text-xs mt-4 leading-relaxed">
              <p className="font-semibold text-slate-600 mb-1">
                [Version 20250225 - Stable Release]
              </p>
              <p>
                พัฒนาโดยเภสัชกรธนัฎชา สองเมือง หัวหน้างานเภสัชกรรมสารสนเทศ และงานเภสัชกรรมการผลิต
              </p>
              <p>
                กลุ่มงานเภสัชกรรม โรงพยาบาลวารินชำราบ จังหวัดอุบลราชธานี
              </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
