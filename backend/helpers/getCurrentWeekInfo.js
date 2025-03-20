const asyncHandler = require("express-async-handler");
const Badge = require("../models/badgeModel");
const Punishment = require("../models/punishmentModel");
const Challenge = require("../models/challengeModel");
const AnnouncedChallenge = require("../models/announcedChallengeModel");


// دالة لحساب رقم الأسبوع الحالي وبداية ونهاية الأسبوع بناءً على سجلات الشارات/العقوبات وتاريخ بدء التحدي المعلن.
const getCurrentWeekInfo = asyncHandler(async (userId, challengeId) => {
  // استعلام عن أحدث سجل في نموذج الشارات والعقوبات لهذا المستخدم والتحدي
  const latestBadge = await Badge.findOne({ userId, challengeId }).sort({ weekNumber: -1 }).lean();
  const latestPunishment = await Punishment.findOne({ userId, challengeId }).sort({ weekNumber: -1 }).lean();

  let lastWeekNumber = 0;
  if (latestBadge && latestPunishment) {
    lastWeekNumber = Math.max(latestBadge.weekNumber, latestPunishment.weekNumber);
  } else if (latestBadge) {
    lastWeekNumber = latestBadge.weekNumber;
  } else if (latestPunishment) {
    lastWeekNumber = latestPunishment.weekNumber;
  }
  
  const currentWeekNumber = lastWeekNumber + 1; // إذا لم يكن هناك سجل، يكون الأسبوع الحالي 1

  // الحصول على تحدي المستخدم وتحدي 60 المعلن المرتبط به
  const challenge = await Challenge.findById(challengeId).populate("announcedChallengeId").lean();
  if (!challenge || !challenge.announcedChallengeId) {
    throw new Error("تعذر العثور على التحدي أو بيانات التحدي المعلن.");
  }
  
  // تاريخ بدء تحدي 60 المعلن
  const startDate = new Date(challenge.announcedChallengeId.startDate);
  
  // حساب بداية الأسبوع الحالي: إضافة (currentWeekNumber - 1) * 7 يومًا إلى تاريخ البدء
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() + (currentWeekNumber - 1) * 7);
  
  // نهاية الأسبوع الحالي: بداية الأسبوع + 6 أيام
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    currentWeekNumber,
    weekStart,
    weekEnd,
  };
});

module.exports = { getCurrentWeekInfo };
