import { Box, SimpleGrid, VStack, Text, Icon } from "@chakra-ui/react";
import { FaUsers, FaGift, FaBell } from "react-icons/fa";

const cards = [
  {
    title: "مجتمع التحدي",
    description: "انضم إلى مجتمع الأبطال وتنافس للحصول على المركز الأول في لوحة المتصدرين.",
    icon: FaUsers,
    bg: "purple.50",
  },
  {
    title: "نظام المكافآت",
    description: "كلما أكملت المهام اليومية، تربح النقاط وتحصل على مكافآت محفزة.",
    icon: FaGift,
    bg: "yellow.50",
  },
  {
    title: "تحفيز يومي",
    description: "التطبيق يرسل لك إشعارات تحفيزية لمساعدتك على تحقيق أهدافك.",
    icon: FaBell,
    bg: "orange.50",
  },
];

const CardsSection = () => {
  return (
    <Box py={16} bg="white">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} px={6}>
        {cards.map((card, index) => (
          <VStack key={index} p={6} bg={card.bg} borderRadius="md" boxShadow="md" spacing={4} _hover={{ boxShadow: "lg", transform: "scale(1.02)" }} transition="all 0.2s ease-in-out">
            <Icon as={card.icon} boxSize={10} color="purple.500" />
            <Text fontSize="xl" fontWeight="bold" color="black">
              {card.title}
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
              {card.description}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CardsSection;
