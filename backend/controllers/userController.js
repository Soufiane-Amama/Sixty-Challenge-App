const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler'); //  تُستخدم لتبسيط التعامل مع الأخطاء في الدوال غير المتزامنة (asynchronous) في التطبيق 
// دالة asyncHandler تقوم بلف (wrap) دوالك الغير المتزامنة وتلتقط أي أخطاء يتم رميها تلقائيًا. هذا يعني أنك لا تحتاج إلى استخدام try/catch يدويًا في كل دالة غير متزامنة وتكرار الكود.
const User = require('../models/userModel');
const generateToken = require('../helpers/generateToken');
const { createTransporter, createMailOptions } = require('../helpers/email');
const generateVerificationCode = require("../helpers/generateVerificationCode");


// إعدادات الكوكيز
const cookieOptions = {
  httpOnly: true, // يجعل التوكن غير متاح للوصول عبر JavaScript في الواجهة الأمامية، مما يزيد من الأمان.
  secure: process.env.NODE_ENV === 'production', // اذا كان متغير البيئة هو production ستكون النتيجة secure: true وذلك يعني يتم استخدام https فقط في بيئة الإنتاج تستخدم ذلك فقط اذا اتيح لك https لتشغيل HTTPS في بيئة الإنتاج، تحتاج إلى شهادة SSL .. اما اذا كانت البيئة development  ستكون النتيجة secure: false وذلك يعني يتم استخدام http فقط . 
  sameSite: 'none', // ليتم إرسال الكوكيز مع جميع الطلبات، حتى إذا كانت تأتي من نطاقات مختلفة.
  maxAge: 7 * 24 * 60 * 60 * 1000, // مدة التوكن 7 أيام
};


// Register a user
const registerUser = asyncHandler(async (req, res) => {
  // Validate input
  await body('password').isLength({ min: 6 }).withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل').run(req);
  await body('email').isEmail().withMessage('يرجى ادخال بريد إلكتروني صالح').run(req);
  await body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب').run(req);


  const errors = validationResult(req); // تمرير البيانات لعمل Validate input
  if (!errors.isEmpty()) { // الدالة isEmpty() تُستخدم للتحقق مما إذا كان كائن الأخطاء errors فارغًا أم لا. - الشرط يعني "إذا لم يكن كائن الأخطاء فارغًا"، أي إذا كان هناك أخطاء في التحقق. 
      // تحويل الأخطاء إلى كائن مع اسم الحقل كالمفتاح
      const formattedErrors = {};
      errors.array().forEach((error) => {
        if (error.path) {
          formattedErrors[error.path] = error.msg;
        }
      });
    return res.status(400).json({ errors: formattedErrors });
}

  const { fullName, gender, dateOfBirth, country, email, password, instagramName } = req.body;

  try {
      const user = await User.register(fullName, gender, dateOfBirth, country, email, password, instagramName);

      if (user) {
          res.status(201).json({ message: "تم إنشاء حسابك بنجاح" });
      } else {
          res.status(400).json({ error: 'بيانات المستخدم غير صالحة' });
      }
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


// Login a user 
const loginUser = asyncHandler(async (req, res) => {
  // Validate input
  await body('email').isEmail().withMessage('يرجى ادخال البريد الالكتروني').run(req);
  await body('password').notEmpty().withMessage('كلمة المرور مطلوبة').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // تحويل الأخطاء إلى كائن مع اسم الحقل كالمفتاح
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (error.path) {
        formattedErrors[error.path] = error.msg;
      }
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  const { email, password } = req.body;

  try {
      const user = await User.login(email, password);

      if (user) {
          // إنشاء التوكن
          const token = generateToken(user._id);

          // إرسال التوكن كـ httpOnly كوكي
          res.cookie('token', token, cookieOptions);
          // console.log('Cookies Sent:', res.getHeaders()['set-cookie']);
          
          res.status(200).json({ message: "تسجيل الدخول ناجح", user });
      } else {
          res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صالحة' });
      }
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


// Account recovery 
const accountRecovery = asyncHandler(async (req, res) => {
        // Validate input
        await body('email').isEmail().withMessage('يجب أن يكون البريد الإلكتروني صالحًا').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email }) // find user
      if (!user) {
        return res.status(400).json({ error: 'بريد الكتروني غير صالح' });
      }

      const verificationCode = generateVerificationCode();

      // تخزين رمز التحقق في الكوكيز
      res.cookie('verificationCode', verificationCode, cookieOptions);
      res.cookie('verificationCodeExpires', Date.now() + 3600000, cookieOptions);

        // طباعة الرمز المخزن في الجلسة للتأكد
        // console.log('Generated Verification Code:', verificationCode);

        // تجهيز الرسالة
        const transporter = createTransporter();
        const mailOptions = createMailOptions(email, verificationCode);
  
          // إرسال البريد الإلكتروني
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log(error);
            return res.status(500).json({ error: 'فشل في إرسال رسالة التحقق' });
            } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني" });
            } 
          });

    } catch (error) {
      res.status(500).send({error: error.message});
    }
});


