export function calculateDaysRemaining(startDate) {
  const now = new Date();
  const start = new Date(startDate);

  // مدة التحدي الثابتة: 60 يومًا
  const challengeDuration = 60 * 24 * 60 * 60 * 1000; // 60 يومًا بالملي ثانية
  const end = new Date(start.getTime() + challengeDuration);

  // التأكد من أن التحدي قد بدأ بالفعل
  if (now < start) {
    return 60; // لم يبدأ التحدي بعد، المدة المتبقية كاملة
  }

  // حساب الأيام المتبقية من 60 يومًا
  const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  return daysRemaining > 0 ? daysRemaining : 0; // إذا انتهى التحدي، إرجاع 0
}
