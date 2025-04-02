import { Box, SimpleGrid, Card, CardBody, HStack, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaTrophy, FaCheckCircle, FaTasks } from "react-icons/fa";

const Statistics = ({ badges, user, punishments }) => {
  // إعداد بيانات الإحصائيات
  const stats = [
    {
      title: "الأوسمة 🏅",
      value: badges.length || 0,
      icon: FaTrophy,
      color: "yellow.500",
    },
    {
      title: "النقاط الإجمالية",
      value: `${user?.totalPoints || 0} نقطة`,
      icon: FaCheckCircle,
      color: "green.500",
    },
    {
      title: "العقوبات ⚠️",
      value: punishments.length || 0,
      icon: FaTasks,
      color: "red.500",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={5} mt={5}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="md"
          p={4}
          borderRadius="lg"
          transition="0.3s"
          _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
        >
          <CardBody>
            <HStack spacing={4}>
              {/* أيقونة الإحصائية */}
              <Icon as={stat.icon} color={stat.color} boxSize={8} />

              {/* بيانات الإحصائية */}
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="lg">{stat.title}</Text>
                <Text fontSize="xl" fontWeight="bold" color={stat.color}>
                  {stat.value}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default Statistics;
