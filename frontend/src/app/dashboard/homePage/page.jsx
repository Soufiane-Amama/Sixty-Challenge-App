"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Progress,
  SimpleGrid,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaQuoteLeft } from "react-icons/fa";
import useGetData from "@/src/hooks/useGetData";
import { GET_MOTIVATION_URL, GET_BADGES_URL, GET_PUNISHMENTS_URL } from "@/src/config/urls";
import MotivationCard from "@/src/components/MotivationCard/MotivationCard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Leaderboard from "@/src/components/Leaderboard/Leaderboard";
import { useApp } from '@/src/context/AppContext';
import Statistics from "@/src/components/Statistics/Statistics";

// بيانات المتصدرين
const leaderboard = [
  { id: 1, name: "طارق إبراهيم", points: 200, avatar: "/images/hero-1.png" },
  { id: 2, name: "معتصم يوسف", points: 180, avatar: "/images/hero-1.png" },
  { id: 3, name: "بشرى معتصم", points: 150, avatar: "/images/heroine-1.png" },
];

// بيانات المهام الاساسية
const tasks = [
  { id: 1, task: "🛌 النوم في الوقت", points: 1 },
  { id: 2, task: "⏰ الاستيقاظ في الوقت", points: 1 },
  { id: 3, task: "🎯 الهدف الشخصي", points: 2 },
  { id: 4, task: "📖 التعلم الذاتي", points: 2 },
  { id: 5, task: "🙏 الصلوات الخمس", points: 2 },
  { id: 6, task: "🏋️‍♂️ الرياضة", points: 1 },
  { id: 7, task: "🎁 المكافأة الذاتية", points: 1 },
];

// قائمة الرسائل التحفيزية
const motivationalMessages = [
  "💪 العظمة تبدأ بخطوة صغيرة! واصل العمل، يابطل!",
  "🚀 النجاح يأتي لأولئك الذين لا يتوقفون عن المحاولة!",
  "🌟 لا يوجد مستحيل، فقط تحديات تحتاج إلى بطل مثلك!",
  "🔥 اجعل اليوم أفضل من الأمس، ولو بخطوة واحدة!",
  "🏆 طريق النجاح مليء بالعقبات، لكنك أقوى منها!",
  "💪 كل يوم هو فرصة جديدة لتحقيق أحلامك!",
  "🌟 ابدأ ولا تنتظر! اللحظة المثالية لا تأتي أبدًا، نحن من نصنعها"
];

export default function Dashboard() {
  const { user, loading: _loading } = useApp();
  // const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("");
   const [badges, setBadges] = useState([]);
    const [punishments, setPunishments] = useState([]);

    const { data, loading: isLoading, error } = useGetData(GET_MOTIVATION_URL);
    const { data: badgesData, loading: loadingBadges, error: errorBadges } = useGetData(GET_BADGES_URL);
    const { data: punishmentsData, loading: loadingPunishments, error: errorPunishments } = useGetData(GET_PUNISHMENTS_URL);

    useEffect(() => {
      if (isLoading) return; // لا تفعل شيء أثناء التحميل
  
      if (error || !data?.message) {
        // في حالة الخطأ، نستخدم الرسالة الافتراضية
        setAiMessage("ما شاء الله! سعداء برؤيتك هنا، وجودك هنا هو دليل على رغبتك في تطوير نفسك للأفضل. استمر في العمل الجاد وتحقيق النجاح!");
      } else {
        setAiMessage(data.message);
      }
      if (badgesData) setBadges(badgesData || []);
      if (punishmentsData) setPunishments(punishmentsData || []);
    }, [data, badgesData, punishmentsData]);

  // جلب رسالة تحفيزية عند تحميل الصفحة
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const randomMessage =
        motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMessage(randomMessage);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" p={5}>

      {/* مكون الرسالة التحفيزية من ذكاء الاصطناعي*/}
      <MotivationCard message={aiMessage} loading={isLoading} />

      {/* شريط الترحيب */}
      <Box bg="yellow.100" p={5} borderRadius="md" textAlign="center" mt={5}>
        <Text fontSize="lg" fontWeight="bold">
          👋 مرحبًا، يابطل! أنت في اليوم{" "}
          <Text as="span" color="yellow.600">
            12
          </Text>{" "}
          من التحدي!
        </Text>
        <Progress value={20} size="sm" colorScheme="yellow" mt={2} />
      </Box>

      {/* إحصائيات */}
      <Statistics user={user} badges={badges} punishments={punishments} />

      {/* 💡 قسم الرسالة التحفيزية */}
      <Box
        bg="blue.100"
        p={7}
        borderRadius="md"
        textAlign="center"
        shadow="md"
        mt={4}
        position="relative"
      >
        <Icon as={FaQuoteLeft} color="blue.500" boxSize={6} position="absolute" top={3} left={4} />
        <Text fontSize="lg" fontWeight="bold" color="blue.800">
          {loading ? <Spinner size="sm" /> : message}
        </Text>
      </Box>

      {/* لوحة المتصدرين */}
      <Leaderboard leaderboard={leaderboard} />

      {/* مهام اليوم */}
      <Box bg="white" p={5} borderRadius="md" mt={6} shadow="md">
      <Text fontWeight="bold" fontSize="lg" mb={6}>
        🚀 المهام الأساسية في تحدي 60
      </Text>

      {/* شبكة بطاقات المهام */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {tasks.map((task, index) => (
          <Box
            key={task.id}
            bg={["blue.200", "green.200", "pink.200", "yellow.200", "purple.200", "cyan.200", "orange.200"][index % 7]} 
            p={5}
            borderRadius="lg"
            shadow="md"
            textAlign="center"
            transition="all 0.2s ease-in-out"
            _hover={{ transform: "scale(1.05)", shadow: "xl" }} // تأثير عند تمرير الماوس
          >
            <VStack spacing={2}>
              <Text fontSize="md" fontWeight="bold">{task.task}</Text>
              <Text fontSize="lg" color="gray.700">🔥 {task.points} نقطة</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      </Box>

      {/* Calendar */}
      <Box bg={"white"} p={5} borderRadius="md" mt={6} shadow="md">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          📆 التقويم
        </Text>
        <Calendar />
        {/* <DotLottieReact
          src="https://lottie.host/6c4ef454-3e07-4771-8cf3-b4ca08e6ccb2/xWXyOAaswj.lottie"
          loop
          autoplay
          style={{ width: "30vw", height: "30vh" }} 
        /> */}
      </Box>
    </Box>
  );
}
