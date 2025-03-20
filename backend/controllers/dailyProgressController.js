const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const DailyProgress = require("../models/dailyProgressModel");
const AnnouncedChallenge = require("../models/announcedChallengeModel");
const Challenge = require("../models/challengeModel");
const AiNotification = require("../models/AI.NotificationModel");
const { generateMotivationalMessage } = require("../helpers/aiService");


const createDailyProgress = asyncHandler(async (req, res) => {
  // التحقق من المدخلات
  await body("challengeId").notEmpty().withMessage("معرف التحدي مطلوب").run(req);
  await body("tasks").isObject().withMessage("المهام مطلوبة").run(req);
  await body("additionalHabits").isArray().withMessage("العادات الإضافية يجب أن تكون قائمة").run(req);
  await body("additionalHabits.*.habit").isString().notEmpty().withMessage("يجب أن تحتوي كل عادة على اسم صحيح").run(req);
  await body("additionalHabits.*.completed").isBoolean().withMessage("حالة العادة يجب أن تكون صحيحة").run(req);


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (error.path) formattedErrors[error.path] = error.msg;
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  const { challengeId, tasks, additionalHabits } = req.body;

  // التحقق من صحة التحدي وصلاحيته للمستخدم
  const challenge = await Challenge.findById(challengeId);
  if (!challenge || challenge.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "تحدٍ غير موجود أو غير مسموح" });
  }

  // إذا كان التحدي الشخصي مرتبطًا بتحدي معلن، نقوم بالتحقق من مواعيده
  if (challenge.announcedChallengeId) {
    const announcedChallenge = await AnnouncedChallenge.findById(challenge.announcedChallengeId);
    if (!announcedChallenge) {
      return res.status(400).json({ error: "التحدي المعلن غير موجود" });
    }
    const now = new Date();
    if (now < new Date(announcedChallenge.startDate)) {
      return res.status(400).json({ error: "لم يبدأ تحدي 60 بعد" });
    }
    if (now >= new Date(announcedChallenge.endDate)) {
      return res.status(400).json({ error: "انتهى تحدي 60، لا يمكن توثيق التقدم اليومي" });
    }
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const existingProgress = await DailyProgress.findOne({ challengeId, date: new Date(today) });

  if (existingProgress) {
    if (existingProgress.isLocked) {
      return res.status(400).json({ error: "تم توثيق اليوم بالفعل" });
    }
    return res.status(400).json({ error: "لقد قمت بإدخال التقدم لهذا اليوم بالفعل" });
  }

  // تحديد القيم الافتراضية للمهام الأساسية الجديدة
  const defaultTasks = {
    sleepSchedule: { completed: false, points: 1 },
    wakeUpSchedule: { completed: false, points: 1 },
    selfLearning: { completed: false, points: 2 },
    prayers: { completed: false, points: 2 },
    personalGoalProgress: { completed: false, points: 2 },
    sports: { completed: false, points: 1 },
    reward: { completed: false, points: 1 },
  };

  // دمج القيم المستلمة مع الافتراضية
  const mergedTasks = { ...defaultTasks, ...tasks };

  // حساب النقاط المكتسبة اليوم (قبل الإنشاء)
  const dailyPoints = Object.values(mergedTasks)
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0) - 
    // خصم نقطة لكل عادة إضافية لم تنفذ
    additionalHabits.filter(habit => {
      // يفترض أن additionalHabits تحتوي على كائنات من النوع { habit, completed }
      return !habit.completed;
    }).length;

  // إنشاء سجل التقدم اليومي
  const dailyProgress = await DailyProgress.create({
    userId: req.user._id,
    challengeId,
    date: today,
    tasks: mergedTasks,
    additionalHabits,
    dailyPoints, 
    isLocked: true,
  });

  // تحديث مجموع النقاط في التحدي
  challenge.challengePoints += dailyPoints;
  await challenge.save();

  // تحديث مجموع النقاط في حساب المستخدم
  const user = await User.findById(req.user._id);
  if (user) {
    user.totalPoints += dailyPoints;
    await user.save();
  }

  // إنشاء رسالة تحفيزية باستخدام الذكاء الاصطناعي
  const completedTasks = Object.keys(mergedTasks).filter((task) => mergedTasks[task].completed);
  let motivationalMessage;
  try {
    motivationalMessage = await generateMotivationalMessage({
      userId: req.user._id,
      fullName: req.user.fullName,
      dailyPoints,
      completedTasks,
    });
    if (!motivationalMessage) {
      throw new Error("لم يتم إرجاع رسالة تحفيزية من الذكاء الاصطناعي");
    }
  } catch (error) {
    console.warn("⚠️ خطأ في توليد الرسالة التحفيزية:", error.message);
    motivationalMessage = "أحسنت! تقدم رائع اليوم، استمر في هذا الأداء المتميز! 💪🚀";
  }

  // حذف أي رسالة تحفيزية سابقة للمستخدم
  await AiNotification.deleteMany({ userId: req.user._id, type: "تحفيز" });

  // حفظ الرسالة التحفيزية الجديدة في قاعدة البيانات
  await AiNotification.create({
    userId: req.user._id,
    type: "تحفيز",
    message: motivationalMessage,
  });

  res.status(201).json({ message: "تم توثيق اليوم بنجاح", dailyProgress });
});


