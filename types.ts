
export enum Interpretation {
  DEFINITE = "Definite",
  PROBABLE = "Probable",
  POSSIBLE = "Possible",
  DOUBTFUL = "Doubtful",
}

export interface Question {
  id: number;
  text: string;
  yesScore: number;
  noScore: number;
  dontKnowScore: number;
}

export type AnswerValue = 'Yes' | 'No' | 'DontKnow' | null;

export interface AssessmentState {
  [key: number]: AnswerValue;
}

export interface HistoryItem {
  id: string;
  drugName: string;
  symptoms: string;
  reactionDate?: string;
}

export interface PatientDetails {
  fullName: string;
  hn: string;
  unit: string;
  date: string;
  pharmacistName: string;
  licenseNo: string;
  history: HistoryItem[];
}

export interface ReportData {
  drugName: string;
  reactionDescription: string;
  totalScore: number;
  interpretation: Interpretation;
  answers: { questionId: number; answer: AnswerValue; score: number }[];
  language: Language;
  patientDetails?: PatientDetails;
}

export interface AIAnalysisResult {
  analysis: string;
  recommendations: string[];
  riskFactor: 'Low' | 'Medium' | 'High' | 'Unknown';
}

export type Language = 'th' | 'en' | 'lo' | 'my';

export interface Translation {
  title: string;
  subtitle: string;
  role: string;
  // Tabs
  tabTimeline: string;
  tabNaranjo: string;
  // Section 1: Patient & Pharmacist
  headerPatient: string;
  labelName: string;
  labelHN: string;
  labelUnit: string;
  labelDate: string;
  labelPharmacist: string;
  labelLicense: string;
  // Section 2: History
  headerHistory: string;
  subHistory: string;
  labelHistoryDrug: string;
  labelHistorySymptoms: string;
  labelHistoryDate: string;
  btnAdd: string;
  noHistoryAdded: string;
  // Section 3: Current Event
  headerCurrentEvent: string;
  drugLabel: string;
  drugPlaceholder: string;
  reactionLabel: string;
  reactionPlaceholder: string;
  // Assessment
  questionsHeader: string;
  answered: string;
  viewResults: string;
  completeAll: string;
  scoreTitle: string;
  classification: string;
  analyzeBtn: string;
  analyzing: string;
  aiError: string;
  drug: string;
  event: string;
  riskLevel: string;
  recommendations: string;
  disclaimer: string;
  reset: string;
  yes: string;
  no: string;
  dontKnow: string;
  interpretations: {
    definite: string;
    probable: string;
    possible: string;
    doubtful: string;
  };
  riskFactors: {
    Low: string;
    Medium: string;
    High: string;
    Unknown: string;
  };
  // Card
  cardTitle: string;
  cardTableDrug: string;
  cardTableSymptom: string;
  cardTableDate: string;
  cardTableResult: string;
  cardHistoryLabel: string;
  cardFooterWarning: string;
  cardFooterWarningEn: string;
  printCardBtn: string;
  printReportBtn: string;
  assessor: string;
  guidelineBtn: string;
  // Timeline
  timelineTitle: string;
  addDrugExposure: string;
  labelTimelineReaction: string;
  addSoapNote: string;
  startTime: string;
  endTime: string;
  soapS: string;
  soapO: string;
  soapA: string;
  soapP: string;
  addNote: string;
  visualization: string;
}

export interface AIConfig {
  provider: 'gemini' | 'ollama';
  apiKey?: string; // For Gemini
  modelName: string; // 'medgemma', 'llama3', or 'gemini-2.5-flash'
  ollamaUrl?: string; // e.g., 'http://localhost:11434'
}

// Timeline Specific Types
export interface TimelineDrug {
  id: string;
  name: string;
  startDate: string; // ISO DateTime string
  endDate: string;   // ISO DateTime string
}

export interface SoapNote {
  id: string;
  timestamp: string; // ISO DateTime string
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}
