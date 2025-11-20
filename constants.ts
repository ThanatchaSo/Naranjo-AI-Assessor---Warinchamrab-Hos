
import { Question, Language, Translation } from './types';

const BASE_SCORES = [
  { id: 1, yes: 1, no: 0, dk: 0 },
  { id: 2, yes: 2, no: -1, dk: 0 },
  { id: 3, yes: 1, no: 0, dk: 0 },
  { id: 4, yes: 2, no: -1, dk: 0 },
  { id: 5, yes: -1, no: 2, dk: 0 },
  { id: 6, yes: -1, no: 1, dk: 0 },
  { id: 7, yes: 1, no: 0, dk: 0 },
  { id: 8, yes: 1, no: 0, dk: 0 },
  { id: 9, yes: 1, no: 0, dk: 0 },
  { id: 10, yes: 1, no: 0, dk: 0 },
];

export const QUESTIONS_BY_LANG: Record<Language, Question[]> = {
  th: [
    "เคยมีรายงานสรุปแน่ชัดเกี่ยวกับอาการนี้มาก่อนหรือไม่?",
    "อาการเกิดขึ้นหลังจากได้รับยาที่สงสัยใช่หรือไม่?",
    "อาการดีขึ้นเมื่อหยุดยา หรือได้รับยาต้านจำเพาะหรือไม่?",
    "อาการกลับมาเป็นซ้ำเมื่อได้รับยาเดิมอีกครั้งหรือไม่?",
    "มีสาเหตุอื่น (นอกจากยา) ที่อธิบายอาการนี้ได้หรือไม่?",
    "อาการกำเริบเมื่อได้รับยาหลอก (Placebo) หรือไม่?",
    "ตรวจพบระดับยาในเลือด (หรือสารคัดหลั่ง) ในระดับที่เป็นพิษหรือไม่?",
    "อาการรุนแรงขึ้นเมื่อเพิ่มขนาดยา หรือลดลงเมื่อลดขนาดยาหรือไม่?",
    "ผู้ป่วยเคยมีอาการคล้ายกันกับยาตัวเดิมหรือยาที่คล้ายกันในอดีตหรือไม่?",
    "อาการไม่พึงประสงค์ได้รับการยืนยันด้วยหลักฐานเชิงประจักษ์หรือไม่?"
  ].map((text, idx) => ({
    id: idx + 1,
    text,
    yesScore: BASE_SCORES[idx].yes,
    noScore: BASE_SCORES[idx].no,
    dontKnowScore: BASE_SCORES[idx].dk
  })),
  en: [
    "Are there previous conclusive reports on this reaction?",
    "Did the adverse event appear after the suspected drug was administered?",
    "Did the adverse reaction improve when the drug was discontinued or a specific antagonist was administered?",
    "Did the adverse reaction reappear when the drug was re-administered?",
    "Are there alternative causes (other drugs or underlying disease) that could on their own have caused the reaction?",
    "Did the reaction reappear when a placebo was given?",
    "Was the drug detected in the blood (or other fluids) in concentrations known to be toxic?",
    "Was the reaction more severe when the dose was increased or less severe when the dose was decreased?",
    "Did the patient have a similar reaction to the same or similar drugs in any previous exposure?",
    "Was the adverse event confirmed by any objective evidence?"
  ].map((text, idx) => ({
    id: idx + 1,
    text,
    yesScore: BASE_SCORES[idx].yes,
    noScore: BASE_SCORES[idx].no,
    dontKnowScore: BASE_SCORES[idx].dk
  })),
  lo: [
    "ມີລາຍງານທີ່ຊັດເຈນກ່ຽວກັບປະຕິກິລິຍານີ້ມາກ່ອນບໍ່?",
    "ອາການເກີດຂຶ້ນຫຼັງຈາກໄດ້ຮັບຢາທີ່ສົງໄສແມ່ນບໍ່?",
    "ອາການດີຂຶ້ນເມື່ອຢຸດຢາ ຫຼື ໄດ້ຮັບຢາແກ້ພິດສະເພາະແມ່ນບໍ່?",
    "ອາການກັບມາເປັນອີກເມື່ອໄດ້ຮັບຢາເດີມຊ້ຳແມ່ນບໍ່?",
    "ມີສາເຫດອື່ນ (ນອກຈາກຢາ) ທີ່ອະທິບາຍອາການນີ້ໄດ້ບໍ່?",
    "ອາການກັບມາເປັນອີກເມື່ອໄດ້ຮັບຢາຫຼອກ (Placebo) ແມ່ນບໍ່?",
    "ກວດພົບລະດັບຢາໃນເລືອດ (ຫຼື ສານຄັດຫຼັ່ງ) ໃນລະດັບທີ່ເປັນພິດແມ່ນບໍ່?",
    "ອາການຮຸນແຮງຂຶ້ນເມື່ອເພີ່ມຂະໜາດຢາ ຫຼື ຫຼຸດລົງເມື່ອຫຼຸດຂະໜາດຢາແມ່ນບໍ່?",
    "ຜູ້ປ່ວຍເຄີຍມີອາການຄ້າຍຄືກັນກັບຢາຕົວເດີມ ຫຼື ຢາທີ່ຄ້າຍຄືກັນໃນອະດີດແມ່ນບໍ່?",
    "ອາການບໍ່ພຶງປະສົງໄດ້ຮັບການຢືນຢັນດ້ວຍຫຼັກຖານທີ່ຊັດເຈນແມ່ນບໍ່?"
  ].map((text, idx) => ({
    id: idx + 1,
    text,
    yesScore: BASE_SCORES[idx].yes,
    noScore: BASE_SCORES[idx].no,
    dontKnowScore: BASE_SCORES[idx].dk
  })),
  my: [
    "ဤတုံ့ပြန်မှုနှင့်ပတ်သက်၍ ယခင်က အတိအကျ အစီရင်ခံစာများ ရှိပါသလား။",
    "သံသယရှိသောဆေးကို သောက်ပြီးနောက် ဆိုးရွားသောလက္ခဏာများ ပေါ်လာပါသလား။",
    "ဆေးရပ်လိုက်သောအခါ သို့မဟုတ် ဖြေဆေးပေးသောအခါ သက်သာသွားပါသလား။",
    "ဆေးကို ပြန်လည်ပေးသောအခါ လက္ခဏာများ ပြန်ပေါ်လာပါသလား။",
    "ဤလက္ခဏာကို ဖြစ်စေနိုင်သော အခြားအကြောင်းရင်းများ (အခြားဆေး သို့မဟုတ် ရောဂါ) ရှိပါသလား။",
    "ဆေးဝါးအတု (Placebo) ပေးသောအခါ လက္ခဏာများ ပြန်ပေါ်လာပါသလား။",
    "သွေးထဲတွင် (သို့မဟုတ် အခြားအရည်များ) အဆိပ်ဖြစ်စေနိုင်သော ပမာဏအထိ ဆေးဝါးကို တွေ့ရှိရပါသလား။",
    "ဆေးပမာဏတိုးသောအခါ ပိုဆိုးလာပြီး၊ လျှော့သောအခါ သက်သာပါသလား။",
    "လူနာသည် ယခင်က ဤဆေး သို့မဟုတ် ဆင်တူသောဆေးများနှင့် အလားတူဖြစ်ဖူးပါသလား။",
    "ဆိုးရွားသောဖြစ်ရပ်ကို ဓမ္မဓိဋ္ဌာန်ကျသော သက်သေအထောက်အထားဖြင့် အတည်ပြုနိုင်ပါသလား။"
  ].map((text, idx) => ({
    id: idx + 1,
    text,
    yesScore: BASE_SCORES[idx].yes,
    noScore: BASE_SCORES[idx].no,
    dontKnowScore: BASE_SCORES[idx].dk
  })),
};

