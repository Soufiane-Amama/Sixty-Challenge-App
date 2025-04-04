import { FiHome, FiUsers, FiTarget, FiCheckSquare, FiBarChart, FiCode, FiAward, FiSettings, FiUser } from "react-icons/fi";
import { FiUserCheck, FiEdit, FiTrash2 } from "react-icons/fi";
import { MdQrCode } from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi"; 

//  هذه قائمة الصفحات تظهر لجميع المستخدمين
export const userMenu = [
  { key: "dashboard", label: "الصفحة الرئيسية", icon: FiHome },
  { key: "profile", label: "الملف الشخصي", icon: FiUser },
  { key: "champions", label: "صفحة الأبطال", icon: FiUsers },
  { key: "announcedChallenges", label: "تحديات 60 المعلنة", icon: FiTarget },
  { key: "myChallenges", label: "صفحة تحدياتي", icon: FiCheckSquare },
  { key: "weeklyPerformance", label: "تحليل الأداء الأسبوعي", icon: FiBarChart },
  { key: "mindmap", label: "إنشاء خريطة", icon: BiNetworkChart },
  { key: "qrScanner", label: "صفحة قراءة QR", icon: MdQrCode },
  { key: "achievements", label: "صفحة إنجازاتي", icon: FiAward },
  { key: "settings", label: "الإعدادات", icon: FiSettings }, 
];

// هذه قائمة الصفحات تظهر فقط للمشرف
export const adminMenu = [
  ...userMenu, // إضافة جميع صفحات المستخدم العادي
  { key: "manageChallenges", label: "إدارة التحديات المعلنة", icon: FiEdit },
  { key: "manageUsers", label: "إدارة المستخدمين", icon: FiUserCheck },
];
