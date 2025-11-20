# Naranjo AI Assessor - Warinchamrab Hospital

A professional clinical tool designed for pharmacists and healthcare providers to assess the probability of Adverse Drug Reactions (ADR) using the standard Naranjo Algorithm, enhanced with AI-driven clinical insights.

## 🏥 Project Overview

This application digitizes the Naranjo Adverse Drug Reaction Probability Scale, allowing for quick, accurate, and standardized assessment of suspected drug allergies. It integrates **Google Gemini AI** to provide deeper clinical analysis, risk stratification, and actionable recommendations based on the assessment data.

Developed for **Warinchamrab Hospital**, Ubon Ratchathani.

## ✨ Key Features

*   **Interactive Naranjo Assessment**:
    *   Digital questionnaire with automatic scoring.
    *   Real-time interpretation (Definite, Probable, Possible, Doubtful).
    *   Visual score indicators.

*   **🤖 AI-Powered Clinical Analysis**:
    *   Utilizes **Google Gemini 2.5 Flash** model.
    *   Generates professional clinical summaries.
    *   Provides specific management recommendations.
    *   Assesses Risk Level (Low/Medium/High).

*   **Patient & History Management**:
    *   Comprehensive patient demographics form.
    *   Pharmacist/Assessor details.
    *   **Drug Allergy History**: Track previous allergic reactions (Drug name, Symptoms, Date).

*   **🖨️ Reporting & Export**:
    *   **Drug Allergy Card**: Generates a printable, wallet-sized card (8.5cm x 5.5cm).
    *   **Full A4 Report**: Generates a detailed clinical report including patient data, scoring breakdown, and AI analysis.

*   **🌐 Multi-Language Support**:
    *   Thai (TH)
    *   English (EN)
    *   Lao (LO)
    *   Burmese (MY)

*   **Modern UI/UX**:
    *   Responsive design using Tailwind CSS.
    *   Clean, hospital-grade aesthetic.
    *   Accessibility-focused interface.

## 🛠️ Technology Stack

*   **Frontend**: React (v19), TypeScript
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Build/Environment**: ES Modules (ESM) via standard HTML import maps.

## 🚀 Usage

1.  **Patient Information**: Fill in the patient's details, HN, and assessor information.
2.  **History**: Add any known historical drug allergies.
3.  **Current Event**: Input the suspected drug name and the observed reaction/symptom.
4.  **Assessment**: Answer the 10 Naranjo questions (Yes / No / Don't Know).
5.  **Analysis**:
    *   View the calculated Score and Interpretation.
    *   Click **"Analyze with AI"** to get a detailed clinical breakdown.
6.  **Print**:
    *   Use **"Print Allergy Card"** for a patient handout.
    *   Use **"Print Full Report"** for medical records.

## 🔑 Configuration

This project requires a Google Gemini API Key to function.
The key is accessed via `process.env.API_KEY`.

## 📜 License & Credits

**Developed by:**
Pharmacist Thanatcha Songmuang
Head of Pharmacy Informatics and Manufacturing Pharmacy
Pharmacy Department, Warinchamrab Hospital, Ubon Ratchathani.

*Reference: Naranjo CA, et al. A method for estimating the probability of adverse drug reactions. Clin Pharmacol Ther. 1981;30:239-245.*
