
import React, { useRef, useState } from 'react';
import { interpretScore, getColorForScore, QUESTIONS_BY_LANG } from '../constants';
import { ReportData, Translation, AIAnalysisResult, AIConfig } from '../types';
import { Printer, FileCheck, BrainCircuit, Sparkles, AlertTriangle, Stethoscope, AlertCircle } from 'lucide-react';
import { DrugAllergyCard } from './DrugAllergyCard';
import { analyzeADR } from '../services/geminiService';

interface ResultsSectionProps {
  totalScore: number;
  drugName: string;
  reaction: string;
  reportData: ReportData;
  t: Translation;
  aiConfig: AIConfig;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ totalScore, drugName, reaction, reportData, t, aiConfig }) => {
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const interpretationKey = interpretScore(totalScore).toLowerCase() as keyof typeof t.interpretations;
  const interpretationLabel = t.interpretations[interpretationKey] || interpretScore(totalScore);
  const colorClass = getColorForScore(totalScore);

  const handleAnalyzeAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
        // Pass the config to the service
        const result = await analyzeADR(reportData, aiConfig);
        setAiResult(result);
    } catch (error: any) {
        console.error(error);
        setAiError(error.message || "AI Analysis Failed");
    } finally {
        setIsLoadingAI(false);
    }
  };

  const handlePrintCard = () => {
    if (!cardRef.current) return;

    const cardContent = cardRef.current.innerHTML;
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${t.cardTitle}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
                background-color: #f8fafc;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
              }
              .printable-card-container {
                display: flex !important;
                visibility: visible !important;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                margin: auto;
              }
              @media print {
                body {
                  background-color: white;
                  display: block;
                }
                .printable-card-container {
                  box-shadow: none;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  margin: 0;
                }
                @page {
                  size: auto;
                  margin: 0mm;
                }
              }
            </style>
          </head>
          <body>
            ${cardContent}
            <script>
              setTimeout(() => {
                window.print();
              }, 1000);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const questions = QUESTIONS_BY_LANG[reportData.language];
    
    const questionsHtml = reportData.answers.map((ans, idx) => {
        const qText = questions[idx].text;
        return `
        <tr class="border-b border-slate-200 text-xs">
            <td class="py-2 pr-2 text-slate-600">${idx + 1}. ${qText}</td>
            <td class="py-2 px-2 text-center font-medium">${ans.answer || '-'}</td>
            <td class="py-2 pl-2 text-center font-bold text-slate-800">${ans.score}</td>
        </tr>
        `;
    }).join('');

    const historyHtml = reportData.patientDetails?.history && reportData.patientDetails.history.length > 0 
        ? reportData.patientDetails.history.map(h => `
            <tr class="border-b border-slate-100 text-xs">
                <td class="py-2 text-slate-800 font-semibold">${h.drugName}</td>
                <td class="py-2 text-slate-600">${h.symptoms}</td>
                <td class="py-2 text-slate-500">${h.reactionDate || '-'}</td>
            </tr>
          `).join('')
        : `<tr><td colspan="3" class="py-3 text-center text-xs text-slate-400 italic">${t.noHistoryAdded}</td></tr>`;

    const aiSectionHtml = aiResult ? `
        <div class="mb-6 bg-teal-50 border border-teal-100 rounded-lg p-4 break-inside-avoid">
            <h3 class="font-bold text-teal-800 border-b border-teal-200 pb-1 mb-2">AI Clinical Analysis</h3>
            <p class="text-sm text-slate-700 mb-3">${aiResult.analysis}</p>
            <div class="mb-2">
                <span class="font-bold text-xs uppercase text-teal-700">Risk Level:</span> 
                <span class="text-sm font-bold text-slate-900">${aiResult.riskFactor}</span>
            </div>
            <div class="text-sm text-slate-700 font-bold mb-1">Recommendations:</div>
            <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
               ${aiResult.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <p class="text-[10px] text-slate-400 mt-3 italic">Powered by ${aiConfig.provider === 'ollama' ? 'Local AI ('+aiConfig.modelName+')' : 'Google Gemini'}</p>
        </div>
    ` : '';

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Naranjo Assessment Report</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: white; }
                @page { size: A4; margin: 20mm; }
                @media print {
                    body { -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body class="p-8 max-w-[210mm] mx-auto">
            
            <div class="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div class="flex items-center gap-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYvahIeXlj40inpCDGCZxz6ytgMnT7fcHWOYlB3Y0EFDX3EBRI8s5EAXrhpD7CFajRPbU&usqp=CAU" 
                         class="h-16 w-16 rounded-full object-cover" />
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">Naranjo Assessor</h1>
                        <p class="text-sm text-slate-600">Warinchamrab Hospital</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500">Report Date</p>
                    <p class="font-bold text-slate-800">${new Date().toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6 text-sm">
                <div>
                    <h3 class="font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">Patient Information</h3>
                    <table class="w-full">
                        <tr><td class="py-1 text-slate-500 w-24">Name:</td><td class="font-medium">${reportData.patientDetails?.fullName || '-'}</td></tr>
                        <tr><td class="py-1 text-slate-500">HN:</td><td class="font-medium">${reportData.patientDetails?.hn || '-'}</td></tr>
                        <tr><td class="py-1 text-slate-500">Unit:</td><td class="font-medium">${reportData.patientDetails?.unit || '-'}</td></tr>
                    </table>
                </div>
                <div>
                    <h3 class="font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">Assessor Information</h3>
                    <table class="w-full">
                        <tr><td class="py-1 text-slate-500 w-24">Pharmacist:</td><td class="font-medium">${reportData.patientDetails?.pharmacistName || '-'}</td></tr>
                        <tr><td class="py-1 text-slate-500">License No:</td><td class="font-medium">${reportData.patientDetails?.licenseNo || '-'}</td></tr>
                        <tr><td class="py-1 text-slate-500">Date:</td><td class="font-medium">${reportData.patientDetails?.date || '-'}</td></tr>
                    </table>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">History of Drug Allergy</h3>
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-xs text-slate-500 border-b border-slate-200">
                            <th class="py-1 font-normal w-1/3">Drug Name</th>
                            <th class="py-1 font-normal w-1/3">Symptoms</th>
                            <th class="py-1 font-normal w-1/3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${historyHtml}
                    </tbody>
                </table>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Suspected Drug</p>
                    <p class="text-lg font-bold text-slate-900">${drugName || '-'}</p>
                    <p class="text-sm text-slate-600 mt-1">Event: ${reaction || '-'}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Naranjo Score</p>
                    <div class="flex items-baseline justify-end gap-2">
                        <span class="text-3xl font-bold text-slate-900">${totalScore}</span>
                        <span class="text-sm font-bold px-2 py-1 rounded bg-white border border-slate-200 shadow-sm">
                            ${interpretationLabel}
                        </span>
                    </div>
                </div>
            </div>
            
            ${aiSectionHtml}

            <div class="mb-8">
                <h3 class="font-bold text-slate-700 border-b border-slate-200 pb-1 mb-3">Assessment Details</h3>
                <table class="w-full">
                    <thead>
                        <tr class="text-xs text-slate-500 border-b border-slate-300">
                            <th class="py-2 text-left w-3/4">Question</th>
                            <th class="py-2 text-center w-24">Answer</th>
                            <th class="py-2 text-center w-16">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${questionsHtml}
                    </tbody>
                </table>
            </div>

            <div class="mt-12 grid grid-cols-2 gap-12 break-inside-avoid">
                <div class="text-center">
                    <div class="border-b border-slate-300 h-12 mb-2"></div>
                    <p class="text-sm font-medium text-slate-800">(${reportData.patientDetails?.pharmacistName || '................................................'})</p>
                    <p class="text-xs text-slate-500">Pharmacist</p>
                </div>
                <div class="text-center">
                     <div class="border-b border-slate-300 h-12 mb-2"></div>
                    <p class="text-sm font-medium text-slate-800">................................................</p>
                    <p class="text-xs text-slate-500">Physician / Reviewer</p>
                </div>
            </div>

            <script>
                setTimeout(() => {
                    window.print();
                }, 1000);
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="hidden" ref={cardRef}>
        <DrugAllergyCard patientDetails={reportData.patientDetails!} reportData={reportData} t={t} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            <div className="text-center sm:text-left">
              <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{t.scoreTitle}</h2>
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-5xl font-bold text-slate-900">{totalScore}</span>
                <span className="text-slate-400 text-sm font-medium">/ 13 max</span>
              </div>
            </div>

            <div className={`px-6 py-3 rounded-xl border-2 flex flex-col items-center justify-center ${colorClass} min-w-[200px]`}>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{t.classification}</span>
              <span className="text-lg sm:text-xl font-bold text-center">{interpretationLabel}</span>
            </div>

          </div>
        </div>
        
        {/* AI Section */}
        <div className="bg-indigo-50 px-6 py-5 border-b border-indigo-100">
          {!aiResult ? (
              <div className="flex justify-center">
                  <button 
                    onClick={handleAnalyzeAI} 
                    disabled={isLoadingAI}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 disabled:opacity-70"
                  >
                      {isLoadingAI ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {t.analyzing}</>
                      ) : (
                          <><BrainCircuit className="h-4 w-4" /> {t.analyzeBtn}</>
                      )}
                  </button>
              </div>
          ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg"><Stethoscope className="h-5 w-5 text-indigo-600" /></div>
                      <div className="flex-1">
                          <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wide mb-1">AI Clinical Analysis</h4>
                          <p className="text-slate-700 text-sm leading-relaxed">{aiResult.analysis}</p>
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                        <div className={`flex-1 p-3 rounded-lg border ${
                            aiResult.riskFactor === 'High' ? 'bg-red-50 border-red-200' : 
                            aiResult.riskFactor === 'Medium' ? 'bg-orange-50 border-orange-200' : 
                            'bg-green-50 border-green-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className={`h-4 w-4 ${
                                    aiResult.riskFactor === 'High' ? 'text-red-600' : 
                                    aiResult.riskFactor === 'Medium' ? 'text-orange-600' : 
                                    'text-green-600'
                                }`} />
                                <span className="text-xs font-bold uppercase text-slate-500">{t.riskLevel}</span>
                            </div>
                            <p className="font-bold text-slate-800 pl-6">{t.riskFactors[aiResult.riskFactor] || aiResult.riskFactor}</p>
                        </div>

                        <div className="flex-[2] bg-white p-3 rounded-lg border border-indigo-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-bold uppercase text-slate-500">{t.recommendations}</span>
                            </div>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-1">
                                {aiResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 text-center italic">
                    {t.disclaimer} 
                    <span className="ml-2 text-indigo-400 opacity-50">({aiConfig.provider === 'ollama' ? aiConfig.modelName : 'Gemini'})</span>
                  </p>
              </div>
          )}
          
          {aiError && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {aiError}
              </div>
          )}
        </div>

        {/* Context Summary */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 text-sm text-slate-600 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{t.drug}:</span> {drugName || "-"}
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{t.event}:</span> {reaction || "-"}
            </div>
          </div>

          {/* Print Buttons */}
          <div className="flex gap-2">
            <button 
                onClick={handlePrintCard}
                className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
            >
                <Printer className="h-4 w-4" />
                {t.printCardBtn}
            </button>
            <button 
                onClick={handlePrintReport}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <FileCheck className="h-4 w-4" />
                {t.printReportBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
