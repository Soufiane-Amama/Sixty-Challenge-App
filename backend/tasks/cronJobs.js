const cron = require("node-cron");
const Challenge = require("../models/challengeModel");
const { awardWeeklyOutcome } = require("../controllers/badgePunishmentController");

// تنفيذ الوظيفة كل يوم جمعة عند الساعة 8:00 صباحًا 
cron.schedule("0 8 * * 5", async () => {
  console.log("✅ بدء تنفيذ عملية توثيق الأسبوع تلقائيًا...");

  try {
    // جلب جميع المستخدمين الذين لديهم تحدي60 وحالته "جاري"
    const activeChallenges = await Challenge.find({ status: "جاري" });

    if (activeChallenges.length === 0) {
      console.log("⚠️ لا يوجد أي تحديات نشطة لتوثيق الأسبوع.");
      return;
    }

    for (const challenge of activeChallenges) {
      await awardWeeklyOutcome(challenge._id, challenge.userId);
    }

    console.log("✅ تم تنفيذ توثيق الأسبوع بنجاح لجميع المشاركين.");
  } catch (error) {
    console.error("❌ حدث خطأ أثناء تشغيل وظيفة `awardWeeklyOutcome`:", error);
  }
});

// تنفيذ الوظيفة كل يوم جمعة عند منتصف الليل (00:00)
// cron.schedule("0 0 * * 5", async () => {
// const runWeeklyProcessNow = async () => {
//     console.log("✅ بدء تنفيذ عملية توثيق الأسبوع تلقائيًا...");

//     try {
//       // جلب جميع المستخدمين الذين لديهم تحدي60 وحالته "جاري"
//       const activeChallenges = await Challenge.find({ status: "جاري" });

//       if (activeChallenges.length === 0) {
//         console.log("⚠️ لا يوجد أي تحديات نشطة لتوثيق الأسبوع.");
//         return;
//       }

//       for (const challenge of activeChallenges) {
//         await awardWeeklyOutcome(challenge._id, challenge.userId);
//       }

//       console.log("✅ تم تنفيذ توثيق الأسبوع بنجاح لجميع المشاركين.");
//     } catch (error) {
//       console.error("❌ حدث خطأ أثناء تشغيل وظيفة `awardWeeklyOutcome`:", error);
//     }
//   };

//   // استدعاء الوظيفة مباشرة
//   runWeeklyProcessNow();
