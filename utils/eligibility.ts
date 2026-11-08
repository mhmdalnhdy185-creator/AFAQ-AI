import { Scholarship, StudentProfile, EligibilityResult } from '../types';

export function calculateEligibility(profile: StudentProfile, scholarship: Scholarship): EligibilityResult {
  const strengthPoints: string[] = [];
  const missingCriteria: string[] = [];

  // 1. مطابقة المرحلة الأكاديمية (25 نقطة)
  let degreePoints = 0;
  let degreeStatus: 'MATCH' | 'MISMATCH' = 'MATCH';
  let degreeNote = '';

  if (profile.targetDegree === scholarship.degreeLevel) {
    degreePoints = 25;
    degreeStatus = 'MATCH';
    degreeNote = `المرحلة الأكاديمية المستهدفة (${scholarship.degreeLevel}) متطابقة تماماً مع ملفك.`;
    strengthPoints.push(degreeNote);
  } else {
    degreeStatus = 'MISMATCH';
    degreePoints = 10;
    degreeNote = `المنحة مخصصة لمرحلة (${scholarship.degreeLevel}) بينما هدفك الحالي هو (${profile.targetDegree}).`;
    missingCriteria.push(degreeNote);
  }

  // 2. تقييم المعدل التراكمي (35 نقطة)
  let gpaPoints = 0;
  let gpaStatus: 'MET' | 'CLOSE' | 'DEFICIT' = 'MET';
  let gpaNote = '';
  const normalizedGpa = (profile.currentGpa / profile.gpaScale) * 4.0;

  if (normalizedGpa >= scholarship.minGpa) {
    gpaPoints = 35;
    gpaStatus = 'MET';
    gpaNote = `معدلك التراكمي (${profile.currentGpa.toFixed(2)}) يفوق الحد الأدنى المطلوب (${scholarship.minGpa.toFixed(2)} / 4.0).`;
    strengthPoints.push(gpaNote);
  } else if (normalizedGpa >= scholarship.minGpa - 0.25) {
    gpaPoints = 22;
    gpaStatus = 'CLOSE';
    gpaNote = `معدلك التراكمي قريب جداً من الشرط الأدنى (فارق ${(scholarship.minGpa - normalizedGpa).toFixed(2)} فقط). يمكنك التعويض بخطاب دافع قوي.`;
    missingCriteria.push(gpaNote);
  } else {
    gpaPoints = 10;
    gpaStatus = 'DEFICIT';
    gpaNote = `معدلك التراكمي أقل من الحد الأدنى للمنحة بمقدار ${(scholarship.minGpa - normalizedGpa).toFixed(2)} نقطة.`;
    missingCriteria.push(gpaNote);
  }

  // 3. متطلب كفاءة اللغة (25 نقطة)
  let langPoints = 0;
  let langStatus: 'MET' | 'WAIVED' | 'DEFICIT' = 'MET';
  let langNote = '';

  if (!scholarship.requiresLanguage) {
    langPoints = 25;
    langStatus = 'WAIVED';
    langNote = 'المنحة لا تفرض شهادة لغة دولية إجبارية عند التقديم الأولي أو توفر سنة لغة مجانية.';
    strengthPoints.push(langNote);
  } else {
    if (profile.hasLanguageCert && profile.languageScore >= scholarship.minIeltsScore) {
      langPoints = 25;
      langStatus = 'MET';
      langNote = `شهادة اللغة الخاصة بك (${profile.languageTestType} ${profile.languageScore}) تستوفي أو تتفوق على الشرط المطلوب (${scholarship.minIeltsScore}).`;
      strengthPoints.push(langNote);
    } else {
      langPoints = 5;
      langStatus = 'DEFICIT';
      langNote = `تشترط المنحة درجة لغة معتمدة لا تقل عن ${scholarship.minIeltsScore} في IELTS أو ما يعادلها في TOEFL.`;
      missingCriteria.push(langNote);
    }
  }

  // 4. الأهلية الجغرافية والجنسية (15 نقطة)
  let natPoints = 0;
  let natStatus: 'ELIGIBLE' | 'RESTRICTED' = 'ELIGIBLE';
  let natNote = '';

  if (scholarship.eligibleNationalities.includes('ALL') || scholarship.eligibleNationalities.includes(profile.nationality)) {
    natPoints = 15;
    natStatus = 'ELIGIBLE';
    natNote = `جنسيتك (${profile.nationality}) مؤهلة ومشمولة مباشرة في هذه المنحة الدولية.`;
    strengthPoints.push(natNote);
  } else {
    natPoints = 0;
    natStatus = 'RESTRICTED';
    natNote = `المنحة مخصصة لجنسيات ومناطق جغرافية محددة لا تشمل جنسيتك الحالية.`;
    missingCriteria.push(natNote);
  }

  const totalMatch = Math.min(100, Math.round(degreePoints + gpaPoints + langPoints + natPoints));
  const isEligible = totalMatch >= 65;

  let recommendation = '';
  if (totalMatch >= 85) {
    recommendation = 'أنت مرشح مثالي وقوي جداً لهذه الفرصة! فرص قبولك مرتفعة، ننصحك بالبدء فوراً بتجهيز خطاب النوايا واستكمال متطلبات التقديم.';
  } else if (totalMatch >= 65) {
    recommendation = 'ملفك مستوفٍ للشروط الأساسية للمنحة. لرفع فرص قبولك التنافسي ننصحك بصياغة خطاب دافع مقنع واستخراج خطابات توصية أكاديمية دقيقة.';
  } else {
    recommendation = 'فرصة القبول المباشر في هذه المنحة منخفضة حالياً نظراً لوجود متطلبات ناقصة. ننصحك باستكشاف المنح البديلة المقترحة أو تحسين شهادة اللغة والمعدل.';
  }

  return {
    matchPercentage: totalMatch,
    isEligible,
    criteriaScores: {
      degreeMatch: { points: degreePoints, max: 25, status: degreeStatus, note: degreeNote },
      gpaScore: { points: gpaPoints, max: 35, status: gpaStatus, note: gpaNote },
      languageScore: { points: langPoints, max: 25, status: langStatus, note: langNote },
      nationalityMatch: { points: natPoints, max: 15, status: natStatus, note: natNote },
    },
    strengthPoints,
    missingCriteria,
    recommendation
  };
}