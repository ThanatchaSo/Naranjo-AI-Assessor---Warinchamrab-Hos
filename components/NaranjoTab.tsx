
import React, { useRef, useMemo, useState } from 'react';
import { Translation, PatientDetails, Question, AssessmentState, AnswerValue, Interpretation, AIConfig } from '../types';
import { QuestionItem } from './QuestionItem';
import { ResultsSection } from './ResultsSection';
import { QUESTIONS_BY_LANG, interpretScore } from '../constants';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface NaranjoTabProps {
  t: Translation;
  patientDetails: PatientDetails;
  language: any; // Using any for simplify import complex types
  aiConfig: AIConfig;
  onPatientChange: (p: PatientDetails) => void; // Keep sync if needed
}

export const NaranjoTab: React.FC<NaranjoTabProps> = ({ t, patientDetails, language, aiConfig }) => {
  const [answers, setAnswers] = useState<AssessmentState>({});
  const [drugName, setDrugName] = useState("");
  const [reaction, setReaction] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const questions = QUESTIONS_BY_LANG[language as keyof typeof QUESTIONS_BY_LANG] as Question[];

  const handleAnswer = (id: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
        {/* Current Adverse Event Section */}
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

        {/* Questionnaire */}
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
                    aiConfig={aiConfig} 
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
    </div>
  );
};
