"use client";

import {
  Box, VStack, Text, Button, Progress, Checkbox, IconButton, 
  useDisclosure, Stack, Flex, Spinner, HStack
} from "@chakra-ui/react";
import { useState } from "react";
import { FaStopCircle } from "react-icons/fa"; 
import useGetData from "@/src/hooks/useGetData";
import useUpdateData from "@/src/hooks/useUpdateData";
import useAddData from '@/src/hooks/useAddData';
import { GET_MY_CHALLENGES_URL, STOP_CHALLENGE_URL, DOCUMENT_DAY_URL, } from "@/src/config/urls";
import FormModal from '@/src/components/Modal/FormModal';
import ConfirmModal from "@/src/components/Modal/ConfirmModal";
import { calculateDaysRemaining } from "@/src/helpers/calculateDaysRemaining";

export default function MyChallengesPage() {
  const { data: challenges, setData: setChallenges, loading, error } = useGetData(GET_MY_CHALLENGES_URL);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmModalOpen, onOpen: openConfirmModal, onClose: closeConfirmModal } = useDisclosure();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedHabits, setCompletedHabits] = useState({});
  const [id, setId] = useState(null);
  
  const { updateData: stopChallenge, loading: stopping } = useUpdateData(STOP_CHALLENGE_URL);
    const { addItem, loading: _loading, error: _error } = useAddData(DOCUMENT_DAY_URL); // توثيق اليوم

  const handleOpenModal = (challenge) => {
    setSelectedChallenge(challenge);
    setCompletedHabits({});
    onOpen();
  };

  const handleConfirm = () => {
    if (!selectedChallenge) return;
    
    const updatedChallenges = challenges.map((ch) => {
      if (ch._id === selectedChallenge._id) {
        const uncompletedCount = ch.additionalHabits.length - Object.keys(completedHabits).length;
        const newPoints = Math.max(0, ch.challengePoints - uncompletedCount);
        return { ...ch, challengePoints: newPoints };
      }
      return ch;
    });

    setChallenges(updatedChallenges);
    onClose();
  };

  const handleStopChallenge = async () => {
    try {
      closeConfirmModal();

      await stopChallenge({ id, status: "متوقف" });
      setChallenges(challenges.filter(ch => ch._id !== id));
    } catch (err) {
      console.error("فشل إيقاف التحدي:", err);
      closeConfirmModal();
    }
  };

  const handleConfirmModal = (challengeId) => {
    setId(challengeId);
    openConfirmModal();
  };

  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <VStack spacing={5} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">🏆 تحدياتي</Text>

        {loading && <Flex justify="center" align="center" minH="200px"><Spinner size="xl" color="yellow.500" /></Flex>}
        
        {challenges && challenges.length > 0 ? (
        challenges.map((challenge) => {
          const daysRemaining = Math.max(0, 60 - (new Date() - new Date(challenge.announcedChallengeId.startDate)) / (1000 * 60 * 60 * 24));
          const isChallengeCompleted = daysRemaining === 0;
          const isChallengeStopped = challenge.status === "متوقف"; // التأكد من أن التحدي متوقف

          return (
            <Box
              key={challenge._id}
              p={5}
              bg="white"
              shadow="md"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <Text fontSize="xl" fontWeight="bold">
                  {challenge.announcedChallengeId.title}
                </Text>
                
                {!isChallengeStopped && ( // ✅ إخفاء زر الإيقاف عند توقف التحدي
                  <IconButton
                    icon={<FaStopCircle />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleConfirmModal(challenge._id)}
                    isLoading={stopping}
                    aria-label="إيقاف التحدي"
                  />
                )}
              </HStack>

              <Text fontSize="sm" color="gray.600">
                الأيام المتبقية:{" "}
                {challenge.announcedChallengeId?.startDate ? calculateDaysRemaining(challenge.announcedChallengeId.startDate)
                  : "غير متاح"}{" "} يوم
              </Text>
              <Text fontSize="sm" color="green.500">
                النقاط المكتسبة: {challenge.challengePoints} نقطة
              </Text>

              <Progress
                value={(challenge.challengePoints / 60) * 100}
                size="sm"
                colorScheme="blue"
                mt={2}
              />

              {/* ✅ تعطيل زر التوثيق إذا كان التحدي متوقفًا */}
              {isChallengeCompleted || isChallengeStopped ? (
                <Button mt={3} colorScheme="gray" isDisabled>
                  {isChallengeStopped ? "🚫 التحدي متوقف" : "🏁 التحدي انتهى"}
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
      ) : (
        !loading && <Text textAlign="center">لا توجد تحديات حالياً</Text>
      )}
      </VStack>

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={`توثيق اليوم في ${selectedChallenge?.announcedChallengeId.title}`}
        onConfirm={handleConfirm}
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

        <Text fontSize="md" mt={4} fontWeight="bold">
          حدد العادات التي تم تنفيذها:
        </Text>
        <Stack spacing={2} mt={2}>
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
      </FormModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleStopChallenge}
        title="يحزننا رغبتك في أخذ هذا القرار 😢"
        message="هل أنت متأكد في رغبتك بالإستسلام، والتوقف عن الإستمرار في التحدي؟"
      />
    </Box>
  );
}
