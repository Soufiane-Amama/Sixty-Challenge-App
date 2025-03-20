const asyncHandler = require("express-async-handler");
const AiNotification = require("../models/AI.NotificationModel");


// 📌 معالج لجلب الرسالة التحفيزية الأخيرة للمستخدم
const getMotivationalMessage = asyncHandler(async (req, res) => {
  const motivationalMessage = await AiNotification.findOne({
    userId: req.user._id,
    type: "تحفيز",
  }).sort({ createdAt: -1 });

  if (!motivationalMessage) {
    return res.status(404).json({ message: "لا توجد رسالة تحفيزية متاحة" });
  }

  res.status(200).json({ message: motivationalMessage.message });
});


// 📌 معالج لجلب رسالة التوصيات الأخيرة للمستخدم
const getRecommendationMessage = asyncHandler(async (req, res) => {
  const recommendationMessage = await AiNotification.findOne({
    userId: req.user._id,
    type: "توصيات",
  }).sort({ createdAt: -1 });

  if (!recommendationMessage) {
    return res.status(404).json({ message: "لا توجد رسالة توصيات متاحة" });
  }

  res.status(200).json({ message: recommendationMessage.message });
});


// جلب الإشعارات الخاصة بالمستخدم
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await AiNotification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

module.exports = { 
  getMotivationalMessage,
  getRecommendationMessage,
  // getNotifications, 
};