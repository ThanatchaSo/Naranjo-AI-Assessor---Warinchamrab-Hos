
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { QuestionItem } from './components/QuestionItem';
import { ResultsSection } from './components/ResultsSection';
import { PatientForm } from './components/PatientForm';
import { SettingsModal } from './components/SettingsModal';
import { QUESTIONS_BY_LANG, interpretScore, TRANSLATIONS } from './constants';
import { AnswerValue, AssessmentState, Interpretation, Language, PatientDetails, AIConfig } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('th');
  const [answers, setAnswers] = useState<AssessmentState>({});
  const [drugName, setDrugName] = useState("");
  const [reaction, setReaction] = useState("");
  
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
  
  // Initialize patient details with default date
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    fullName: '',
    hn: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    pharmacistName: '',
    licenseNo: '',
    history: []
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  const questions = QUESTIONS_BY_LANG[language];

  const handleAnswer = (id: number, value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const calculateScore = useMemo(() => {
    let score = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === 'Yes') score += q.yesScore;
      else if (ans === 'No') score += q.noScore;
      else if (ans === 'DontKnow') score += q.dontKnowScore;
    });
    return score;
  }, [answers, questions]);

  const isComplete = Object.keys(answers).length === questions.length;

  const reportData = {
    drugName,
    reactionDescription: reaction,
    totalScore: calculateScore,
    interpretation: interpretScore(calculateScore) as Interpretation,
    answers: questions.map(q => {
      const ans = answers[q.id];
      let s = 0;
      if (ans === 'Yes') s = q.yesScore;
      else if (ans === 'No') s = q.noScore;
      else if (ans === 'DontKnow') s = q.dontKnowScore;
      return { questionId: q.id, answer: ans || null, score: s };
    }),
    language,
    patientDetails
  };

  const handleReset = () => {
    setAnswers({});
    setDrugName("");
    setReaction("");
    setPatientDetails({
        fullName: '',
        hn: '',
        unit: '',
        date: new Date().toISOString().split('T')[0],
        pharmacistName: '',
        licenseNo: '',
        history: []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Patient Info & History Section */}
        <PatientForm 
            t={t} 
            data={patientDetails} 
            onChange={setPatientDetails} 
        />

        {/* 2. Current Adverse Event Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
             <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded">2</span>
            <h2 className="text-lg font-bold text-slate-800">{t.headerCurrentEvent}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{t.drugLabel}</label>
              <input
                type="text"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                placeholder={t.drugPlaceholder}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{t.reactionLabel}</label>
              <input
                type="text"
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                placeholder={t.reactionPlaceholder}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* 3. Questionnaire */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">3</span>
                <h2 className="text-lg font-bold text-slate-800 px-1">{t.questionsHeader}</h2>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
              {Object.keys(answers).length} / 10 {t.answered}
            </span>
          </div>
          
          {questions.map((q) => (
            <QuestionItem
              key={q.id}
              question={q}
              currentAnswer={answers[q.id] || null}
              onAnswer={(id, val) => handleAnswer(id, val)}
              t={t}
            />
          ))}
        </section>

        {/* Action Bar */}
        <div className="flex justify-center pt-4 pb-8">
            {isComplete ? (
                 <button 
                 onClick={scrollToResults}
                 className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all transform hover:scale-105"
               >
                 {t.viewResults}
               </button>
            ) : (
                <div className="flex items-center gap-2 text-center text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium border border-amber-100">
                    <AlertCircle className="h-4 w-4" />
                    {t.completeAll}
                </div>
            )}
        </div>

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-24">
            {isComplete && (
                <ResultsSection 
                    totalScore={calculateScore} 
                    drugName={drugName} 
                    reaction={reaction}
                    reportData={reportData}
                    t={t}
                    aiConfig={aiConfig} // Pass config
                />
            )}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100"
            >
                <RefreshCw className="h-4 w-4" />
                {t.reset}
            </button>
        </div>

      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
            <p className="text-slate-400 text-xs">
                Reference: Naranjo CA, et al. A method for estimating the probability of adverse drug reactions. Clin Pharmacol Ther. 1981;30:239-245.
            </p>
            <div className="text-slate-500 text-[10px] sm:text-xs mt-4 leading-relaxed">
              <p className="font-semibold text-slate-600 mb-1">
                [Version 20250221 - Stable Release]
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
