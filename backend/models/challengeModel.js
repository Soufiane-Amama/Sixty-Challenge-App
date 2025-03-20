const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    userId: {  // معرف المستخدم
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    announcedChallengeId: { type: mongoose.Schema.Types.ObjectId, ref: "AnnouncedChallenge", required: false }, // معرف التحدي المعلن
    personalGoal: { type: String, required: true }, // الهدف الشخصي
    sleepTime: { type: String, required: true }, // وقت النوم مثال: 22:00
    wakeTime: { type: String, required: true }, // وقت الاستيقاظ مثال: 06:00
    punishment: { type: String, required: true }, // العقوبة المختارة
    // additionalHabits: [ // قائمة العادات الإضافية
    //   {
    //     name: { type: String, required: true }, // اسم العادة (مثل "قراءة القرآن")
    //     points: { type: Number, default: 1 }, // نقطة إضافية أو خصم
    //   },
    // ],
    additionalHabits: [{ type: String }], // قائمة العادات الإضافية
    status: { type: String, enum: ["جاري", "منتهي", "متوقف"], default: "جاري" }, // حالة التحدي
    challengePoints: { type: Number, default: 0 }, // مجموع النقاط في هذا التحدي
  },
  { timestamps: true }
);


const Challenge = mongoose.model("Challenge", challengeSchema);
module.exports = Challenge;
