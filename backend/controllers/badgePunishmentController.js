const asyncHandler = require("express-async-handler");
const Challenge = require("../models/challengeModel");
const Badge = require("../models/badgeModel");
const Punishment = require("../models/punishmentModel");
const DailyProgress = require("../models/dailyProgressModel");
const AiNotification = require("../models/AI.NotificationModel");
const { getCurrentWeekInfo } = require("../helpers/getCurrentWeekInfo");
const { analyzePerformance } = require("../helpers/aiService");

// حساب الشارات والعقوبات الأسبوعية (يُشغل يوم الجمعة)
const calculateWeeklyResults = asyncHandler(async (req, res) => {
  const { challengeId } = req.body;

  const challenge = await Challenge.findById(challengeId);
  if (!challenge || challenge.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "تحدٍ غير موجود أو غير مسموح" });
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekProgress = await DailyProgress.find({
    challengeId,
    date: { $gte: weekStart },
  });

  const weeklyPoints = weekProgress.reduce(
    (total, day) => total + day.dailyPoints,
    0
  );
  const weekNumber = Math.ceil(
    (new Date() - challenge.startDate) / (7 * 24 * 60 * 60 * 1000)
  );

  let badgeType;
  if (weeklyPoints >= 60) badgeType = "ذهبية";
  else if (weeklyPoints >= 50) badgeType = "فضية";
  else if (weeklyPoints >= 45) badgeType = "برونزية";
  else if (weeklyPoints >= 40) badgeType = "مقبولة";

  if (badgeType) {
    await Badge.create({
      userId: req.user._id,
      challengeId,
      badgeType,
      weekNumber,
      pointsEarned: weeklyPoints,
    });
  }

  if (weeklyPoints < 40) {
    await Punishment.create({ userId: req.user._id, challengeId, weekNumber });
    await AiNotification.create({
      userId: req.user._id,
      message: `نقاطك الأسبوعية ${weeklyPoints}. نفذ عقوبتك وحدد نقاط تحسين للأسبوع القادم!`,
      type: "توصيات",
    });
  } else {
    await AiNotification.create({
      userId: req.user._id,
      message: `تهانينا! حصلت على شارة ${badgeType} بـ ${weeklyPoints} نقطة!`,
      type: "تحفيز",
    });
  }

  res
    .status(200)
    .json({ message: "تم حساب النتائج الأسبوعية", weeklyPoints, badgeType });
});

