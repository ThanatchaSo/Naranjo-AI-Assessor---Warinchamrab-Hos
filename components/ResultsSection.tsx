
import React, { useState, useRef } from 'react';
import { interpretScore, getColorForScore, QUESTIONS_BY_LANG } from '../constants';
import { ReportData, AIAnalysisResult, Interpretation, Translation } from '../types';
import { analyzeADR } from '../services/geminiService';
import { Sparkles, Loader2, AlertTriangle, FileText, ChevronRight, Printer, FileCheck } from 'lucide-react';
import { DrugAllergyCard } from './DrugAllergyCard';

interface ResultsSectionProps {
  totalScore: number;
  drugName: string;
  reaction: string;
  reportData: ReportData;
  t: Translation;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ totalScore, drugName, reaction, reportData, t }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  
  // Ref to capture the card HTML
  const cardRef = useRef<HTMLDivElement>(null);

  const interpretationKey = interpretScore(totalScore).toLowerCase() as keyof typeof t.interpretations;
  const interpretationLabel = t.interpretations[interpretationKey] || interpretScore(totalScore);
  const colorClass = getColorForScore(totalScore);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const baseInterpretation = interpretScore(totalScore) as Interpretation;
      const currentReport = { 
        ...reportData, 
        interpretation: baseInterpretation 
      };
      const result = await analyzeADR(currentReport);
      setAnalysis(result);
      setAnalyzed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
              /* Override the hidden class logic to make it visible in the popup */
              .printable-card-container {
                display: flex !important;
                visibility: visible !important;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                margin: auto;
              }
              /* Print specific overrides */
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
              // Small delay to ensure Tailwind loads before printing
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
    
    // Generate Questions Table Rows
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

    // Generate History Rows
    const historyHtml = reportData.patientDetails?.history && reportData.patientDetails.history.length > 0 
        ? reportData.patientDetails.history.map(h => `
            <tr class="border-b border-slate-100 text-xs">
                <td class="py-2 text-slate-800 font-semibold">${h.drugName}</td>
                <td class="py-2 text-slate-600">${h.symptoms}</td>
                <td class="py-2 text-slate-500">${h.reactionDate || '-'}</td>
            </tr>
          `).join('')
        : `<tr><td colspan="3" class="py-3 text-center text-xs text-slate-400 italic">${t.noHistoryAdded}</td></tr>`;

    // AI Analysis Section
    const aiSection = analysis ? `
        <div class="mb-6 break-inside-avoid">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 mb-3">
                AI Clinical Analysis
            </h2>
            <div class="bg-slate-50 p-4 rounded border border-slate-200 text-sm mb-4">
                <p class="font-bold text-slate-700 mb-1">Summary:</p>
                <p class="text-slate-600 mb-3 leading-relaxed">${analysis.analysis}</p>
                
                <p class="font-bold text-slate-700 mb-1">Risk Level:</p>
                <span class="inline-block px-2 py-0.5 rounded text-xs font-bold mb-3 ${
                    analysis.riskFactor === 'High' ? 'bg-red-100 text-red-700' :
                    analysis.riskFactor === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                }">${analysis.riskFactor}</span>

                <p class="font-bold text-slate-700 mb-1">Recommendations:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <p class="text-[10px] text-slate-400 italic">${t.disclaimer}</p>
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
            
            <!-- Header -->
            <div class="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div class="flex items-center gap-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYvahIeXlj40inpCDGCZxz6ytgMnT7fcHWOYlB3Y0EFDX3EBRI8s5EAXrhpD7CFajRPbU&usqp=CAU" 
                         class="h-16 w-16 rounded-full object-cover" />
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">Naranjo AI Assessor</h1>
                        <p class="text-sm text-slate-600">Warinchamrab Hospital</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500">Report Date</p>
                    <p class="font-bold text-slate-800">${new Date().toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            <!-- Patient Details -->
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

            <!-- Drug Allergy History -->
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

            <!-- Assessment Result -->
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

            <!-- Questionnaire Details -->
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

            <!-- AI Section -->
            ${aiSection}

            <!-- Signatures -->
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
      {/* Hidden Printable Card Wrapper */}
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

        {/* AI Action Area */}
        <div className="p-6 bg-gradient-to-b from-white to-slate-50">
          {!analyzed ? (
            <button
              onClick={handleAnalyze}
              disabled={loading || !drugName || !reaction}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group ${
                  !drugName || !reaction 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-lg hover:shadow-teal-200/50'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t.analyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{t.analyzeBtn}</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Analysis Header */}
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-teal-500" />
                      AI Clinical Insight
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      analysis?.riskFactor === 'High' ? 'bg-red-100 text-red-700' :
                      analysis?.riskFactor === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                      {t.riskLevel}: {analysis?.riskFactor ? t.riskFactors[analysis.riskFactor] : analysis?.riskFactor}
                  </span>
              </div>

              {/* Summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                      {analysis?.analysis}
                  </p>
              </div>

              {/* Recommendations */}
              <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {t.recommendations}
                  </h4>
                  <ul className="space-y-3">
                      {analysis?.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-100">
                              <ChevronRight className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                              <span className="text-slate-700 text-sm">{rec}</span>
                          </li>
                      ))}
                  </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                      {t.disclaimer}
                  </p>
              </div>

              <button 
                  onClick={() => setAnalyzed(false)}
                  className="w-full py-2 text-slate-400 hover:text-teal-600 text-sm font-medium transition-colors"
              >
                  {t.resetAnalysis}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
