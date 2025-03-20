const mongoose = require("mongoose");

const dailyProgressSchema = new mongoose.Schema(
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
    date: { type: Date, required: true, default: Date.now }, // تاريخ اليوم
    tasks: { // المهام الأساسية مع حالتها ونقاطها
      sleepSchedule: { // النوم السليم 
        completed: { type: Boolean, default: false }, 
        points: { type: Number, default: 1 } 
      },
      wakeUpSchedule: { // الاستيقاظ السليم 
        completed: { type: Boolean, default: false }, 
        points: { type: Number, default: 1 } 
      }, 
      selfLearning: { // التعلم الذاتي
        completed: { type: Boolean, default: false },
        points: { type: Number, default: 2 },
      },
      prayers: { // الصلوات
        completed: { type: Boolean, default: false },
        points: { type: Number, default: 2 },
      },
      personalGoalProgress: { // الهدف الشخصي
        completed: { type: Boolean, default: false },
        points: { type: Number, default: 2 },
      },
      sports: { // الرياضة
        completed: { type: Boolean, default: false },
        points: { type: Number, default: 1 },
      },
      reward: { // المكافئة
        completed: { type: Boolean, default: false },
        points: { type: Number, default: 1 },
      },
    },
    // additionalHabits: [ // العادات الإضافية مع حالتها.
    //   {
    //     name: { type: String, required: true }, // اسم العادة
    //     completed: { type: Boolean, default: false },
    //   },
    // ],
    additionalHabits: [ // تحديث العادات الإضافية بحيث تحتوي فقط على `habit` (الاسم) و `completed`
      {
        habit: { type: String, required: true }, // اسم العادة (يتطابق مع الموجود في Challenge)
        completed: { type: Boolean, default: false }, // تحديد ما إذا كانت مكتملة أم لا
      },
    ],
    dailyPoints: { type: Number, default: 0 }, // مجموع النقاط اليومية
    isLocked: { type: Boolean, default: false }, // تجميد بعد التوثيق
  },
  { timestamps: true }
);


// حساب النقاط اليومية تلقائيًا قبل الحفظ
dailyProgressSchema.pre("save", function (next) {
  const tasks = this.tasks;
  const habits = this.additionalHabits;

  // حساب مجموع النقاط للمهام الأساسية
  let totalPoints =
    (tasks.sleepSchedule.completed ? tasks.sleepSchedule.points : 0) + // ✅ النوم السليم
    (tasks.wakeUpSchedule.completed ? tasks.wakeUpSchedule.points : 0) + // ✅ الاستيقاظ السليم
    (tasks.selfLearning.completed ? tasks.selfLearning.points : 0) +
    (tasks.prayers.completed ? tasks.prayers.points : 0) +
    (tasks.personalGoalProgress.completed ? tasks.personalGoalProgress.points : 0) +
    (tasks.sports.completed ? tasks.sports.points : 0) +
    (tasks.reward.completed ? tasks.reward.points : 0);

  // خصم 1 نقطة عن كل عادة لم يتم تنفيذها
  totalPoints -= habits.filter(habit => !habit.completed).length;

  // تحديث مجموع النقاط اليومية
  this.dailyPoints = totalPoints;
  next();
});

// تحديث إجمالي النقاط للمستخدم بعد الحفظ
dailyProgressSchema.post("save", async function (doc) {
  try {
    const totalPoints = await mongoose.model("DailyProgress").aggregate([
      { $match: { userId: doc.userId } },
      { $group: { _id: null, total: { $sum: "$dailyPoints" } } }
    ]);

    await mongoose.model("User").findByIdAndUpdate(doc.userId, {
      totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
    });
  } catch (error) {
    console.error("خطأ أثناء تحديث النقاط الإجمالية:", error);
  }
});


const DailyProgress = mongoose.model("DailyProgress", dailyProgressSchema);
module.exports = DailyProgress;
