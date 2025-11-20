import React, { useState } from 'react';
import { PatientDetails, Translation } from '../types';
import {
  User,
  FileDigit,
  Building2,
  CalendarDays,
  UserCog,
  IdCard,
  Plus,
  Trash2,
  History,
  Pill,
  AlertCircle
} from 'lucide-react';

interface PatientFormProps {
  t: Translation;
  data: PatientDetails;
  onChange: (data: PatientDetails) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ t, data, onChange }) => {
  const [newDrug, setNewDrug] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleInputChange = (field: keyof PatientDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addHistoryItem = () => {
    if (newDrug.trim() && newSymptom.trim()) {
      const newItem = {
        id: Date.now().toString(),
        drugName: newDrug.trim(),
        symptoms: newSymptom.trim(),
        reactionDate: newDate || undefined
      };
      onChange({
        ...data,
        history: [...data.history, newItem]
      });
      setNewDrug('');
      setNewSymptom('');
      setNewDate('');
    }
  };

  const removeHistoryItem = (id: string) => {
    onChange({
      ...data,
      history: data.history.filter(item => item.id !== id)
    });
  };

  // Reusable modern input component
  const ModernInput = ({
    label,
    value,
    field,
    icon: Icon,
    type = "text",
    placeholder,
    colorClass = "blue"
  }: {
    label: string;
    value: string;
    field?: keyof PatientDetails;
    icon: any;
    type?: string;
    placeholder?: string;
    colorClass?: "blue" | "amber";
  }) => {
    // Dynamic styling based on color theme
    const focusRing = colorClass === "amber" ? "focus:ring-amber-500/10" : "focus:ring-blue-500/10";
    const focusBorder = colorClass === "amber" ? "focus:border-amber-500" : "focus:border-blue-500";
    const focusText = colorClass === "amber" ? "group-focus-within:text-amber-600" : "group-focus-within:text-blue-600";
    const iconColor = colorClass === "amber" ? "group-focus-within:text-amber-500" : "group-focus-within:text-blue-500";

    return (
      <div className="space-y-1.5 group">
        <label className={`block text-xs font-bold uppercase tracking-wide text-slate-500 ml-1 transition-colors ${focusText}`}>
          {label}
        </label>
        <div className="relative transition-all duration-200 transform group-focus-within:-translate-y-0.5">
          <div className={`absolute left-3 top-3.5 text-slate-400 transition-colors ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <input
            type={type}
            value={value}
            onChange={(e) => field ? handleInputChange(field, e.target.value) : undefined}
            className={`w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-white ${focusBorder} focus:ring-4 ${focusRing} outline-none transition-all duration-200 font-medium text-slate-700 placeholder:text-slate-300 shadow-sm`}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Section 1: Patient Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-blue-200 shadow-lg">
            <span className="font-bold text-sm">1</span>
          </div>
          <h3 className="font-bold text-slate-800 text-lg tracking-tight">{t.headerPatient}</h3>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ModernInput 
                label={t.labelName} 
                value={data.fullName} 
                field="fullName" 
                icon={User} 
                placeholder="..."
             />
             <ModernInput 
                label={t.labelHN} 
                value={data.hn} 
                field="hn" 
                icon={FileDigit} 
                placeholder="..."
             />
             <ModernInput 
                label={t.labelUnit} 
                value={data.unit} 
                field="unit" 
                icon={Building2} 
                placeholder="..."
             />
             <ModernInput 
                label={t.labelDate} 
                value={data.date} 
                field="date" 
                icon={CalendarDays} 
                type="date"
             />
          </div>

          {/* Divider with Label */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.role}
              </span>
            </div>
          </div>

          {/* Pharmacist Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ModernInput 
                label={t.labelPharmacist} 
                value={data.pharmacistName} 
                field="pharmacistName" 
                icon={UserCog} 
                placeholder="..."
             />
             <ModernInput 
                label={t.labelLicense} 
                value={data.licenseNo} 
                field="licenseNo" 
                icon={IdCard} 
                placeholder="ภ.xxxxx"
             />
          </div>
        </div>
      </div>

      {/* Section 2: History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/30 to-transparent">
            <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                    <History className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{t.headerHistory}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.subHistory}</p>
                </div>
            </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
             {/* Add Item Form */}
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                        <div className="relative group">
                            <Pill className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                                type="text"
                                value={newDrug}
                                onChange={(e) => setNewDrug(e.target.value)}
                                placeholder={t.labelHistoryDrug}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-5">
                         <div className="relative group">
                            <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                                type="text"
                                value={newSymptom}
                                onChange={(e) => setNewSymptom(e.target.value)}
                                placeholder={t.labelHistorySymptoms}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <input 
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-center text-slate-600"
                        />
                    </div>
                </div>
                <button 
                    onClick={addHistoryItem}
                    disabled={!newDrug.trim() || !newSymptom.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-bold text-sm shadow-sm hover:shadow-amber-200 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    {t.btnAdd}
                </button>
             </div>

             {/* History List */}
             <div className="space-y-2">
                {data.history.length > 0 ? (
                    data.history.map((item) => (
                        <div key={item.id} className="group/item flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs group-hover/item:bg-amber-100 group-hover/item:text-amber-700 transition-colors">H</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{item.drugName}</span>
                                        {item.reactionDate && (
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                                {item.reactionDate}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{item.symptoms}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeHistoryItem(item.id)}
                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover/item:opacity-100"
                                title="Remove"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                        <History className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm font-medium opacity-60">{t.noHistoryAdded}</p>
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};
