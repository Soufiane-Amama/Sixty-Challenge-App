const mongoose = require("mongoose");

const aiNotificationSchema = new mongoose.Schema(
  {
    userId: { // معرف المستخدم
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true }, 
    type: { type: String, enum: ["تحفيز", "توصيات"], required: true },
  },
  { timestamps: true }
);

const aiNotification = mongoose.model("AiNotification", aiNotificationSchema);
module.exports = aiNotification;
