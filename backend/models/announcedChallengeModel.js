const mongoose = require("mongoose");

const announcedChallengeSchema = new mongoose.Schema(
  {
    challengeNumber: { type: Number, required: true, unique: true }, // رقم التحدي الفريد
    title: { type: String, default: "تحدي الستين" }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String }, // وصف اختياري
  },
  { timestamps: true }
);

const AnnouncedChallenge = mongoose.model(
  "AnnouncedChallenge",
  announcedChallengeSchema
);
module.exports = AnnouncedChallenge;