const awardWeeklyOutcome = asyncHandler(async (challengeId, userId) => {
  try {
    // جلب تحدي المستخدم مع بيانات التحدي المعلن
    const challenge = await Challenge.findById(challengeId).populate(
      "announcedChallengeId"
    );
    if (!challenge) {
      console.log(`⚠️ التحدي غير موجود - ID: ${challengeId}`);
      return;
    }
    if (!challenge.announcedChallengeId) {
      console.log(`⚠️ التحدي الشخصي ${challengeId} ليس مرتبطًا بتحدي معلن`);
      return;
    }

    const announced = challenge.announcedChallengeId;
    const now = new Date();

    // التحقق من أن التحدي المعلن قد بدأ ولم ينتهِ
    const nowDate = now.toISOString().split("T")[0]; // استخراج التاريخ فقط بدون الوقت
    const startDateOnly = new Date(announced.startDate); // تأكد أن startDate هو كائن Date
    const startDateString = startDateOnly.toISOString().split("T")[0]; // استخراج التاريخ فقط

    console.log("🕒 التوقيت الحالي:", now.toISOString());
    console.log("📅 تاريخ البداية:", startDateString);

    if (nowDate < startDateString) {
      console.log(`⚠️ لم يبدأ تحدي 60 بعد - ID: ${challengeId}`);
      return;
    }
    if (now >= new Date(announced.endDate)) {
      console.log(
        `⚠️ انتهى تحدي 60، لا يمكن توثيق الأسبوع - ID: ${challengeId}`
      );
      return;
    }

    // حساب رقم الأسبوع وبداية ونهاية الأسبوع الحاليين
    const { currentWeekNumber, weekStart, weekEnd } = await getCurrentWeekInfo(
      userId,
      challengeId
    );

    // تجميع سجلات التقدم اليومي لهذا التحدي خلال الأسبوع الحالي
    const progressRecords = await DailyProgress.aggregate([
      {
        $match: {
          userId: challenge.userId,
          challengeId: challenge._id,
          date: { $gte: weekStart, $lte: weekEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalWeeklyPoints: { $sum: "$dailyPoints" },
        },
      },
    ]);

    const weeklyPoints = progressRecords.length
      ? progressRecords[0].totalWeeklyPoints
      : 0;

    // تحديد النتيجة بناءً على النقاط
    let outcome = null;
    let outcomeMessage = "";

    if (weeklyPoints >= 60 && weeklyPoints <= 70) {
      outcome = "ذهبية";
      outcomeMessage = "مبروك! حصلت على الشارة الذهبية لهذا الأسبوع.";
    } else if (weeklyPoints >= 50 && weeklyPoints < 60) {
      outcome = "فضية";
      outcomeMessage = "عمل ممتاز! حصلت على الشارة الفضية لهذا الأسبوع.";
    } else if (weeklyPoints >= 45 && weeklyPoints < 50) {
      outcome = "برونزية";
      outcomeMessage = "أحسنت! حصلت على الشارة البرونزية لهذا الأسبوع.";
    } else if (weeklyPoints >= 40 && weeklyPoints < 45) {
      outcome = "مقبولة";
      outcomeMessage = "نتيجة مقبولة لهذا الأسبوع.";
    } else if (weeklyPoints < 40) {
      outcome = "عقوبة";
      outcomeMessage = "للأسف، نقاطك أقل من المطلوب، يجب تنفيذ العقوبة.";
    }

    // إنشاء السجل المناسب (شارات أو عقوبة)
    if (outcome === "عقوبة") {
      await Punishment.create({
        userId: challenge.userId,
        challengeId: challenge._id,
        weekNumber: currentWeekNumber,
        executed: false,
      });

      console.log(`❌ العقوبة مسجلة للتحدي ${challengeId} للمستخدم ${userId}`);
    } else {
      await Badge.create({
        userId: challenge.userId,
        challengeId: challenge._id,
        badgeType: outcome,
        weekNumber: currentWeekNumber,
        pointsEarned: weeklyPoints,
      });

      console.log(
        `🏅 تم تسجيل الشارة (${outcome}) للتحدي ${challengeId} للمستخدم ${userId}`
      );
    }

    // 📊 تحليل الأداء وجلب التوصيات
    const userPerformanceData = {
      userId: challenge.userId,
      challengeId: challenge._id,
      weekNumber: currentWeekNumber,
      weekStart,
      weekEnd,
      weeklyPoints,
      outcome,
    };
    console.log("🚀 بدء تحليل الأداء...");
    let recommendations;
    try {
      recommendations = await analyzePerformance(userPerformanceData);
      console.log("✅ تحليل الأداء اكتمل، التوصيات:", recommendations);
    } catch (error) {
      console.error(
        "❌ خطأ أثناء تحليل الأداء، سيتم استخدام توصيات افتراضية:",
        error
      );
    }

    // إذا لم يتم الحصول على توصيات أو كانت غير صالحة، استخدم توصيات افتراضية
    if (!recommendations || recommendations.length === 0) {
      recommendations = [
        "حافظ على استمراريتك! أداءك مستقر ولكن يمكنك تحسينه بمزيد من التركيز.",
        "جرب تعديل جدولك اليومي لزيادة وقت الأنشطة التي تساعدك على تحقيق أهدافك.",
        "من الرائع أن تحافظ على التحدي، استمر بنفس العزيمة، وستصل إلى نتائج أفضل!",
      ];
    }
    console.log("📊 البيانات التي أرسلت لتحليل الأداء:", userPerformanceData);
    console.log("🔍 التوصيات المستلمة:", recommendations);

    // حذف أي توصيات سابقة للمستخدم
    await AiNotification.deleteMany({ userId, type: "توصيات" });

    // حفظ التوصيات الجديدة في قاعدة البيانات
    await AiNotification.create({
      userId,
      type: "توصيات",
      message: recommendations,
    });
  } catch (error) {
    console.error(`❌ خطأ أثناء توثيق الأسبوع للتحدي ${challengeId}:`, error);
  }
});

module.exports = { awardWeeklyOutcome, calculateWeeklyResults };
