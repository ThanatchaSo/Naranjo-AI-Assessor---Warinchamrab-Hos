import React from 'react';
import { PatientDetails, Translation, ReportData } from '../types';

interface DrugAllergyCardProps {
  patientDetails: PatientDetails;
  reportData: ReportData;
  t: Translation;
}

export const DrugAllergyCard: React.FC<DrugAllergyCardProps> = ({ patientDetails, reportData, t }) => {
  // Combine History items with Current Assessment (if valid)
  const cardItems = [
    ...patientDetails.history.map(h => ({
      drug: h.drugName,
      symptoms: h.symptoms,
      date: h.reactionDate || '-',
      result: t.cardHistoryLabel
    })),
    // Only add current assessment if it has content
    ...(reportData.drugName ? [{
      drug: reportData.drugName,
      symptoms: reportData.reactionDescription,
      date: patientDetails.date || '-',
      result: `${reportData.interpretation.split(' ')[0]}`
    }] : [])
  ];

  return (
    <div className="printable-card-container font-sans hidden print:flex items-center justify-center w-full h-full">
      {/* 
         Physical size for print: 8.5cm x 5.5cm
         We use inline styles for print dimensions to ensure accuracy.
      */}
      <div 
        className="bg-white border-2 border-blue-700 rounded-xl p-2 flex flex-col justify-between overflow-hidden relative"
        style={{ width: '8.5cm', height: '5.5cm' }}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-center border-b-2 border-blue-700 pb-1 mb-1 relative">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYvahIeXlj40inpCDGCZxz6ytgMnT7fcHWOYlB3Y0EFDX3EBRI8s5EAXrhpD7CFajRPbU&usqp=CAU"
                alt="Logo"
                className="h-6 w-6 rounded-full object-cover absolute left-1"
            />
            <h1 className="text-blue-800 font-bold text-sm leading-tight pl-4">{t.cardTitle}</h1>
        </div>

        {/* Patient Info */}
        <div className="flex flex-col text-[10px] text-slate-800 mb-1 font-semibold space-y-0.5 px-1">
          <div className="flex items-baseline">
             <span className="w-12 text-slate-600">{t.labelName}:</span>
             <span className="truncate flex-1">{patientDetails.fullName || '...................................'}</span>
          </div>
          <div className="flex items-baseline">
             <span className="w-12 text-slate-600">{t.labelHN}:</span>
             <span className="truncate flex-1">{patientDetails.hn || '...................................'}</span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-grow border border-blue-300 rounded overflow-hidden mb-1 relative">
          <table className="w-full text-[8px] table-fixed">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="w-[28%] p-0.5 text-left pl-1 font-bold border-r border-blue-200">{t.cardTableDrug}</th>
                <th className="w-[28%] p-0.5 text-left pl-1 font-bold border-r border-blue-200">{t.cardTableSymptom}</th>
                <th className="w-[22%] p-0.5 text-left pl-1 font-bold border-r border-blue-200">{t.cardTableDate}</th>
                <th className="w-[22%] p-0.5 text-left pl-1 font-bold">{t.cardTableResult}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {cardItems.slice(0, 5).map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="p-0.5 pl-1 truncate border-r border-slate-100 font-semibold text-blue-900">{item.drug}</td>
                  <td className="p-0.5 pl-1 truncate border-r border-slate-100">{item.symptoms}</td>
                  <td className="p-0.5 pl-1 truncate border-r border-slate-100 text-slate-600">{item.date}</td>
                  <td className="p-0.5 pl-1 truncate text-teal-700 font-medium">{item.result}</td>
                </tr>
              ))}
              {/* Empty rows filler to keep structure */}
              {[...Array(Math.max(0, 3 - cardItems.length))].map((_, i) => (
                 <tr key={`empty-${i}`} className="border-b border-slate-100 last:border-0 h-3">
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td></td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-[7px] text-slate-600 px-1 mt-auto">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
               <p><span className="font-bold text-blue-800">{t.labelUnit}:</span> {patientDetails.unit || '-'}</p>
               <p>
                 <span className="font-bold text-blue-800">{t.assessor}:</span> {patientDetails.pharmacistName} {patientDetails.licenseNo ? `(${patientDetails.licenseNo})` : ''}
               </p>
               <p><span className="font-bold text-blue-800">{t.labelDate}:</span> {patientDetails.date}</p>
            </div>
            <div className="text-right">
               <p className="text-red-600 font-bold">{t.cardFooterWarning}</p>
               <p className="text-red-500 italic font-medium">{t.cardFooterWarningEn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};