export const TRANSLATIONS: Record<Language, Translation> = {
  th: {
    title: "Naranjo AI Assessor - Warinchamrab Hospital",
    subtitle: "แบบประเมินอาการไม่พึงประสงค์จากการใช้ยา",
    role: "เครื่องมือสำหรับเภสัชกร",
    // Section 1
    headerPatient: "1 ข้อมูลผู้ป่วย",
    labelName: "ชื่อ-สกุล",
    labelHN: "HN",
    labelUnit: "หน่วยงานที่ประเมิน",
    labelDate: "วันที่",
    labelPharmacist: "เภสัชกรผู้ประเมิน",
    labelLicense: "เลขใบประกอบฯ (ภ.)",
    // Section 2 History
    headerHistory: "ประวัติการแพ้ยาเดิม (History)",
    subHistory: "เพิ่มรายการยาที่ทราบประวัติแพ้อยู่แล้ว (ระบุเป็นประวัติเก่า H)",
    labelHistoryDrug: "ชื่อยา",
    labelHistorySymptoms: "อาการ",
    labelHistoryDate: "วันที่แพ้ (ถ้าทราบ)",
    btnAdd: "+ เพิ่มรายการ",
    noHistoryAdded: "ยังไม่มีรายการประวัติการแพ้ยา",
    // Section 3 Current
    headerCurrentEvent: "2 ประเมินยาที่สงสัย (Suspected Drug Assessment)",
    drugLabel: "ชื่อยาที่สงสัย",
    drugPlaceholder: "เช่น Amoxicillin",
    reactionLabel: "รายละเอียดอาการไม่พึงประสงค์",
    reactionPlaceholder: "เช่น ผื่นแดง คัน",
    // Assessment
    questionsHeader: "คำถามประเมิน Naranjo",
    answered: "ตอบแล้ว",
    viewResults: "ดูผลการวิเคราะห์",
    completeAll: "กรุณาตอบคำถามให้ครบเพื่อดูผลลัพธ์",
    scoreTitle: "คะแนนความน่าจะเป็น",
    classification: "การแปลผล",
    analyzeBtn: "วิเคราะห์ข้อมูลทางคลินิกด้วย AI",
    analyzing: "กำลังวิเคราะห์...",
    drug: "ยา",
    event: "อาการ",
    riskLevel: "ระดับความเสี่ยง",
    recommendations: "คำแนะนำ",
    disclaimer: "คำเตือน: การวิเคราะห์นี้สร้างขึ้นโดย AI เพื่อช่วยในการตัดสินใจเท่านั้น ไม่สามารถทดแทนดุลยพินิจของผู้เชี่ยวชาญได้ กรุณาตรวจสอบข้อมูล",
    reset: "เริ่มการประเมินใหม่",
    resetAnalysis: "ล้างผลการวิเคราะห์",
    yes: "ใช่",
    no: "ไม่ใช่",
    dontKnow: "ไม่ทราบ",
    interpretations: {
      definite: "ใช่แน่นอน (Definite)",
      probable: "น่าจะใช่ (Probable)",
      possible: "อาจจะใช่ (Possible)",
      doubtful: "น่าสงสัย (Doubtful)"
    },
    riskFactors: {
      Low: "ต่ำ",
      Medium: "ปานกลาง",
      High: "สูง"
    },
    // Card
    cardTitle: "บัตรแพ้ยา (Drug Allergy Card)",
    cardTableDrug: "ยาที่แพ้ (Drug Name)",
    cardTableSymptom: "อาการ (Symptoms)",
    cardTableDate: "วันที่ (Date)",
    cardTableResult: "ผลประเมิน (Result)",
    cardHistoryLabel: "ประวัติเก่า (H)",
    cardFooterWarning: "โปรดแสดงบัตรนี้ทุกครั้งที่เข้ารับบริการ",
    cardFooterWarningEn: "Please show this card every visit.",
    printCardBtn: "พิมพ์บัตรแพ้ยา",
    printReportBtn: "พิมพ์รายงานฉบับเต็ม (A4)",
    assessor: "ผู้ประเมิน",
    guidelineBtn: "แนวทางปฏิบัติ ADR"
  },
  en: {
    title: "Naranjo AI Assessor - Warinchamrab Hospital",
    subtitle: "ADR Probability Scale & Assessment",
    role: "Clinical Pharmacist Tool",
    // Section 1
    headerPatient: "1 Patient Information",
    labelName: "Name-Surname",
    labelHN: "HN",
    labelUnit: "Assessing Unit",
    labelDate: "Date",
    labelPharmacist: "Assessing Pharmacist",
    labelLicense: "License No.",
    // Section 2 History
    headerHistory: "History of Drug Allergy",
    subHistory: "Add known drug allergies (indicate H for historical records)",
    labelHistoryDrug: "Drug Name",
    labelHistorySymptoms: "Symptoms",
    labelHistoryDate: "Date (if known)",
    btnAdd: "+ Add",
    noHistoryAdded: "No history added yet",
    // Section 3 Current
    headerCurrentEvent: "2 Suspected Drug Assessment",
    drugLabel: "Suspected Drug Name",
    drugPlaceholder: "e.g., Amoxicillin",
    reactionLabel: "Adverse Event Description",
    reactionPlaceholder: "e.g., Maculopapular rash",
    // Assessment
    questionsHeader: "Naranjo Assessment Questions",
    answered: "Answered",
    viewResults: "View Results Analysis",
    completeAll: "Complete all questions to unlock analysis",
    scoreTitle: "Probability Score",
    classification: "Classification",
    analyzeBtn: "Generate Clinical Analysis",
    analyzing: "Analyzing...",
    drug: "Drug",
    event: "Event",
    riskLevel: "Risk Level",
    recommendations: "Recommended Actions",
    disclaimer: "Disclaimer: This analysis is generated by AI as a decision support tool. It does not replace professional clinical judgment.",
    reset: "Start New Assessment",
    resetAnalysis: "Reset Analysis",
    yes: "Yes",
    no: "No",
    dontKnow: "Unk",
    interpretations: {
      definite: "Definite ADR",
      probable: "Probable ADR",
      possible: "Possible ADR",
      doubtful: "Doubtful ADR"
    },
    riskFactors: {
      Low: "Low",
      Medium: "Medium",
      High: "High"
    },
    // Card
    cardTitle: "Drug Allergy Card",
    cardTableDrug: "Drug Name",
    cardTableSymptom: "Symptoms",
    cardTableDate: "Date",
    cardTableResult: "Result",
    cardHistoryLabel: "History (H)",
    cardFooterWarning: "โปรดแสดงบัตรนี้ทุกครั้งที่เข้ารับบริการ",
    cardFooterWarningEn: "Please show this card every visit.",
    printCardBtn: "Print Allergy Card",
    printReportBtn: "Print Full Report (A4)",
    assessor: "Assessor",
    guidelineBtn: "ADR Guidelines"
  },
  lo: {
    title: "Naranjo AI Assessor - Warinchamrab Hospital",
    subtitle: "ແບບປະເມີນຜົນຂ້າງຄຽງຈາກການໃຊ້ຢາ",
    role: "ເຄື່ອງມືສຳລັບແພດການຢາ",
    // Section 1
    headerPatient: "1 ຂໍ້ມູນຜູ້ປ່ວຍ",
    labelName: "ຊື່-ນາມສະກຸນ",
    labelHN: "HN",
    labelUnit: "ໜ່ວຍງານປະເມີນ",
    labelDate: "ວັນທີ",
    labelPharmacist: "ແພດການຢາຜູ້ປະເມີນ",
    labelLicense: "ເລກໃບປະກອບວິຊາຊີບ",
    // Section 2 History
    headerHistory: "ປະຫວັດການແພ້ຢາ (History)",
    subHistory: "ເພີ່ມລາຍການຢາທີ່ຮູ້ປະຫວັດແພ້ແລ້ວ",
    labelHistoryDrug: "ຊື່ຢາ",
    labelHistorySymptoms: "ອາການ",
    labelHistoryDate: "ວັນທີ (ຖ້າຮູ້)",
    btnAdd: "+ ເພີ່ມ",
    noHistoryAdded: "ຍັງບໍ່ມີປະຫວັດ",
    // Section 3 Current
    headerCurrentEvent: "2 ການປະເມີນຢາທີ່ສົງໄສ",
    drugLabel: "ຊື່ຢາທີ່ສົງໄສ",
    drugPlaceholder: "ເຊັ່ນ: Amoxicillin",
    reactionLabel: "ລາຍລະອຽດອາການແພ້",
    reactionPlaceholder: "ເຊັ່ນ: ຜື່ນແດງ, ຄັນ",
    // Assessment
    questionsHeader: "ຄຳຖາມປະເມີນ Naranjo",
    answered: "ຕອບແລ້ວ",
    viewResults: "ເບິ່ງຜົນການວິເຄາະ",
    completeAll: "ກະລຸນາຕອບຄຳຖາມໃຫ້ຄົບຖ້ວນ",
    scoreTitle: "ຄະແນນຄວາມເປັນໄປໄດ້",
    classification: "ການແປຜົນ",
    analyzeBtn: "ວິເຄາະຂໍ້ມູນທາງຄລີນິກດ້ວຍ AI",
    analyzing: "ກຳລັງວິເຄາະ...",
    drug: "ຢາ",
    event: "ອາການ",
    riskLevel: "ລະດັບຄວາມສ່ຽງ",
    recommendations: "ຄຳແນະນຳ",
    disclaimer: "ຄຳເຕືອນ: ການວິເຄາະນີ້ສ້າງຂຶ້ນໂດຍ AI ເພື່ອຊ່ວຍໃນການຕັດສິນໃຈເທົ່ານັ້ນ, ບໍ່ສາມາດທົດແທນການວິນິດໄສຂອງຜູ້ຊ່ຽວຊານໄດ້.",
    reset: "ເລີ່ມການປະເມີນໃໝ່",
    resetAnalysis: "ລ້າງຜົນການວິເຄາະ",
    yes: "ແມ່ນ",
    no: "ບໍ່",
    dontKnow: "ບໍ່ຮູ້",
    interpretations: {
      definite: "ແມ່ນແນ່ນອນ (Definite)",
      probable: "ໜ້າຈະແມ່ນ (Probable)",
      possible: "ອາດຈະແມ່ນ (Possible)",
      doubtful: "ໜ້າສົງໄສ (Doubtful)"
    },
    riskFactors: {
      Low: "ຕໍ່າ",
      Medium: "ປານກາງ",
      High: "ສູງ"
    },
    // Card
    cardTitle: "ບັດແພ້ຢາ (Drug Allergy Card)",
    cardTableDrug: "ຊື່ຢາ",
    cardTableSymptom: "ອາການ",
    cardTableDate: "ວັນທີ",
    cardTableResult: "ຜົນປະເມີນ",
    cardHistoryLabel: "ປະຫວັດເກົ່າ (H)",
    cardFooterWarning: "ໂປດສະແດງບັດນີ້ທຸກຄັ້ງທີ່ເຂົ້າຮັບບໍລິການ",
    cardFooterWarningEn: "Please show this card every visit.",
    printCardBtn: "ພິມບັດແພ້ຢາ",
    printReportBtn: "ພິມບົດລາຍງານ (A4)",
    assessor: "ຜູ້ປະເມີນ",
    guidelineBtn: "ຄູ່ມື ADR"
  },
  my: {
    title: "Naranjo AI Assessor - Warinchamrab Hospital",
    subtitle: "ဆေးဝါးဆိုးကျိုးများ ဖြစ်နိုင်ချေ တိုင်းတာခြင်း",
    role: "ဆေးဝါးပညာရှင်များအတွက်",
    // Section 1
    headerPatient: "1 လူနာအချက်အလက်",
    labelName: "အမည်",
    labelHN: "HN",
    labelUnit: "ဌာန",
    labelDate: "နေ့စွဲ",
    labelPharmacist: "ဆေးဝါးပညာရှင်",
    labelLicense: "လိုင်စင်နံပါတ်",
    // Section 2 History
    headerHistory: "ယခင်ဆေးမတည့်သည့် ရာဇဝင်",
    subHistory: "သိရှိထားသော ဆေးမတည့်မှုများကို ထည့်ပါ",
    labelHistoryDrug: "ဆေးအမည်",
    labelHistorySymptoms: "လက္ခဏာများ",
    labelHistoryDate: "နေ့စွဲ",
    btnAdd: "+ ထည့်ပါ",
    noHistoryAdded: "ရာဇဝင် မရှိသေးပါ",
    // Section 3 Current
    headerCurrentEvent: "2 သံသယရှိသောဆေးကို ဆန်းစစ်ခြင်း",
    drugLabel: "သံသယရှိသောဆေး",
    drugPlaceholder: "ဥပမာ - Amoxicillin",
    reactionLabel: "ဆိုးကျိုးလက္ခဏာ",
    reactionPlaceholder: "ဥပမာ - အနီကွက်ထွက်ခြင်း",
    // Assessment
    questionsHeader: "Naranjo မေးခွန်းများ",
    answered: "ဖြေပြီး",
    viewResults: "ရလဒ်ကြည့်ရန်",
    completeAll: "ကျေးဇူးပြု၍ မေးခွန်းအားလုံးဖြေပါ",
    scoreTitle: "ရမှတ်",
    classification: "အဓိပ္ပါယ်ဖွင့်ဆိုချက်",
    analyzeBtn: "AI ဖြင့် ဆေးခန်းသုံး သုံးသပ်ချက်ရယူရန်",
    analyzing: "ဆန်းစစ်နေပါသည်...",
    drug: "ဆေး",
    event: "ဖြစ်ရပ်",
    riskLevel: "အန္တရာယ်အဆင့်",
    recommendations: "အကြံပြုချက်များ",
    disclaimer: "သတိပေးချက် - ဤသုံးသပ်ချက်သည် AI မှထုတ်လုပ်ထားခြင်းဖြစ်ပြီး ဆေးပညာရှင်များ၏ ဆုံးဖြတ်ချက်ကို အစားထိုး၍မရပါ။",
    reset: "အစမှပြန်စရန်",
    resetAnalysis: "ရလဒ်ပြန်ဖျက်ရန်",
    yes: "ဟုတ်",
    no: "မဟုတ်",
    dontKnow: "မသိ",
    interpretations: {
      definite: "သေချာပါသည် (Definite)",
      probable: "ဖြစ်နိုင်ချေများသည် (Probable)",
      possible: "ဖြစ်နိုင်ချေရှိသည် (Possible)",
      doubtful: "သံသယဖြစ်ဖွယ် (Doubtful)"
    },
    riskFactors: {
      Low: "အနိမ့်",
      Medium: "အလယ်အလတ်",
      High: "အမြင့်"
    },
    // Card
    cardTitle: "ဆေးမတည့်သည့်ကတ် (Drug Allergy Card)",
    cardTableDrug: "ဆေးအမည်",
    cardTableSymptom: "လက္ခဏာများ",
    cardTableDate: "နေ့စွဲ",
    cardTableResult: "ရလဒ်",
    cardHistoryLabel: "History (H)",
    cardFooterWarning: "ဆေးခန်းပြတိုင်း ဤကတ်ကိုပြပါ",
    cardFooterWarningEn: "Please show this card every visit.",
    printCardBtn: "ကတ်ထုတ်ရန်",
    printReportBtn: "အစီရင်ခံစာ ထုတ်ယူမည် (A4)",
    assessor: "စစ်ဆေးသူ",
    guidelineBtn: "ADR လမ်းညွှန်"
  }
};

export const interpretScore = (score: number): string => {
  if (score >= 9) return "Definite";
  if (score >= 5) return "Probable";
  if (score >= 1) return "Possible";
  return "Doubtful";
};

export const getColorForScore = (score: number): string => {
  if (score >= 9) return "text-red-600 bg-red-50 border-red-200"; // Definite
  if (score >= 5) return "text-orange-600 bg-orange-50 border-orange-200"; // Probable
  if (score >= 1) return "text-yellow-600 bg-yellow-50 border-yellow-200"; // Possible
  return "text-slate-600 bg-slate-50 border-slate-200"; // Doubtful
};