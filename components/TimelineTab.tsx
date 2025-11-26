
import React, { useState, useMemo } from 'react';
import { Translation, TimelineDrug, SoapNote } from '../types';
import { Plus, Trash2, Calendar, FileText, Activity, Clock, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface TimelineTabProps {
  t: Translation;
}

const DRUG_COLORS = [
  { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
  { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
  { bg: 'bg-violet-100', border: 'border-violet-400', text: 'text-violet-800' },
  { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
  { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-800' },
  { bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-800' },
  { bg: 'bg-fuchsia-100', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
  { bg: 'bg-lime-100', border: 'border-lime-400', text: 'text-lime-800' },
];

const NOTE_COLORS = [
  { dot: 'bg-amber-400', box: 'bg-amber-50', border: 'border-amber-200' },
  { dot: 'bg-blue-400', box: 'bg-blue-50', border: 'border-blue-200' },
  { dot: 'bg-emerald-400', box: 'bg-emerald-50', border: 'border-emerald-200' },
  { dot: 'bg-purple-400', box: 'bg-purple-50', border: 'border-purple-200' },
  { dot: 'bg-rose-400', box: 'bg-rose-50', border: 'border-rose-200' },
  { dot: 'bg-cyan-400', box: 'bg-cyan-50', border: 'border-cyan-200' },
];

export const TimelineTab: React.FC<TimelineTabProps> = ({ t }) => {
  // --- State ---
  const [drugs, setDrugs] = useState<TimelineDrug[]>([]);
  const [notes, setNotes] = useState<SoapNote[]>([]);
  
  // Forms
  const [drugForm, setDrugForm] = useState({ name: '', start: '', end: '', reaction: '' });
  const [soapForm, setSoapForm] = useState({ s: '', o: '', a: '', p: '', time: '' });
  
  // Handlers
  const addDrug = () => {
    if (drugForm.name && drugForm.start) {
      // Concatenate reaction if it exists
      const displayName = drugForm.reaction 
        ? `${drugForm.name} (${drugForm.reaction})` 
        : drugForm.name;

      setDrugs([...drugs, { 
        id: Date.now().toString(), 
        name: displayName, 
        startDate: drugForm.start, 
        endDate: drugForm.end || drugForm.start 
      }]);
      setDrugForm({ name: '', start: '', end: '', reaction: '' });
    }
  };

  const addNote = () => {
    if (soapForm.time) {
      setNotes([...notes, {
        id: Date.now().toString(),
        timestamp: soapForm.time,
        subjective: soapForm.s,
        objective: soapForm.o,
        assessment: soapForm.a,
        plan: soapForm.p
      }]);
      setSoapForm({ s: '', o: '', a: '', p: '', time: '' });
    }
  };

  const removeDrug = (id: string) => setDrugs(drugs.filter(d => d.id !== id));
  const removeNote = (id: string) => setNotes(notes.filter(n => n.id !== id));

  // --- Visualization Logic ---
  const timelineData = useMemo(() => {
    if (drugs.length === 0 && notes.length === 0) return null;

    // 1. Find Min/Max Dates
    const allDates = [
      ...drugs.map(d => new Date(d.startDate).getTime()),
      ...drugs.map(d => new Date(d.endDate).getTime()),
      ...notes.map(n => new Date(n.timestamp).getTime())
    ].filter(d => !isNaN(d));

    if (allDates.length === 0) return null;

    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    
    // Add buffer (12 hours before and after)
    const buffer = 12 * 60 * 60 * 1000; 
    const timelineStart = minDate - buffer;
    const timelineEnd = maxDate + buffer;
    const totalDuration = timelineEnd - timelineStart;

    return { timelineStart, timelineEnd, totalDuration };
  }, [drugs, notes]);

  const getLeftPos = (dateStr: string) => {
    if (!timelineData) return 0;
    const time = new Date(dateStr).getTime();
    return ((time - timelineData.timelineStart) / timelineData.totalDuration) * 100;
  };

  const getWidth = (startStr: string, endStr: string) => {
    if (!timelineData) return 0;
    const s = new Date(startStr).getTime();
    const e = new Date(endStr).getTime();
    const duration = Math.max(e - s, 1000 * 60 * 60); // Min 1 hour width
    return (duration / timelineData.totalDuration) * 100;
  };

  const printTimeline = () => {
     window.print();
  };

  // Helper to format date label
  const formatDateLabel = (ts: number) => {
    const d = new Date(ts);
    return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:00`;
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">{t.timelineTitle}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        {/* Drug Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-slate-700">{t.addDrugExposure}</h3>
            </div>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder={t.drugPlaceholder} 
                    value={drugForm.name}
                    onChange={e => setDrugForm({...drugForm, name: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />
                
                {/* Adverse Reaction Input (Added per request) */}
                <input 
                    type="text" 
                    placeholder={t.labelTimelineReaction} 
                    value={drugForm.reaction}
                    onChange={e => setDrugForm({...drugForm, reaction: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">{t.startTime}</label>
                        <input 
                            type="datetime-local" 
                            value={drugForm.start}
                            onChange={e => setDrugForm({...drugForm, start: e.target.value})}
                            className="w-full p-2 border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                         <label className="text-xs font-bold text-slate-500">{t.endTime}</label>
                         <input 
                            type="datetime-local" 
                            value={drugForm.end}
                            onChange={e => setDrugForm({...drugForm, end: e.target.value})}
                            className="w-full p-2 border rounded-lg text-sm"
                        />
                    </div>
                </div>
                <button 
                    onClick={addDrug}
                    className="w-full py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors"
                >
                    {t.timelineTitle} (Add Drug to Timeline)
                </button>
            </div>
        </div>

        {/* SOAP Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
             <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-slate-700">{t.addSoapNote}</h3>
            </div>
            <div className="space-y-3">
                <input 
                    type="datetime-local" 
                    value={soapForm.time}
                    onChange={e => setSoapForm({...soapForm, time: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm bg-amber-50/50"
                />
                <div className="grid grid-cols-2 gap-2">
                    <textarea placeholder={t.soapS} value={soapForm.s} onChange={e => setSoapForm({...soapForm, s: e.target.value})} className="p-2 border rounded text-xs h-16 resize-none" />
                    <textarea placeholder={t.soapO} value={soapForm.o} onChange={e => setSoapForm({...soapForm, o: e.target.value})} className="p-2 border rounded text-xs h-16 resize-none" />
                    <textarea placeholder={t.soapA} value={soapForm.a} onChange={e => setSoapForm({...soapForm, a: e.target.value})} className="p-2 border rounded text-xs h-16 resize-none" />
                    <textarea placeholder={t.soapP} value={soapForm.p} onChange={e => setSoapForm({...soapForm, p: e.target.value})} className="p-2 border rounded text-xs h-16 resize-none" />
                </div>
                <button 
                    onClick={addNote}
                    className="w-full py-2 bg-amber-100 text-amber-700 font-bold rounded-lg hover:bg-amber-200 transition-colors"
                >
                    {t.addNote}
                </button>
            </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-800">{t.visualization}</h3>
             <div className="flex gap-2">
                 <ZoomIn className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                 <ZoomOut className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                 <Printer onClick={printTimeline} className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600 ml-2" />
                 <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 ml-1" onClick={printTimeline}>Print</span>
             </div>
        </div>
        
        {timelineData ? (
            <div className="relative w-full overflow-x-auto pb-4">
                <div className="min-w-[800px] relative h-96 border-l border-b border-slate-300">
                    
                    {/* Time Grid Lines (Simplified: 5 vertical lines) */}
                    {[0, 25, 50, 75, 100].map(pct => (
                        <div key={pct} className="absolute top-0 bottom-0 border-r border-dashed border-slate-200 text-[10px] text-slate-400 pt-2 pl-1" style={{ left: `${pct}%` }}>
                             {formatDateLabel(timelineData.timelineStart + (timelineData.totalDuration * (pct/100)))}
                        </div>
                    ))}
                    
                    {/* Current Time Indicator */}
                    <div className="absolute top-0 bottom-0 border-r-2 border-red-400 opacity-50 z-10" style={{ left: `${getLeftPos(new Date().toISOString())}%` }}></div>

                    {/* Drugs Rows */}
                    <div className="absolute top-8 left-0 right-0 space-y-2 px-2">
                         <div className="font-bold text-xs text-slate-500 mb-2">Drugs</div>
                         {drugs.map((drug, index) => {
                             const style = DRUG_COLORS[index % DRUG_COLORS.length];
                             return (
                                 <div key={drug.id} className="relative h-10 group">
                                     {/* Bar */}
                                     <div 
                                        className={`absolute h-8 ${style.bg} border ${style.border} rounded-md flex items-center px-2 text-xs font-bold ${style.text} overflow-hidden whitespace-nowrap shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                        style={{ left: `${getLeftPos(drug.startDate)}%`, width: `${getWidth(drug.startDate, drug.endDate)}%` }}
                                     >
                                         {drug.name}
                                     </div>
                                     <Trash2 
                                        onClick={() => removeDrug(drug.id)}
                                        className="absolute -right-6 top-2 h-4 w-4 text-slate-300 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                                     />
                                 </div>
                             );
                         })}
                    </div>

                    {/* SOAP Notes Rows */}
                    <div className="absolute bottom-8 left-0 right-0 h-32 px-2 border-t border-slate-100 pt-2">
                        <div className="font-bold text-xs text-slate-500 mb-2">Notes/Events</div>
                        {notes.map((note, idx) => {
                             const style = NOTE_COLORS[idx % NOTE_COLORS.length];
                             return (
                                 <div 
                                    key={note.id}
                                    className="absolute flex flex-col items-center group z-20"
                                    style={{ left: `${getLeftPos(note.timestamp)}%`, top: `${(idx % 3) * 40}px` }} 
                                 >
                                     <div className={`w-3 h-3 rounded-full ${style.dot} border border-white shadow-sm hover:scale-125 transition-transform cursor-pointer`}></div>
                                     <div className={`mt-1 ${style.box} border ${style.border} p-1.5 rounded text-[10px] whitespace-nowrap shadow-sm opacity-80 hover:opacity-100 hover:z-30`}>
                                         <span className="font-bold block">{note.timestamp.split('T')[1]}</span>
                                         {note.subjective && <span className="block max-w-[150px] truncate text-slate-600">S: {note.subjective}</span>}
                                         {note.assessment && <span className="block max-w-[150px] truncate text-slate-600">A: {note.assessment}</span>}
                                         <button onClick={() => removeNote(note.id)} className="text-red-400 hover:underline mt-1 hidden group-hover:inline-block">del</button>
                                     </div>
                                     {/* Vertical Line to axis */}
                                     <div className={`absolute bottom-[-100px] w-px h-[100px] ${style.dot} opacity-20 pointer-events-none`}></div>
                                 </div>
                             );
                        })}
                    </div>

                </div>
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Start adding drugs or notes to visualize the timeline
            </div>
        )}
      </div>
    </div>
  );
};
