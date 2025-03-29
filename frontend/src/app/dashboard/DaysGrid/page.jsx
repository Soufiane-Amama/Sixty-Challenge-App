"use client";

import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  useDisclosure,
  Stack,
  Checkbox,
  Flex,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import useGetData from "@/src/hooks/useGetData";
import useAddData from "@/src/hooks/useAddData";
import useCustomToast from "@/src/hooks/useCustomToast";
import { GET_DOCUMENTION_DAYS_URL, DOCUMENT_DAY_URL } from "@/src/config/urls";
import FormModal from "@/src/components/Modal/FormModal";
import { useApp } from "@/src/context/AppContext";

const generateChallengeDays = (startDate, endDate) => {
  const daysArray = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date(); // الحصول على تاريخ اليوم الحالي

  for (let i = 0; i < 60; i++) {
    // يفترض أن التحدي 60 يومًا
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);

    daysArray.push({
      dayNumber: i + 1,
      date: dayDate,
      dailyPoints: 0,
      locked: dayDate > today, // قفل الأيام المستقبلية
      documented: false,
    });
  }
  return daysArray;
};

export default function DaysGrid({ challengeId, startDate, endDate, challenge }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { documentDailyProgress } = useApp();
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedHabits, setCompletedHabits] = useState({});

  // حقلين تجريبيين يمثلان توثيق المهام والعادات
  const [tasks, setTasks] = useState({
    sleepSchedule: false,
    wakeUpSchedule: false,
    personalGoalProgress: false,
    selfLearning: false,
    prayers: false,
    sports: false,
    reward: false,
  });
  const [habits, setHabits] = useState({
    "شرب لترين من الماء": false,
    "قراءة 10 صفحات يومياً": false,
  });

  useEffect(() => {
    if (startDate && endDate) {
      setDays(generateChallengeDays(startDate, endDate));
    }
  }, [startDate, endDate]);

  const { showToast } = useCustomToast();
  // جلب بيانات أيام التوثيق من الباك اند
  const {
    data: progressData,
    loading,
    error,
  } = useGetData(GET_DOCUMENTION_DAYS_URL(challengeId));
  const {
    addItem,
    loading: _loading,
    error: _error,
  } = useAddData(DOCUMENT_DAY_URL); // لتوثيق اليوم

  useEffect(() => {
    if (progressData) {
      setDays((prevDays) =>
        prevDays.map((day) => {
          const documentedDay = progressData.dailyProgress.find(
            (d) => new Date(d.date).toDateString() === day.date.toDateString()
          );

          return documentedDay
            ? {
                ...day,
                documented: true,
                dailyPoints: documentedDay.dailyPoints,
                tasks: documentedDay.tasks,
                additionalHabits: documentedDay.additionalHabits,
                locked: false, // فتح اليوم إذا تم توثيقه مسبقًا
              }
            : day;
        })
      );
    }
  }, [progressData]);

  // عند الضغط على بطاقة يوم
  const handleOpenDay = (day) => {
    const today = new Date();

    if (day.locked) return; // منع الفتح إذا كان اليوم مغلقًا
    if (day.date > today) return; // منع الفتح إذا كان اليوم مستقبليًا

    setSelectedDay(day);

    if (day.documented) {
      setTasks(day.tasks || {});
      setHabits(
        day.additionalHabits
          ? day.additionalHabits.reduce((acc, habit) => {
              acc[habit.habit] = habit.completed;
              return acc;
            }, {})
          : {}
      );
    } else {
      setTasks({
        sleepSchedule: false,
        wakeUpSchedule: false,
        personalGoalProgress: false,
        selfLearning: false,
        prayers: false,
        sports: false,
        reward: false,
      });
      setHabits({
        "شرب لترين من الماء": false,
        "قراءة 10 صفحات يومياً": false,
      });
    }

    onOpen();
  };

  const handleSubmitProgress = async () => {
    if (!selectedDay) return;

    const payload = {
      challengeId: challengeId,
      date: selectedDay.date,
      tasks: {
        sleepSchedule: {
          completed: completedHabits.sleepSchedule || false,
          points: 1,
        },
        wakeUpSchedule: {
          completed: completedHabits.wakeUpSchedule || false,
          points: 1,
        },
        selfLearning: {
          completed: completedHabits.selfLearning || false,
          points: 2,
        },
        prayers: { completed: completedHabits.prayers || false, points: 2 },
        personalGoalProgress: {
          completed: completedHabits.personalGoalProgress || false,
          points: 2,
        },
        sports: { completed: completedHabits.sports || false, points: 1 },
        reward: { completed: completedHabits.reward || false, points: 1 },
      },
      additionalHabits: challenge.additionalHabits.map((habit) => ({
        habit: habit,
        completed: completedHabits[habit] || false,
      })),
    };

    try {
      console.log("Payload:", payload);
      console.log("selectedDay:", selectedDay);
      const response = await documentDailyProgress(payload);
      showToast("تم توثيق اليوم بنجاح", "success");
      // تحديث الحالة أو إعادة جلب البيانات حسب الحاجة
      onClose();
    } catch (err) {
      console.error("خطأ أثناء توثيق التقدم:", err);
      showToast("حدث خطأ أثناء توثيق التقدم. حاول مرة أخرى.", "error");
    }
  };

  // ألوان البطاقات
  const documentedBg = useColorModeValue("green.100", "green.700");
  const lockedBg = useColorModeValue("gray.200", "gray.600");
  const openBg = useColorModeValue("blue.100", "blue.700");

  if (loading)
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        بطاقات أيام التحدي
      </Text>

      {/* شبكة بطاقات الأيام */}
      <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
        {days.map((day) => {
          let cardBg = openBg;
          if (day.locked) cardBg = lockedBg;
          if (day.documented) cardBg = documentedBg;

          return (
            <Box
              key={day.dayNumber}
              bg={cardBg}
              p={4}
              borderRadius="md"
              textAlign="center"
              cursor={day.locked ? "not-allowed" : "pointer"}
              transition="transform 0.2s"
              _hover={{ transform: !day.locked ? "scale(1.05)" : "none" }}
              onClick={() => handleOpenDay(day)}
            >
              <Text fontSize="lg" fontWeight="bold">
                اليوم {day.dayNumber}
              </Text>
              <Text fontSize="sm" color="gray.700">
                النقاط: {day.dailyPoints}
              </Text>
              <Text fontSize="xs" mt={2} color="gray.500">
                {day.locked
                  ? "مُجمد 🔒"
                  : day.documented
                  ? "موثّق ✅"
                  : "قابل للتوثيق"}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* نافذة التوثيق */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={`توثيق اليوم ${selectedDay?.dayNumber}`}
        handleSaveChanges={handleSubmitProgress} // تمرير دالة الإرسال
        type="log"
      >
        {selectedDay?.documented ? (
          <Text color="green.600" fontWeight="bold">
            تم توثيق هذا اليوم مسبقًا! النقاط: {selectedDay.dailyPoints}
          </Text>
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              حدد المهام التي تم تنفيذها:
            </Text>
            <Stack spacing={2} mt={2}>
              {[
                { key: "sleepSchedule", label: "النوم في الوقت" },
                { key: "wakeUpSchedule", label: "الاستيقاظ في الوقت" },
                { key: "personalGoalProgress", label: "الهدف الشخصي" },
                { key: "selfLearning", label: "التعلم الذاتي" },
                { key: "prayers", label: "الصلوات الخمس" },
                { key: "sports", label: "الرياضة" },
                { key: "reward", label: "المكافئة الذاتية" },
              ].map((task) => (
                <Checkbox
                  key={task.key}
                  onChange={(e) => {
                    setCompletedHabits((prev) => ({
                      ...prev,
                      [task.key]: e.target.checked,
                    }));
                  }}
                >
                  {task.label}
                </Checkbox>
              ))}
            </Stack>

            {challenge?.additionalHabits.length !== 0 && (
              <Stack spacing={2} mt={2}>
                <Text fontSize="md" mt={4} fontWeight="bold">
                  حدد العادات التي تم تنفيذها:
                </Text>
                {challenge?.additionalHabits.map((habit, index) => (
                  <Checkbox
                    key={index}
                    onChange={(e) => {
                      setCompletedHabits((prev) => ({
                        ...prev,
                        [habit]: e.target.checked,
                      }));
                    }}
                  >
                    {habit}
                  </Checkbox>
                ))}
              </Stack>
            )}
          </>
        )}
      </FormModal>
    </Box>
  );
}
