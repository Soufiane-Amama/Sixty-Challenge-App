"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useDisclosure,
  Input,
  Checkbox,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import useCustomToast from "@/src/hooks/useCustomToast";
import FormModal from '@/src/components/Modal/FormModal';
import useGetData from "@/src/hooks/useGetData";
import useAddData from '@/src/hooks/useAddData';
import { GET_CHALLENGES_URL, PARTICICPATE_CHALLENGE_URL } from "@/src/config/urls";

// دالة لتنسيق التاريخ ليكون بصيغة مقروءة
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AnnouncedChallengesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [personalGoal, setPersonalGoal] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [punishment, setPunishment] = useState('');
  const [additionalHabits, setAdditionalHabits] = useState([]);
  const [customHabit, setCustomHabit] = useState("");
  const [showCustomHabitInput, setShowCustomHabitInput] = useState(false);

  const { showToast } = useCustomToast();
  const { data: announcedChallenges, loading } = useGetData(GET_CHALLENGES_URL);
  const { addItem, loading: _loading, error } = useAddData(PARTICICPATE_CHALLENGE_URL); // الاشتراك في التحدي

  // فتح نافذة الاشتراك عند الضغط على "اشترك"
  const handleJoinClick = (challenge) => {
    setSelectedChallenge(challenge);
    onOpen();
  };

  
  // تحديث قائمة العادات الإضافية عند تغيير الاختيارات
  const handleHabitChange = (habit) => {
    setAdditionalHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  // إرسال البيانات عند الضغط على زر "اشتراك"
  const handleSubmit = async () => {
    const challengeData = {
      personalGoal,
      sleepTime,
      wakeTime,
      punishment,
      additionalHabits: showCustomHabitInput
        ? [...additionalHabits, customHabit]
        : additionalHabits,
      announcedChallengeId: selectedChallenge?._id,
    };

    // إرسال البيانات إلى الباك
    const response = await addItem(challengeData);
    if (response) {
      showToast("تم الاشتراك في تحدي 60 بنجاح", "success");
      console.log('تم الاشتراك بنجاح:', response);
      onClose();
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" p={5}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
        🚀 التحديات المعلنة
      </Text>

      {/* عرض مؤشر التحميل أثناء جلب البيانات */}
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="yellow.500" />
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {announcedChallenges?.map((challenge) => (
            <Card
              key={challenge._id}
              p={5}
              borderRadius="md"
              shadow="md"
              _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
              bg="white"
            >
              <CardBody>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {challenge.title}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  {challenge.description}
                </Text>

                <HStack color="gray.500" mb={2}>
                  <Icon as={FaClock} />
                  <Text>يبدأ: {formatDate(challenge.startDate)}</Text>
                </HStack>
                <HStack color="gray.500" mb={4}>
                  <Icon as={FaClock} />
                  <Text>ينتهي: {formatDate(challenge.endDate)}</Text>
                </HStack>

                <Button
                  colorScheme="yellow"
                  onClick={() => handleJoinClick(challenge)}
                >
                  اشترك الآن
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* نافذة الاشتراك في التحدي */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={`✍️ الاشتراك في ${selectedChallenge?.title}`}
        handleSaveChanges={handleSubmit}
        type="add"
      >
        <VStack spacing={4} align="stretch">
          {/* 🛑 عرض الخطأ إذا وُجد */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl>
            <FormLabel>🎯 هدفك الشخصي</FormLabel>
            <Input
              placeholder="مثال: الالتزام بالرياضة يوميًا"
              value={personalGoal}
              onChange={(e) => setPersonalGoal(e.target.value)}
            />
          </FormControl>

          <HStack>
            <FormControl>
              <FormLabel>🕰️ وقت الاستيقاظ</FormLabel>
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>🌙 وقت النوم</FormLabel>
              <Input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
              />
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>⚠️ العقوبة في حال الفشل</FormLabel>
            <Input
              placeholder="مثال: التبرع بمبلغ مالي"
              value={punishment}
              onChange={(e) => setPunishment(e.target.value)}
            />
          </FormControl>

          <Text fontWeight="bold">✅ العادات الإضافية:</Text>
          <VStack align="start">
            <Checkbox
              onChange={() => handleHabitChange("📚 قراءة كتاب يوميًا")}
            >
              📚 قراءة كتاب يوميًا
            </Checkbox>
            <Checkbox onChange={() => handleHabitChange("🏃 ممارسة الرياضة")}>
              🏃 ممارسة الرياضة
            </Checkbox>
            <Checkbox
              onChange={() => handleHabitChange("🍏 اتباع نظام غذائي صحي")}
            >
              🍏 اتباع نظام غذائي صحي
            </Checkbox>
            <Checkbox
              onChange={() => handleHabitChange("🧘‍♂️ التأمل والاسترخاء")}
            >
              🧘‍♂️ التأمل والاسترخاء
            </Checkbox>
            <Checkbox 
              onChange={() => handleHabitChange("💧 شرب لترين من الماء")}
            >
              💧 شرب لترين من الماء
            </Checkbox>
            <Checkbox
              onChange={(e) => setShowCustomHabitInput(e.target.checked)}
            >
              ✍️ إضافة عادة مخصصة
            </Checkbox>

            {showCustomHabitInput && (
              <Input
                placeholder="أدخل عادتك الخاصة"
                value={customHabit}
                onChange={(e) => setCustomHabit(e.target.value)}
              />
            )}
          </VStack>
        </VStack>
      </FormModal>
    </Box>
  );
}
