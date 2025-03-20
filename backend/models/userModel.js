const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// لتحقق من بيانات التسجيل استخدمنا حزمة validator بدلا من القيام بالكثير من regex للتحقق من البريد وكلمة المرور
const validator = require('validator');


const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["بطل", "بطلة"], required: true, },
    country: { type: String, required: true },
    dateOfBirth: { type: Date, required: true, },
    instagramName: { type: String, default: null, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    about: { type: String, default: "", },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


// static register method
userSchema.statics.register = async function(fullName, gender, dateOfBirth, country, email, password, instagramName) { // لم استخدم الوظيفة السهمية بسبب ان this لا تشتغل فيها 

    // validation
    if (!fullName || !email || !password || !country || !gender) {
      throw Error('يجب ملء جميع الحقول')
    }
    if (!validator.isEmail(email)) {
      throw Error('البريد الإلكتروني غير صالح')
    }
    if (!validator.isStrongPassword(password)) {
      throw Error('كلمة المرور يجب أن تحتوي على أرقام وحرف كبير وصغير ورمز على الأقل')
    }
  
    const emailExists = await this.findOne({ email });
    if (emailExists) {
      throw Error('البريد الإلكتروني أو كلمة المرور غير صالحة');
    }
  
    const user = await this.create({ fullName, gender, dateOfBirth, email, password, country, instagramName });
  
    return user
};


// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('يجب ملء جميع الحقول')
  }

  const user = await this.findOne({ email }) // find user
  if (!user) {
    throw Error('البريد الإلكتروني أو كلمة المرور غير صالحة')
  }

  const match = await bcrypt.compare(password, user.password) // تجزئة كلمة المرور ومقارنتها - الجواب سيكون true او false
  if (!match) {
    throw Error('البريد الإلكتروني أو كلمة المرور غير صالحة')
  }

  return user
};


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.updateTotalPoints = async function () {
  const totalPoints = await mongoose.model("DailyProgress").aggregate([
    { $match: { userId: this._id } },
    { $group: { _id: null, total: { $sum: "$dailyPoints" } } }
  ]);

  this.totalPoints = totalPoints.length > 0 ? totalPoints[0].total : 0;
  await this.save();
};


const User = mongoose.model("User", userSchema);
module.exports = User;