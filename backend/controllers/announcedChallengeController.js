const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const AnnouncedChallenge = require("../models/announcedChallengeModel");


// إنشاء تحد معلن جديد 
const createAnnouncedChallenge = asyncHandler(async (req, res) => {
  await body("challengeNumber").isInt({ min: 1 }).withMessage("رقم التحدي مطلوب ويجب أن يكون موجبًا").run(req);
  await body("startDate").isISO8601().withMessage("تاريخ البداية غير صالح").run(req);
  await body("endDate").isISO8601().withMessage("تاريخ النهاية غير صالح").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (error.path) formattedErrors[error.path] = error.msg;
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  const { challengeNumber, startDate, endDate, description } = req.body;

  // التحقق من أن المستخدم مسؤول
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "غير مسموح إلا للمسؤولين" });
  }

    // التحقق من أن تاريخ النهاية بعد تاريخ البداية
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية" });
    }  
  
  const exists = await AnnouncedChallenge.findOne({ challengeNumber });
  if (exists) {
    return res.status(400).json({ message: "رقم التحدي مستخدم بالفعل" });
  }

  const announcedChallenge = await AnnouncedChallenge.create({
    challengeNumber,
    title: `تحدي الستين ${challengeNumber}`,
    startDate,
    endDate,
    description,
  });

  res.status(201).json({ message: "تم إنشاء تحدي 60 بنجاح", announcedChallenge });
});


// جلب جميع التحديات المعلنة 
const getAnnouncedChallenges = asyncHandler(async (req, res) => {
  const announcedChallenges = await AnnouncedChallenge.find({}).sort({ challengeNumber: 1 });
  res.status(200).json(announcedChallenges);
});


// جلب تحدي معين
// const getAnnouncedChallengeById = asyncHandler(async (req, res) => {
//     const challenge = await AnnouncedChallenge.findById(req.params.id);
//     if (!challenge) {
//       return res.status(404).json({ message: "التحدي غير موجود" });
//     }
//     res.status(200).json(challenge);
// });


// تحديث تحدي
const updateAnnouncedChallenge = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح إلا للمسؤولين" });
    }
  
    const updatedChallenge = await AnnouncedChallenge.findByIdAndUpdate(
      req.body.id,
      req.body,
      { 
        new: true, // لإرجاع البيانات المحدثة.
        runValidators: true // لضمان تحقق Mongoose من القيم الجديدة قبل التحديث.
      }
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: "التحدي غير موجود" });
    }
    
    res.status(200).json({ message: "تم تحديث التحدي بنجاح", updatedChallenge  });
});


// حذف تحدي
const deleteAnnouncedChallenge = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح إلا للمسؤولين" });
    }
  
    const challenge = await AnnouncedChallenge.findById(req.body.id);
    if (!challenge) {
      return res.status(404).json({ message: "التحدي غير موجود" });
    }
  
    await challenge.deleteOne();
    res.status(200).json({ message: "تم حذف التحدي بنجاح" });
});


module.exports = {
    createAnnouncedChallenge,
    getAnnouncedChallenges,
    // getAnnouncedChallengeById,
    updateAnnouncedChallenge,
    deleteAnnouncedChallenge
};
