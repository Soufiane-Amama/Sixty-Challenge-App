"use client";

import { Box, VStack, Text, SimpleGrid, Button } from "@chakra-ui/react";
import Image from "next/image";
import Badge1 from "@/public/svg/badge-1.svg";
import Badge2 from "@/public/svg/badge-2.svg";
import Badge3 from "@/public/svg/badge-3.svg";

const achievements = [
  {
    id: 1,
    title: "وسام ذهبي",
    subtitle: "بطل التحدي",
    description: "لإكمال 60 يومًا من التحدي بنجاح",
    color: "gold",
    image: Badge1, // استبدل بمسار الصورة المناسب
  },
  {
    id: 2,
    title: "وسام فضي",
    subtitle: "نجم الرياضة",
    description: "لإكمال 30 يومًا من العادات الرياضية",
    color: "silver",
    image: Badge2,
  },
  {
    id: 3,
    title: "وسام برونزي",
    subtitle: "قارئ متميز",
    description: "لإنهاء قراءة 5 كتب في شهر واحد",
    color: "bronze",
    image: Badge3,
  },
  {
    id: 4,
    title: "وسام عادي",
    subtitle: "المثابر",
    description: "لإكمال 10 أيام متتالية من التحدي",
    color: "gray",
    image: Badge1,
  },
];

export default function MyAchievements() {
  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
        🏅 إنجازاتي
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
        {achievements.map((achievement) => (
          <Box
            key={achievement.id}
            p={5}
            bg="white"
            shadow="md"
            borderRadius="md"
            textAlign="center"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image src={achievement.image} alt={achievement.title} mx="auto" width={150} height={"auto"} />
            <Text fontSize="xl" fontWeight="bold" mt={3}>
              {achievement.title}
            </Text>
            <Text fontSize="md" color="green.500" fontWeight="medium">
              {achievement.subtitle}
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {achievement.description}
            </Text>
            <Button mt={3} colorScheme="blue">شارك</Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
