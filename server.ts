import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// تهيئة عميل Google Gemini AI في الخادم الخلفي بأمان
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `
أنت 'مستشار آفاق الأكاديمي والمهني الذكي' (AFAQ AI Academic Advisor)، الخبير الاستراتيجي الدولي الأول في المنح الدراسية والقبولات الجامعية في كبرى جامعات العالم (Chevening, DAAD, Türkiye Bursları, Fulbright, Erasmus Mundus, KAUST, Gates Cambridge وغيرها).

مهامك ومسؤولياتك:
1. تقديم إجابات دقيقة ومفصلة وموثوقة عن المنح الدراسية، مواعيدها، شروط الأهلية، والجامعات المعتمدة.
2. اقتراح وتحليل المنح المناسبة لملف الطالب الأكاديمي (المعدل، التخصص، الدرجة المستهدفة، شهادات اللغة، والجنسية).
3. المساعدة العملية في كتابة وتدقيق وتطوير خطابات الدافع (Statement of Purpose / Motivation Letter) ورسائل التوصية الأكاديمية وصياغة السيرة الذاتية (Academic CV).
4. الرد بأسلوب مشجع، ملهم، وفخم، باستخدام لغة عربية فصحى راقية، وتوضيح المصطلحات الأكاديمية والإنجليزية المقابلة عند الحاجة.
5. تنسيق الإجابة بنقاط واضحة ومنظمة لتسهيل القراءة والتطبيق.
`;

// واجهة التحدث مع المستشار الذكي
app.post('/api/advisor/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, studentContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    let contextPrompt = '';
    if (studentContext) {
      contextPrompt = `
[معلومات ملف الطالب الحالية]:
- الاسم: ${studentContext.fullName || 'طالب آفاق'}
- الجنسية: ${studentContext.nationality || 'غير محدد'}
- المعدل التراكمي: ${studentContext.currentGpa || '0'} / ${studentContext.gpaScale || '4.0'}
- المرحلة المطلوبة: ${studentContext.targetDegree || 'MASTER'}
- التخصص المستهدف: ${studentContext.targetMajor || 'عام'}
- شهادة اللغة: ${studentContext.languageTestType || 'None'} (الدرجة: ${studentContext.languageScore || '0'})
---
`;
    }

    const fullPrompt = `${contextPrompt}رسالة واستفسار الطالب: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({
      reply: response.text || 'عذراً، لم أستطع تكوين الإجابة في الوقت الحالي. يرجى إعادة المحاولة.',
    });
  } catch (error: any) {
    console.error('Gemini Advisor Error:', error);
    res.status(500).json({
      error: 'Failed to generate advisor response',
      details: error?.message || 'Server error',
    });
  }
});

// واجهة تدقيق وتحليل خطابات الدافع (SOP Auditor)
app.post('/api/advisor/analyze-sop', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sopDraft, targetScholarship, targetMajor, studentGpa } = req.body;

    if (!sopDraft || typeof sopDraft !== 'string') {
      res.status(400).json({ error: 'SOP draft is required' });
      return;
    }

    const prompt = `
قم بمراجعة وتحليل وتدقيق خطاب الدافع (Statement of Purpose) التالي بعين خبير لجان تقييم المنح الدولية:

المنحة أو الجامعة المستهدفة: ${targetScholarship || 'منحة دولية مرموقة'}
التخصص المستهدف: ${targetMajor || 'الدراسات العليا'}
معدل الطالب: ${studentGpa || 'غير محدد'}

مسودة الخطاب:
"""
${sopDraft}
"""

المطلوب:
1. تقييم شامل لخطاب الدافع مع نقاط القوة (3 نقاط رئيسية).
2. الفجوات ونقاط الضعف التي تحتاج إلى إعادة صياغة فورية.
3. صياغة نموذجية محسنة للفقرة الافتتاحية (Hook & Introduction).
4. صياغة نموذجية محسنة للفقرة الختامية (Conclusion & Vision).
5. 3 نصائح ذهبية تزيد فرصة القبول في هذه المنحة بالذات.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({
      analysis: response.text || 'تعذر استخراج التحليل. يرجى إعادة إرسال المسودة.',
    });
  } catch (error: any) {
    console.error('SOP Analysis Error:', error);
    res.status(500).json({
      error: 'Failed to analyze SOP',
      details: error?.message || 'Server error',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();