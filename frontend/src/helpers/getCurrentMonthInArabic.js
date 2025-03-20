// دالة تحدد اسم الشهر الحالي باللغة العربية

function getCurrentMonthInArabic() {
    const monthsInArabic = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const currentMonthIndex = new Date().getMonth(); // إرجاع رقم الشهر (0-11)
    return monthsInArabic[currentMonthIndex]; // استرجاع اسم الشهر من المصفوفة
}

export default getCurrentMonthInArabic;