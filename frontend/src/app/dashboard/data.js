import { FiHome, FiUser, FiMenu, FiBook, FiClipboard, FiCheckCircle, FiUsers, FiUserCheck, FiBarChart } from "react-icons/fi"; 

// Example menuItems based on account type

//  هذه قائمة الصفحات تظهر لجميع المستخدمين
export const userMenu = [
  { key: "home", label: "الصفحة الرئيسية", icon: FiHome },
  { key: "educationalLevels", label: "المستويات", icon: FiBook },
  { key: "assignments", label: "التحديات", icon: FiClipboard },
  { key: "attendance", label: "جميع الابطال", icon: FiCheckCircle },
  { key: "studentPerformance", label: "المشاركين", icon: FiBarChart },
  { key: "events", label: "الأحداث والأنشطة", icon: FiUsers },
  { key: "contactAcademy", label: "تواصل مع الأكاديمية", icon: FiUser },
];

// هذه قائمة الصفحات تظهر فقط للمشرف
export const adminMenu = [
  { key: "home", label: "الصفحة الرئيسية", icon: FiHome },
  
  // إدارة المستخدمين
  { key: "manageNewUser", label: "المستخدمين الجدد", icon: FiUserCheck },
  { key: "manageStudents", label: "إدارة المستخدمين", icon: FiUsers },

  // الإدارة الأكاديمية
  { key: "manageAttendance", label: "إدارة التحديات", icon: FiCheckCircle },
  { key: "levelsManagement", label: "إدارة المسابقات", icon: FiBook },
  { key: "manageTeachingField", label: "المجالات", icon: FiClipboard },

  // الإدارة المالية
  { key: "subscriptionManagemen", label: "إدارة الاشتراكات", icon: FiBarChart },

  // الإعلانات والأحداث
  { key: "manageAnnouncements", label: "إدارة الإعلانات", icon: FiUsers },
  { key: "manageEvents", label: "إدارة الأحداث", icon: FiUsers },

  // التقارير والإعدادات
  { key: "reports", label: "التقارير والإحصائيات", icon: FiBarChart },
  { key: "settings", label: "الإعدادات العامة", icon: FiMenu },
];

