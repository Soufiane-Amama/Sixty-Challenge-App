import cron from "node-cron";
import OpenAI from "openai";
import { Performance } from "../models/performance.js";
import { User } from "../models/userModel.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// جدولة الوظيفة للعمل كل يوم جمعة الساعة 12 ظهرًا
cron.schedule("0 12 * * 5", async () => {
    console.log("🔍 بدء تحليل أداء المستخدمين الأسبوعي...");

    // جلب جميع المستخدمين المشاركين في تحدي الستين
    const users = await User.find({ isParticipating: true });

    for (const user of users) {
        // جلب أداء المستخدم خلال آخر 7 أيام
        const lastWeekPerformance = await Performance.find({
            userId: user._id,
            date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        if (lastWeekPerformance.length === 0) continue;

        // حساب إجمالي النقاط ومتوسط الأداء
        const totalPoints = lastWeekPerformance.reduce((sum, record) => sum + record.points, 0);
        const missedHabits = lastWeekPerformance.flatMap(record => record.habitsMissed);

        // تحضير البيانات لإرسالها إلى OpenAI
        const prompt = `لدى المستخدم أداء أسبوعي كالتالي:
        - إجمالي النقاط: ${totalPoints}
        - العادات التي لم يلتزم بها كثيرًا: ${[...new Set(missedHabits)].join(", ")}
        - العادات التي كان جيدًا فيها: ${[...new Set(lastWeekPerformance.flatMap(record => record.habitsCompleted))].join(", ")}

        قم بتحليل أدائه وأعطه 3 نصائح لتحسين أدائه في الأسبوع القادم.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200
        });

        const recommendation = response.choices[0].message.content;

        // إرسال التوصية للمستخدم (حفظها في قاعدة البيانات أو إرسال إشعار)
        console.log(`✅ توصيات الأسبوع للمستخدم ${user.name}:`, recommendation);

        // يمكنك إرسال التوصية عبر البريد الإلكتروني أو حفظها في قاعدة البيانات هنا
    }

    console.log("✅ تحليل الأداء الأسبوعي انتهى بنجاح!");
});
