const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Challenge = require("../models/challengeModel");
const AnnouncedChallenge = require("../models/announcedChallengeModel");
const AiNotification = require("../models/AI.NotificationModel");

// المشاركة في تحدٍ جديد للمستخدم
const createChallenge = asyncHandler(async (req, res) => {
  await body("personalGoal").notEmpty().withMessage("الهدف الشخصي مطلوب").run(req);
  await body("sleepTime").notEmpty().withMessage("وقت النوم مطلوب").run(req);
  await body("wakeTime").notEmpty().withMessage("وقت الاستيقاظ مطلوب").run(req);
  await body("punishment").notEmpty().withMessage("العقوبة مطلوبة").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (error.path) formattedErrors[error.path] = error.msg;
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  const { personalGoal, sleepTime, wakeTime, punishment, additionalHabits, announcedChallengeId } = req.body;

  // التحقق من أن وقت الاستيقاظ بعد وقت النوم
  if (new Date(wakeTime) <= new Date(sleepTime)) {
    return res.status(400).json({ message: "وقت الاستيقاظ يجب أن يكون بعد وقت النوم" });
  }

  // التحقق مما إذا كان المستخدم لديه تحدي 60 "جاري"
  const activeChallenge = await Challenge.findOne({
    userId: req.user._id,
    status: "جاري",
  });

  if (activeChallenge) {
    return res.status(400).json({
      message: "لا يمكنك الانضمام إلى تحدٍ جديد قبل إنهاء التحدي الجاري أو إيقافه.",
    });
  }

  // التحقق من أن announcedChallengeId صالح إذا تم تقديمه
  if (announcedChallengeId) {
    const exists = await AnnouncedChallenge.findById(announcedChallengeId).lean();
    if (!exists) {
      return res.status(400).json({ message: "التحدي المعلن غير موجود" });
    }

    // التحقق مما إذا كان المستخدم قد شارك في نفس التحدي المعلن مسبقًا
    const alreadyJoined = await Challenge.findOne({
      userId: req.user._id,
      announcedChallengeId: announcedChallengeId,
    });

    if (alreadyJoined) {
      return res.status(400).json({
        message: "لقد شاركت بالفعل في هذا التحدي المعلن، لا يمكنك المشاركة مرة أخرى.",
      });
    }
  }

  // إنشاء التحدي الجديد
  const challenge = await Challenge.create({
    userId: req.user._id,
    personalGoal,
    sleepTime,
    wakeTime,
    punishment,
    additionalHabits: additionalHabits || [],
    announcedChallengeId: announcedChallengeId || null,
    challengePoints: 0,
  });

  // إنشاء رسالة ترحيب
  const welcomeMessage = `أهلاً وسهلاً بك يا ${req.user.fullName} في تحديك الشخصي! استعد لرحلة ستينية رائعة!`;

  res.status(201).json({ message: welcomeMessage , challenge });
});

// جلب التحديات الخاصة بالمستخدم 
const getUserChallenges = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // تعيين الوقت إلى بداية اليوم لمقارنته بدقة

  // جلب تحديات المستخدم مع معلومات التحديات المعلنة
  const challenges = await Challenge.find({ userId: req.user._id })
    .populate("announcedChallengeId")
    .lean();

  // تحديث حالة التحديات المنتهية
  const updatedChallenges = await Promise.all(
    challenges.map(async (challenge) => {
      if (
        challenge.announcedChallengeId &&
        new Date(challenge.announcedChallengeId.endDate).getTime() === today.getTime()
      ) {
        // إذا انتهى التحدي المعلن، نحدّث حالة التحدي إلى "منتهي"
        await Challenge.findByIdAndUpdate(challenge._id, { status: "منتهي" });

        // نعيد التحدي بعد التعديل مع الحالة المحدثة
        return { ...challenge, status: "منتهي" };
      }
      return challenge; // إذا لم ينتهِ التحدي، نعيده كما هو
    })
  );

  res.status(200).json(updatedChallenges);
});

// جلب تفاصيل تحدي معين 
const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id)
    .populate("announcedChallengeId")
    .lean();
  if (!challenge) {
    return res.status(404).json({ message: "التحدي غير موجود" });
  }
  res.status(200).json(challenge);
});

// تحديث تحدي مع ضبط القيم المسموح بتعديلها
const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: "التحدي غير موجود" });
  }

  if (challenge.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "غير مصرح لك بتعديل هذا التحدي" });
  }

  // ✅ السماح بتعديل الحقول التالية فقط
  const allowedUpdates = ["personalGoal", "sleepTime", "wakeTime", "punishment", "additionalHabits"];
  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdates.includes(key)) delete req.body[key];
  });

  // ✅ التحقق من صحة sleepTime و wakeTime عند التعديل
  if (req.body.sleepTime && req.body.wakeTime) {
    if (new Date(req.body.wakeTime) <= new Date(req.body.sleepTime)) {
      return res.status(400).json({ message: "وقت الاستيقاظ يجب أن يكون بعد وقت النوم" });
    }
  }

  Object.assign(challenge, req.body);
  await challenge.save();

  res.status(200).json({ message: "تم تحديث التحدي بنجاح", challenge });
});

// تعديل حالة التحدي
const updateChallengeStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.body;

  // التحقق من وجود التحدي
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    return res.status(404).json({ message: "التحدي غير موجود" });
  }

  // التحقق من أن المستخدم هو صاحب التحدي
  if (challenge.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "غير مصرح لك بتعديل هذا التحدي" });
  }

  // التحقق من تقديم حالة جديدة
  if (!status) {
    return res.status(400).json({ message: "يجب تقديم حالة جديدة للتحدي" });
  }

  // الحالات المسموح بها
  const allowedStatuses = ["جاري", "منتهي", "متوقف"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "حالة التحدي غير صالحة" });
  }

  // ✅ منع تعديل التحدي إذا كان "منتهي"
  if (challenge.status === "منتهي") {
    return res.status(400).json({ message: "لا يمكن تغيير حالة التحدي بعد انتهائه" });
  }

  // ✅ منع تعديل التحدي إذا كان "متوقف"
  if (challenge.status === "متوقف") {
    return res.status(400).json({ message: "لا يمكن تغيير حالة التحدي بعد إيقافه" });
  }

  // تحديث الحالة فقط
  challenge.status = status;
  await challenge.save();

  res.status(200).json({ message: "تم تحديث حالة التحدي بنجاح", challenge });
});


const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.body.id);
  if (!challenge) {
    return res.status(404).json({ message: "التحدي غير موجود" });
  }

  const deletedChallenge = await challenge.deleteOne();
  res.status(200).json({ message: "تم حذف التحدي بنجاح", challenge: deletedChallenge });
});


module.exports = {
  createChallenge,
  getUserChallenges,
  // getChallengeById,
  // updateChallenge,
  updateChallengeStatus,
  deleteChallenge,
};
