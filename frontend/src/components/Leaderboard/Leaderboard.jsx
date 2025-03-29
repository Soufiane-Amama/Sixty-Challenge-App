import { Box, Text, Avatar, VStack, HStack, Badge, Divider, useColorModeValue } from "@chakra-ui/react";
import { FaMedal } from "react-icons/fa";

// ألوان الميداليات للمراكز الأولى
const medalColors = ["gold", "silver", "brown"];

const Leaderboard = ({ leaderboard }) => {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.700")}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      w={{ base: "100%", md: "90%", lg: "90%" }}
      mx="auto"
      mt={6}
    >
      <Text fontWeight="bold" fontSize="2xl" mb={4} textAlign="center" color="yellow.500">
        🏆 لوحة المتصدرين
      </Text>

      <VStack spacing={4} align="stretch">
        {leaderboard.map((champion, index) => (
          <HStack
            key={champion.id}
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            borderRadius="md"
            boxShadow="sm"
            transition="0.3s"
            _hover={{ transform: "scale(1.03)", boxShadow: "md" }}
          >
            {/* ترتيب اللاعب */}
            <Badge
              colorScheme={medalColors[index] || "gray"}
              fontSize="lg"
              borderRadius="full"
              px={3}
            >
              {index + 1}
            </Badge>

            {/* صورة اللاعب */}
            <Avatar size="md" src={champion.avatar} />

            {/* اسم اللاعب */}
            <VStack align="start" spacing={0} flex="1">
              <Text fontWeight="bold">{champion.name}</Text>
              <Text fontSize="sm" color="gray.500">المركز #{index + 1}</Text>
            </VStack>

            {/* النقاط */}
            <Text fontWeight="bold" color="blue.500">
              {champion.points} نقطة
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Leaderboard;
