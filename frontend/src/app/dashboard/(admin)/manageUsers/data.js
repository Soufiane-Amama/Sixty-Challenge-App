// بيانات افتراضية للمستخدمين تمثل البيانات من الخادم
const users = [
  {
    _id: 1, // معرف المستخدم
    fullName: "سفيان عماما",
    gender: "بطل",
    country: "الجزائر",
    dateOfBirth: "2004-08-25", // تاريخ الميلاد
    instagramName: "", // غير موجود
    email: "user@example.com",
    isAdmin: true,
    about: "تجري الرياح بما لا تشتهي السفن نحن الرياح ونحن البحر والسفن..",
    createdAt: "2023-09-15", // تاريخ التسجيل
  },
  {
    _id: 2,
    fullName: "محمد سالم",
    gender: "بطل",
    country: "موريتانيا",
    dateOfBirth: "2004-08-25", // تاريخ الميلاد
    instagramName: "Tag_instagram", // اسم المستخدم في انستجرام
    email: "user@example.com",
    isAdmin: true,
    about: "",
    createdAt: "2023-09-15", // تاريخ التسجيل
  },
  {
    _id: 3,
    fullName: "صفاء السعيد",
    gender: "بطلة",
    country: "مصر",
    dateOfBirth: "2004-08-25", // تاريخ الميلاد
    instagramName: "Tag_instagram",
    email: "user@example.com",
    isAdmin: true,
    about: "",
    createdAt: "2023-09-15", // تاريخ التسجيل
  },
];

export default users;