const getUserDailyProgressGrouped = asyncHandler(async (req, res) => {
  // نستخدم aggregation pipeline لتجميع سجلات التوثيق اليومي للمستخدم حسب challengeId
  const groupedProgress = await DailyProgress.aggregate([
    { 
      $match: { 
        userId: req.user._id 
      } 
    },
    // ربط بيانات التحدي من مجموعة التحديات (تأكد من أن اسم المجموعة هنا هو "challenges")
    {
      $lookup: {
        from: "challenges",
        localField: "challengeId",
        foreignField: "_id",
        as: "challengeDetails"
      }
    },
    // إذا كان هناك أكثر من سجل مرتبط بالتحدي، نقوم بفك التجميع
    { $unwind: "$challengeDetails" },
    // تجميع السجلات حسب challengeId
    {
      $group: {
        _id: "$challengeId",
        challenge: { $first: "$challengeDetails" },
        dailyRecords: { $push: "$$ROOT" }
      }
    },
    // يمكن ترتيب النتائج حسب challengeNumber أو أي معيار آخر إذا كان متاحاً في challengeDetails
    { $sort: { "challenge.challengePoints": -1 } } // مثال على ترتيب تنازلي حسب challengePoints
  ]);

  res.status(200).json(groupedProgress);
});


// معالج لجلب جميع سجلات التقدم اليومي لتحدي معين
const getDailyProgressByChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.body;

  if (!challengeId) {
    return res.status(400).json({ error: "معرف التحدي مطلوب" });
  }

  // البحث عن سجلات التقدم اليومي المرتبطة بالتحدي وترتيبها حسب التاريخ تصاعديًا
  const dailyProgressRecords = await DailyProgress.find({ challengeId })
    .sort({ date: 1 });

  if (!dailyProgressRecords || dailyProgressRecords.length === 0) {
    return res.status(404).json({ message: "لا توجد سجلات توثيق لهذا التحدي" });
  }

  res.status(200).json({ dailyProgress: dailyProgressRecords });
});


// معالج لحذف سجل تقدم يومي معين
const deleteDailyProgress = asyncHandler(async (req, res) => {
  const { dailyProgressId } = req.params;

  // البحث عن السجل المطلوب حذفه
  const dailyProgress = await DailyProgress.findById(dailyProgressId);
  if (!dailyProgress) {
    return res.status(404).json({ message: "سجل التقدم اليومي غير موجود" });
  }

  // التأكد من أن المستخدم هو مالك السجل قبل الحذف
  if (dailyProgress.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذا السجل" });
  }

  // حذف السجل
  await DailyProgress.findByIdAndDelete(dailyProgressId);

  // تحديث مجموع النقاط للمستخدم بعد الحذف
  const totalPoints = await DailyProgress.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: null, total: { $sum: "$dailyPoints" } } }
  ]);

  await User.findByIdAndUpdate(req.user._id, {
    totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
  });

  res.status(200).json({ message: "تم حذف سجل التقدم اليومي بنجاح" });
});


module.exports = { createDailyProgress, getDailyProgressByChallenge, getUserDailyProgressGrouped, deleteDailyProgress };
