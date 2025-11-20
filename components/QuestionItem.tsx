import React from 'react';
import { Question, AnswerValue, Translation } from '../types';
import { Check, X, HelpCircle } from 'lucide-react';

interface QuestionItemProps {
  question: Question;
  currentAnswer: AnswerValue;
  onAnswer: (id: number, value: AnswerValue, score: number) => void;
  t: Translation;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, currentAnswer, onAnswer, t }) => {
  const baseButtonClass = "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 w-full sm:w-24 space-y-1";
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex-1">
            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded mb-2">
                Question {question.id}
            </span>
          <h3 className="text-md font-medium text-slate-800 leading-relaxed">{question.text}</h3>
        </div>
        
        <div className="flex gap-2 sm:gap-3 shrink-0 mt-2 sm:mt-0">
          {/* Yes Button */}
          <button
            onClick={() => onAnswer(question.id, 'Yes', question.yesScore)}
            className={`${baseButtonClass} ${
              currentAnswer === 'Yes'
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-slate-100 text-slate-400 hover:border-teal-200 hover:bg-slate-50'
            }`}
          >
            <Check className="h-5 w-5" />
            <span className="text-xs font-semibold">{t.yes} ({question.yesScore > 0 ? `+${question.yesScore}` : question.yesScore})</span>
          </button>

          {/* No Button */}
          <button
            onClick={() => onAnswer(question.id, 'No', question.noScore)}
            className={`${baseButtonClass} ${
              currentAnswer === 'No'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-100 text-slate-400 hover:border-red-200 hover:bg-slate-50'
            }`}
          >
            <X className="h-5 w-5" />
            <span className="text-xs font-semibold">{t.no} ({question.noScore > 0 ? `+${question.noScore}` : question.noScore})</span>
          </button>

          {/* Don't Know Button */}
          <button
            onClick={() => onAnswer(question.id, 'DontKnow', question.dontKnowScore)}
            className={`${baseButtonClass} ${
              currentAnswer === 'DontKnow'
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="text-xs font-semibold">{t.dontKnow} ({question.dontKnowScore})</span>
          </button>
        </div>
      </div>
    </div>
  );
};