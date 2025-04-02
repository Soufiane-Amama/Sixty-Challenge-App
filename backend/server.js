require('dotenv').config();

const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // إضافة helmet لتعزيز الأمان
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { generatePlan } = require("./helpers/aiService");

const userRoutes = require('./routes/userRoutes');
const announcedChallengeRoutes = require('./routes/announcedChallengeRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const dailyProgressRoutes = require('./routes/dailyProgressRoutes');
const badgePunishmentRoutes = require('./routes/badgePunishmentRoutes');
const aiNotificationRoutes = require('./routes/aiNotificationRoutes');


const app = express(); 
const PORT = process.env.PORT || 8000;

// 🛠️ Connect to database
connectDB();

// 🛡️ Middlewares
app.use(helmet()); // تفعيل helmet لجميع المسارات
app.use(express.json()); 
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*";
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // السماح بإرسال الكوكيز
}));

if (process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'));
}


// 🌍 المسار الأساسي
app.get("/", (req, res) => res.send("Server is running successfully! 🚀"));

require("./tasks/cronJobs"); // تشغيل وظيفة التوثيق الأسبوعي تلقائيًا

// 📌 Routes
app.use('/api/user', userRoutes);
app.use('/api/announced-challenge', announcedChallengeRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/daily-progress', dailyProgressRoutes);
app.use('/api/badge-punishment', badgePunishmentRoutes);
app.use('/api/ai-notification', aiNotificationRoutes);


// API لتوليد خريطة ذهنية
app.post("/api/mindmap", async (req, res) => {
    const { userGoal } = req.body;
  
    if (!userGoal) {
      return res.status(400).json({ error: "يرجى إدخال هدف" });
    }
  
    try {
      let generatedText;
  
      if (process.env.NODE_ENV === "development") {
        // 🛠 استخدام خطوات افتراضية في وضع التطوير
        generatedText = `1. اجمع المكونات الأساسية مثل الدقيق والزبدة والجبن والصلصة والتوابل.
          2. أعد عجينة البيتزا عن طريق خلط الدقيق والماء والزبدة والملح، ثم اتركها لتختمر لمدة معينة.
          3. ضع الصلصة والجبن والتوابل على العجينة ثم ضعها في الفرن لمدة 15-20 دقيقة.
          4. بعد أن ترتفع البيتزا وتستوي جيدًا، أخرجها من الفرن واتركها لتبرد قليلًا قبل تقطيعها وتقديمها.`;
      } else {
        // 🔥 استدعاء الذكاء الاصطناعي لتوليد الخطة في وضع الإنتاج
        generatedText = await generatePlan(userGoal);
      }
  
      if (!generatedText) {
        throw new Error("فشل في توليد الخطة");
      }
  
      console.log("generatedText::", generatedText);
  
      // ✨ **تقسيم النص إلى خطوات منفصلة بناءً على الأرقام**
      const steps = generatedText
        .split(/\d+\.\s*/) // تقسيم النص إلى خطوات باستخدام الأرقام (1. 2. 3. 4.)
        .filter((step) => step.trim() !== ""); // إزالة الخطوات الفارغة
  
      const nodeColors = [
        "#4CAF50",
        "#FF9800",
        "#03A9F4",
        "#E91E63",
        "#9C27B0",
        "#FFEB3B",
      ];
      const getNodeColor = (index) => nodeColors[index % nodeColors.length];
  
      const nodes = steps.map((step, index) => ({
        id: index.toString(), // تعيين معرف فريد لكل عقدة
        label: step.trim(), // تنظيف النص
        parent: index === 0 ? null : (index - 1).toString(), // يحدد العلاقة بين العقد بشكل تسلسلي (كل خطوة مرتبطة بالخطوة السابقة)
        color: getNodeColor(index), //  إرسال اللون مع العقدة
      }));
  
      console.log("nodes::", nodes);
  
      // 📤 **إرسال العقد إلى الواجهة**
      res.json({ nodes });
    } catch (error) {
      console.error("Error:", error);
  
      // ⚠️ في حالة الفشل، يتم إرسال بيانات افتراضية
      res.status(500).json({
        error: "فشل في توليد الخريطة",
        nodes: [
          { id: "0", label: userGoal, parent: null },
          { id: "1", label: "ابدأ بخطوة صغيرة", parent: "0" },
          { id: "2", label: "تابع تقدمك", parent: "0" },
        ],
      });
    }
});


// 🛑 Error Handlers
app.use(notFound); 
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