// Reset Password 
const resetPassword = asyncHandler(async (req, res) => {
    // Validate input
    await body('email').isEmail().withMessage('Valid email is required').run(req);
    await body('code').notEmpty().withMessage('Verification code is required').run(req);
    await body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').run(req);
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, code, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });

        // استخراج رمز التحقق وتاريخ انتهاء الصلاحية من الكوكيز
        const verificationCode = req.cookies.verificationCode;
        const verificationCodeExpires = req.cookies.verificationCodeExpires;

        // طباعة القيم للتحقق
        console.log('Stored Verification Code:', verificationCode);
        console.log('Code from Request:', code);
        console.log('Verification Code Expires At:', verificationCodeExpires);
        console.log('Current Time:', Date.now());
  
      if (!verificationCode || verificationCode !== code || Date.now() > verificationCodeExpires) {
        return res.status(400).json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' });
      }

      const isPasswordUsed = await bcrypt.compare(newPassword, user.password) // تجزئة كلمة المرور ومقارنتها - الجواب سيكون true او false
      if (isPasswordUsed) {
        throw Error('كلمة المرور المستخدمة حالياً هي نفسها')
      } 
  
      user.password = newPassword;
      await user.save();
  
      // إزالة الكوكيز بعد تغيير كلمة المرور
      res.clearCookie('verificationCode');
      res.clearCookie('verificationCodeExpires');
  
      res.status(200).json({ message: 'تم تحديث كلمة المرور بنجاح' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


// Get Users
const getUsers = asyncHandler(async (req, res) => {
  try {
      const users = await User.find({}).select("-password");
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('لم يتم العثور على المستخدم');
  }
});


// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const updates = req.body;

  // تحقق من كلمة المرور
  const isMatch = await user.matchPassword(updates.pssword);
    if (!isMatch) {
        throw new Error("كلمة المرور غير صحيحة");
        // return res.status(404).json({ message: "كلمة المرور غير صحيحة" });
    }

  const user = await User.findById(req.user._id);

  if (user) {
    // تحديث الحقول المطلوبة فقط
    Object.keys(updates).forEach((key) => {
        user[key] = updates[key];
    });

    const updatedUser = await user.save();

    // إرسال الرد مع بيانات المستخدم المحدثة ورسالة النجاح
    res.json({ message: 'تم تطبيق التعديلات بنجاح', user: updatedUser });
  } else {
    res.status(404);
    throw new Error('لم يتم العثور على المستخدم');
  }
});


// Delete Profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) { // نقوم بالتحقق اذا كان id صالح ام لا ويتبع الشروط والمعايير
      return res.status(404).json({error: 'لا يوجد هذا الحساب'})
    } 

      // تحقق من كلمة المرور
      const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          throw new Error("كلمة المرور غير صحيحة");
          // return res.status(404).json({ message: "كلمة المرور غير صحيحة" });
      }

      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'لم يتم العثور على الحساب' });
      } 
      await User.deleteOne({ _id: id });
      res.status(200).json({ message: 'تم حذف الحساب' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// Update user by admin
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const updates = req.body;

  // التحقق من صحة الـ ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: 'No such user' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "غير مسموح إلا للمسؤولين" });
  }

  const user = await User.findById(userId);

  if (user) {
    // تحديث الحقول المطلوبة فقط
    Object.keys(updates).forEach((key) => {
        user[key] = updates[key];
    });
    
    const updatedUser = await user.save();
    
    // إرسال الرد 
    res.json({ message: 'تم تعديل المستخدم بنجاح', user: updatedUser });
  } else {
    res.status(404).json({ error: 'لم يتم العثور على المستخدم' });
  }
});


// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) { // نقوم بالتحقق اذا كان id صالح ام لا ويتبع الشروط والمعايير
      return res.status(404).json({error: 'لا يوجد هذا المستخدم'})
    } 

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح إلا للمسؤولين" });
    }

      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
      } 
      await User.deleteOne({ _id: id });
      res.status(200).json({ message: 'تم حذف المستخدم' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // التحقق من وجود الحقول
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new Error("يرجى ملء جميع الحقول المطلوبة");
  }

  // تأكد أن المستخدم مسجّل الدخول
  if (!req.user) {
    throw new Error("يجب تسجيل الدخول");
  }

  // جلب المستخدم من قاعدة البيانات
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

    // تحقق من كلمة المرور القديمة
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      throw new Error("كلمة المرور القديمة غير صحيحة");
    }

  // تحقق من تطابق كلمة المرور الجديدة وإعادة التأكيد
  if (newPassword !== confirmPassword) {
    throw new Error("كلمة المرور الجديدة وإعادة التأكيد غير متطابقتين");
  }

  // تحقق من طول كلمة المرور الجديدة
  if (newPassword.length < 8) {
    throw new Error("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
  }

   // تحديث كلمة المرور
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
});


// Logout a user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: cookieOptions.httpOnly,
    expires: new Date(0),
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
  });

  res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
});


module.exports = {
    registerUser,
    loginUser,
    accountRecovery,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUsers,
    updateUser,
    deleteUser,
    changePassword,
    logoutUser,
};