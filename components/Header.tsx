
import React from 'react';
import { Pill, BookOpen } from 'lucide-react';
import { Language, Translation } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'en', label: 'ENG', flag: '🇬🇧' },
    { code: 'lo', label: 'ລາວ', flag: '🇱🇦' },
    { code: 'my', label: 'ဗမာ', flag: '🇲🇲' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYvahIeXlj40inpCDGCZxz6ytgMnT7fcHWOYlB3Y0EFDX3EBRI8s5EAXrhpD7CFajRPbU&usqp=CAU"
            alt="Warinchamrab Hospital Logo"
            className="h-12 w-12 rounded-full shadow-md object-cover border border-slate-100"
          />
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight truncate">{t.title}</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            <Pill className="h-4 w-4" />
            <span>{t.role}</span>
          </div>

          <a
            href="https://heyzine.com/flip-book/3b0913bf57.html#page/82"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#556b2f] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#3e4e22] transition-colors shadow-sm"
            title="คู่มือ/แนวทางปฏิบัติ"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t.guidelineBtn}</span>
            <span className="sm:hidden">ADR</span>
          </a>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  lang === l.code
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title={l.label}
              >
                <span className="sm:hidden">{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};