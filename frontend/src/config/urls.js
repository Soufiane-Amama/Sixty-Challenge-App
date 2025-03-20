// الملف المسؤول عن مسارات الطلبات التي ترسل الى الخادم

// User URLs
export const REGISTER_URL = "/api/user/register"; // مسار تسجيل حساب جديد
export const LOGIN_URL = "/api/user/login"; // مسار تسجيل الدخول
export const LOGOUT_URL = "/api/user/logout"; // مسار تسجيل الخروج 
export const PROFILE_URL = "/api/user/profile"; 
export const UPDATE_MY_PROFILE_URL = "/api/user/profile"; 
export const CHANGE_PASSWORD_URL = "/api/user/change-password";
export const ACCOUNT_RECOVERY_URL = "/api/user/account-recovery";
export const RESET_PASSWORD_URL = "/api/user/reset-password";
export const GET_PENDING_ACCCOUNTS_URL = "/api/user/pending-accounts";
export const UPDATE_ACCCOUNT_STATUS_URL = "/api/user/accounts/status";
export const UPDATE_ACCCOUNT_URL = "/api/user";
export const DELETE_ACCCOUNT_URL = "/api/user";

// هنا يمكنك اضافة باقي المسارات مع التنسيق مع مبرمج الباك اند...

// Announced Challenge URLs
export const GET_CHALLENGES_URL = "/api/announced-challenge";
export const CREATE_CHALLENGE_URL = "/api/announced-challenge";
export const UPDATE_CHALLENGE_URL = "/api/announced-challenge";
export const DELETE_CHALLENGE_URL = "/api/announced-challenge";

// My Challenge URLs 
export const GET_MY_CHALLENGES_URL = "/api/challenge";
export const PARTICICPATE_CHALLENGE_URL = "/api/challenge";
export const STOP_CHALLENGE_URL = "/api/challenge";
export const DELETE_MY_CHALLENGE_URL = "/api/challenge";


// Daily Progress URLs 
export const DOCUMENT_DAY_URL = "/api/daily-progress";


// AI Notification URLs 
export const GET_RECOMMENDATIONS_URL = "/api/ai-notification/recommendation";
