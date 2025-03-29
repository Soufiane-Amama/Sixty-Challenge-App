"use client";

import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  Checkbox,
  IconButton,
  useDisclosure,
  Stack,
  Flex,
  Spinner,
  HStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaStopCircle, FaEye  } from "react-icons/fa"; 
import { useRouter } from "next/navigation";
import useGetData from "@/src/hooks/useGetData";
import useUpdateData from "@/src/hooks/useUpdateData";
import useAddData from "@/src/hooks/useAddData";
import useCustomToast from "@/src/hooks/useCustomToast";
import { GET_MY_CHALLENGES_URL, STOP_CHALLENGE_URL, DOCUMENT_DAY_URL } from "@/src/config/urls";
import FormModal from '@/src/components/Modal/FormModal';
import ConfirmModal from "@/src/components/Modal/ConfirmModal";
import { calculateDaysRemaining } from "@/src/helpers/calculateDaysRemaining";
import { useApp } from "@/src/context/AppContext";

export default function MyChallengesPage({ onShowDaysGrid }) {
  const { documentDailyProgress } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmModalOpen, onOpen: openConfirmModal, onClose: closeConfirmModal } = useDisclosure();
  const [myChallenges, setMyChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedHabits, setCompletedHabits] = useState({});
  const [id, setId] = useState(null);

  const { showToast } = useCustomToast();
  const { data: challenges, setData: setChallenges, loading, error } = useGetData(GET_MY_CHALLENGES_URL);
  const { updateData: stopChallenge, loading: stopping } = useUpdateData(STOP_CHALLENGE_URL);
  const { addItem, loading: _loading, error: _error } = useAddData(DOCUMENT_DAY_URL); // لتوثيق اليوم

  useEffect(() => {
    if (challenges) {
      setMyChallenges(challenges || []);
    }
  }, [challenges]);

  // فتح المودال لتوثيق اليوم
  const handleOpenModal = (challenge) => {
    setSelectedChallenge(challenge);
    setCompletedHabits({}); // إعادة تعيين الحالة
    onOpen();
  };

  // إيقاف التحدي
  const handleStopChallenge = async () => {
    try {
      closeConfirmModal();
      await stopChallenge({ id, status: "متوقف" });
      setChallenges(challenges.filter(ch => ch._id !== id));
      showToast("تم إيقاف التحدي", "success");
    } catch (err) {
      console.error("فشل إيقاف التحدي:", err);
      closeConfirmModal();
      showToast("فشل إيقاف التحدي، حاول مرة أخرى", "error");
    }
  };

  const handleConfirmModal = (challengeId) => {
    setId(challengeId);
    openConfirmModal();
  };

  // إرسال بيانات توثيق اليوم للباك اند
  const handleSubmitProgress = async () => {
    if (!selectedChallenge) return;

    const payload = {
      challengeId: selectedChallenge._id,
      tasks: {
        sleepSchedule: { completed: completedHabits.sleepSchedule || false, points: 1 },
        wakeUpSchedule: { completed: completedHabits.wakeUpSchedule || false, points: 1 },
        selfLearning: { completed: completedHabits.selfLearning || false, points: 2 },
        prayers: { completed: completedHabits.prayers || false, points: 2 },
        personalGoalProgress: { completed: completedHabits.personalGoalProgress || false, points: 2 },
        sports: { completed: completedHabits.sports || false, points: 1 },
        reward: { completed: completedHabits.reward || false, points: 1 },
      },
      additionalHabits: selectedChallenge.additionalHabits.map((habit) => ({
        habit: habit,
        completed: completedHabits[habit] || false,
      })),
    };

    try {
      console.log("Payload:", payload);
      const response = await addItem(payload); // إرسال البيانات إلى الباك اند
      
      // تحديث challengePoints محلياً (يمكنك جلب البيانات من الباك اند بعد التحديث)
      const updatedChallenges = challenges.map((ch) => {
        if (ch._id === selectedChallenge._id) {
          // احسب النقاط المكتسبة كما هو موضح في الباك اند
          const taskPoints = Object.values(payload.tasks)
            .filter(task => task.completed)
            .reduce((sum, task) => sum + task.points, 0);
          const additionalPenalty = payload.additionalHabits.filter(h => !h.completed).length;
          const newDailyPoints = taskPoints - additionalPenalty;
          return { ...ch, challengePoints: ch.challengePoints + newDailyPoints };
        }
        return ch;
      });
      
      if (response) {
        showToast("تم توثيق اليوم بنجاح", "success");
        setChallenges(updatedChallenges);
        onClose();
        // showToast(response.message, "success");
        console.log('تم التةثيق بنجاح:', response);
      }
      onClose();
    } catch (err) {
      console.error("خطأ أثناء توثيق التقدم:", err);
      showToast("حدث خطأ أثناء توثيق التقدم. حاول مرة أخرى.", "error");
    }
  };

  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <VStack spacing={5} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          🏆 تحدياتي
        </Text>

        {loading && (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="yellow.500" />
          </Flex>
        )}

        {myChallenges && myChallenges.length > 0
          ? myChallenges.map((challenge) => {
              const daysRemaining = Math.max(
                0,
                60 -
                  (new Date() -
                    new Date(challenge.announcedChallengeId.startDate)) /
                    (1000 * 60 * 60 * 24)
              );
              const isChallengeCompleted = daysRemaining === 0;
              const isChallengeStopped = challenge.status === "متوقف";

              return (
                <Box
                  key={challenge._id}
                  p={5}
                  bg="white"
                  shadow="md"
                  borderRadius="md"
                  mb={4}
                >
                  {/* عنوان التحدي مع زر ايقاف التحدي وزر مشاهدة (DaysGrid) */}
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">
                      {challenge.announcedChallengeId.title}
                    </Text>
                    <HStack>
                      {/* زر عرض الأيام */}
                      <IconButton
                        icon={<FaEye />}
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() =>
                          onShowDaysGrid(
                            challenge._id,
                            challenge.announcedChallengeId.startDate,
                            challenge.announcedChallengeId.endDate,
                            challenge
                          )
                        }
                        aria-label="عرض أيام التحدي"
                        title="عرض جميع أيام التحدي"
                      />

                      {/* زر إيقاف التحدي (إخفاؤه إذا التحدي متوقف) */}
                      {!isChallengeStopped && (
                        <IconButton
                          icon={<FaStopCircle />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleConfirmModal(challenge._id)}
                          isLoading={stopping}
                          aria-label="إيقاف التحدي"
                          title="إيقاف التحدي"
                        />
                      )}
                    </HStack>
                  </HStack>

                  <Text fontSize="sm" color="gray.600">
                    الأيام المتبقية:{" "}
                    {challenge.announcedChallengeId?.startDate
                      ? calculateDaysRemaining(
                          challenge.announcedChallengeId.startDate
                        )
                      : "غير متاح"}{" "}
                    يوم
                  </Text>
                  <Text fontSize="sm" color="green.500">
                    النقاط المكتسبة: {challenge.challengePoints} نقطة
                  </Text>
                  <Progress
                    value={
                      ((new Date() -
                        new Date(challenge.announcedChallengeId.startDate)) /
                        (new Date(challenge.announcedChallengeId.endDate) -
                          new Date(challenge.announcedChallengeId.startDate))) *
                      100
                    }
                    size="sm"
                    colorScheme="blue"
                    mt={2}
                  />

                  {/* زر توثيق اليوم الحالي */}
                  {isChallengeCompleted || isChallengeStopped ? (
                    <Button mt={3} colorScheme="gray" isDisabled>
                      {isChallengeStopped
                        ? "🚫 التحدي متوقف"
                        : "🏁 التحدي انتهى"}
                    </Button>
                  ) : (
                    <Button
                      mt={3}
                      colorScheme="blue"
                      onClick={() => handleOpenModal(challenge)}
                    >
                      📌 توثيق اليوم الحالي
                    </Button>
                  )}
                </Box>
              );
            })
          : !loading && (
              <Text textAlign="center">أنت غير مشارك في تحديات حالياً</Text>
            )}
      </VStack>

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={`توثيق اليوم في ${selectedChallenge?.announcedChallengeId.title}`}
        handleSaveChanges={handleSubmitProgress} // تمرير دالة الإرسال
        type="log"
      >
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

        {selectedChallenge?.additionalHabits.length !== 0 && (
          <Stack spacing={2} mt={2}>
            <Text fontSize="md" mt={4} fontWeight="bold">
              حدد العادات التي تم تنفيذها:
            </Text>
            {selectedChallenge?.additionalHabits.map((habit, index) => (
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
      </FormModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleStopChallenge}
        title="يحزننا رغبتك في أخذ هذا القرار 😢"
        message="هل أنت متأكد في رغبتك بالإستسلام النهائي، والتوقف عن الإستمرار في التحدي؟"
      />
    </Box>
  );
}
