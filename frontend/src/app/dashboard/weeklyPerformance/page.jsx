"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { FaLightbulb } from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import useGetData from "@/src/hooks/useGetData";
import { GET_RECOMMENDATIONS_URL } from "@/src/config/urls";

// تسجيل مكونات الرسم البياني
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WeeklyPerformance() {
  const [chartData, setChartData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

    // التوصيات الافتراضية في حالة فشل جلب البيانات
    const defaultRecommendations = [
      "🚀 حدد أهدافًا أسبوعية واضحة لتعزيز تقدمك.",
      "📖 خصص وقتًا يوميًا للتعلم الذاتي وتحسين مهاراتك.",
      "💡 حاول تحسين عاداتك اليومية مثل النوم الجيد وممارسة الرياضة.",
    ];

  // جلب بيانات الأداء
  useEffect(() => {
    const performanceData = {
      labels: ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
      datasets: [
        {
          label: "معدل الأداء",
          data: [75, 80, 85, 90, 78, 88, 92], // نسبة الأداء لكل يوم
          borderColor: "#3182ce",
          backgroundColor: "rgba(49, 130, 206, 0.2)",
          tension: 0.4,
        },
      ],
    };
    setChartData(performanceData);
  }, []);

  // جلب التوصيات من الباك-إند
  const { data, loading, error } = useGetData(GET_RECOMMENDATIONS_URL);

  useEffect(() => {
    if (loading) return; // لا تفعل شيء أثناء التحميل

    if (error || !data?.message) {
      // في حالة الخطأ، نستخدم التوصيات الافتراضية
      setRecommendations(defaultRecommendations);
    } else {
      // إذا تم جلب البيانات بنجاح، نقوم بتحليلها
      setRecommendations(data.message.split("\n"));
    }
  }, [data, loading, error]);

  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        📊 تحليل الأداء الأسبوعي
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {/* الرسم البياني */}
        <Card shadow="md" bg="white" borderRadius="md" p={5}>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              📈 تطور الأداء خلال الأسبوع
            </Text>
            {chartData && <Line data={chartData} />}
          </CardBody>
        </Card>

        {/* توصيات الذكاء الاصطناعي */}
        <Card shadow="md" bg="white" borderRadius="md" p={5}>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              🤖 توصيات الذكاء الاصطناعي لتحسين الأداء
            </Text>
            <Divider mb={3} />
            {loading ? (
              <Text>⏳ جاري تحميل التوصيات...</Text>
            ) : (
              <VStack align="start" spacing={3}>
                {recommendations.map((rec, index) => (
                  <HStack key={index}>
                    <Icon as={FaLightbulb} color="yellow.500" />
                    <Text>{rec}</Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
