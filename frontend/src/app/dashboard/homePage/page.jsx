"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  List,
  ListItem,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { FaTrophy, FaCheckCircle, FaTasks, FaQuoteLeft } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// بيانات المتصدرين
const leaderboard = [
  { id: 1, name: "طارق إبراهيم", points: 200, avatar: "/images/hero-1.png" },
  { id: 2, name: "معتصم يوسف", points: 180, avatar: "/images/hero-1.png" },
  { id: 3, name: "بشرى معتصم", points: 150, avatar: "/images/heroine-1.png" },
];

// بيانات المهام اليومية
const dailyTasks = [
  { id: 1, task: "تعلم 30 دقيقة ودراسة (إجباري)", done: true },
  { id: 2, task: "الصلاة الخمس (إجباري)", done: false },
  { id: 3, task: "الرياضة اليومية (إجباري)", done: false },
  { id: 4, task: "قراءة 10 صفحات من كتاب", done: false },
];

// قائمة الرسائل التحفيزية
const motivationalMessages = [
  "💪 العظمة تبدأ بخطوة صغيرة! واصل العمل، يابطل!",
  "🚀 النجاح يأتي لأولئك الذين لا يتوقفون عن المحاولة!",
  "🌟 لا يوجد مستحيل، فقط تحديات تحتاج إلى بطل مثلك!",
  "🔥 اجعل اليوم أفضل من الأمس، ولو بخطوة واحدة!",
  "🏆 طريق النجاح مليء بالعقبات، لكنك أقوى منها!",
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(dailyTasks);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // تحديث حالة المهام
  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

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
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mt={5}>
        <Card>
          <CardBody>
            <HStack>
              <Icon as={FaTrophy} color="yellow.500" boxSize={6} />
              <VStack align="start">
                <Text fontWeight="bold">الميداليات 🏅</Text>
                <Text>3</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <HStack>
              <Icon as={FaCheckCircle} color="green.500" boxSize={6} />
              <VStack align="start">
                <Text fontWeight="bold">النقاط الإجمالية</Text>
                <Text>120 نقطة</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <HStack>
              <Icon as={FaTasks} color="red.500" boxSize={6} />
              <VStack align="start">
                <Text fontWeight="bold">العقوبات ⚠️</Text>
                <Text>1</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* لوحة المتصدرين */}
      <Box bg="yellow.300" p={4} borderRadius="md" mt={6}>
        <Text fontWeight="bold" fontSize="lg">
          🏆 لوحة المتصدرين
        </Text>
        {leaderboard.map((champion, index) => (
          <HStack key={champion.id} mt={3}>
            <Avatar size="sm" src={champion.avatar} />
            <Text>{champion.name}</Text>
            <Text ml="auto" fontWeight="bold">
              {champion.points} نقطة
            </Text>
          </HStack>
        ))}
      </Box>

      {/* مهام اليوم */}
      <Box bg="white" p={5} borderRadius="md" mt={6} shadow="md">
        <Text fontWeight="bold" fontSize="lg">
          🚀 مهام اليوم
        </Text>
        <List spacing={3} mt={3}>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <Checkbox isChecked={task.done} onChange={() => toggleTask(task.id)}>
                {task.task}
              </Checkbox>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Calendar */}
      <Box bg={"white"} p={5} borderRadius="md" mt={6} shadow="md">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          📆 التقويم
        </Text>
        <Calendar />
      </Box>
    </Box>
  );
}
