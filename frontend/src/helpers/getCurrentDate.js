// دالة للحصول على تاريخ اليوم
export const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
