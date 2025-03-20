const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    userId: { // معرف المستخدم
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: { // معرف التحدي
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    badgeType: { // نوع الشارة
      type: String,
      enum: ["ذهبية", "فضية", "برونزية", "مقبولة"],
      required: true,
    },
    weekNumber: { type: Number, required: true }, // رقم الأسبوع
    pointsEarned: { type: Number, required: true }, // النقاط التي أهلته للشارة
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
module.exports = Badge;
