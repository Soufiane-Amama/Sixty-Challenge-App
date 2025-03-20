const mongoose = require("mongoose");

const punishmentSchema = new mongoose.Schema(
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
    weekNumber: { type: Number, required: true }, // رقم الأسبوع
    executed: { type: Boolean, default: false }, // تم تنفيذ العقوبة
  },
  { timestamps: true }
);

const Punishment = mongoose.model("Punishment", punishmentSchema);
module.exports = Punishment;
