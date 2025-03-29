const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.together.xyz/v1", // ✅ استبدال OpenAI بـ Together.AI
  apiKey: process.env.TOGETHER_AI_API_KEY, // 🔑 استخدم مفتاح Together.AI
});

// 📊 دالة تحليل الأداء وتقديم توصيات
const analyzePerformance = async (userPerformanceData) => {
  try {
    const prompt = `
    أنت مساعد ذكاء اصطناعي متخصص في تحسين الأداء الشخصي.  
    بناءً على البيانات التالية:
    ${JSON.stringify(userPerformanceData)}
    
    **التعليمات:**
    - لا تستخدم أسماء الحقول باللغة الإنجليزية.
    - يجب أن تكون التوصيات واقعية وفقًا لنظام النقاط التالي:
      - **🏅 الشارة الذهبية:** 70 نقطة
      - **🥈 الشارة الفضية:** 50 - 60 نقطة
      - **🥉 الشارة البرونزية:** 45 - 50 نقطة
      - **👍 نتيجة مقبولة:** 40 - 45 نقطة
      - **❌ أقل من 40 نقطة:** يجب تنفيذ العقوبة
    
    **المطلوب:**
    قدم 3 توصيات مباشرة للأسبوع القادم بدون أي مقدمات أو تحليلات إضافية.  
    يجب أن تكون التوصيات:
    1. **محددة وقابلة للتنفيذ.**
    2. **مبنية على البيانات.**
    3. **تحفيزية.**
    
    اخرج التوصيات فقط كقائمة مرقمة، دون أي عبارات إضافية.
    `;
    
    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", // استخدام نموذج Together.AI
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ خطأ في توليد التوصيات:", error.response ? error.response.data : error.message);
    return null;
  }
};

// ✅ دالة توليد رسالة تحفيزية مخصصة بناءً على أداء المستخدم
const generateMotivationalMessage = async (userPerformanceData) => {
  try {
    const prompt = `
    🔥 **توليد رسالة تحفيزية جاهزة** 🔥
  
    **التعليمات المهمة للنموذج:**
    - لا تقم بتحليل البيانات أو التفكير بصوت عالٍ.
    - فقط قم بتوليد رسالة تحفيزية مباشرة باللغة العربية.
    - اجعلها قصيرة، واضحة، ومؤثرة (بين 2-3 جمل فقط).
    - ابدأ بكلمة إيجابية مثل "أحسنت!" أو "ما شاء الله!".
    - لا تشرح لماذا أعطيت هذه الرسالة، فقط أرسلها مباشرة.
  
    **بيانات المستخدم:**
    ${JSON.stringify(userPerformanceData)}
  
    🎯 **الآن، قدم الرسالة التحفيزية النهائية فقط، بدون أي تفكير جانبي أو تحليل!**
  `;
  
    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", // استخدام نموذج Together.AI
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ خطأ في توليد الرسالة التحفيزية:", error.response ? error.response.data : error.message);
    return null;
  }
};

// 🗺️ دالة توليد خطة خطوة بخطوة لتحقيق الهدف
const generatePlan = async (userGoal) => {
  try {
    const prompt = `
    أنت مساعد ذكاء اصطناعي متخصص في وضع خطط عملية لتحقيق الأهداف.
    
    **التعليمات:**
    - لا تقدم مقدمات أو تحليلات إضافية.
    - فقط قم بتوليد خطة خطوة بخطوة باللغة العربية.
    - اجعل الخطة قصيرة وواضحة (4-8 خطوات فقط).
    - ركز على خطوات عملية وواقعية تناسب المبتدئين.
    - تأكد أن كل خطوة هي جملة مكتملة وواضحة لغويًا.
    - لا تكرر الهدف في الخطة، فقط اذكر الخطوات مباشرة.
    
    **الهدف:**
    ${userGoal}
    
    **المطلوب:**
    اخرج الخطة كقائمة مرقمة (مثل: 1. الخطوة الأولى. 2. الخطوة الثانية.)، دون أي عبارات إضافية.
    `;
    
    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ خطأ في توليد الخطة:", error.response ? error.response.data : error.message);
    return null;
  }
};

module.exports = { analyzePerformance, generateMotivationalMessage, generatePlan };