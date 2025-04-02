import { Box, Text, Icon, VStack, useColorModeValue, } from "@chakra-ui/react";
import { keyframes } from "@emotion/react"; 
import { FaRobot } from "react-icons/fa"; // أيقونة الذكاء الاصطناعي

// أنيميشن للبطاقة
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MotivationCard = ({ message, loading }) => {
  return (
    <Box
      bgGradient="linear(to-r, blue.400, purple.500)" // تدرج لوني جذاب
      color="white"
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      animation={`${fadeIn} 0.6s ease-in-out`}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      w={{ base: "100%", md: "100%", lg: "90%" }} // استجابة للمقاسات
      mx="auto"
    >
      {/* أيقونة الذكاء الاصطناعي */}
      <Icon as={FaRobot} w={10} h={10} color="whiteAlpha.900" ml={4} />

      {/* نص الرسالة */}
      <VStack align="start" spacing={1} flex="1">
        {/* <Text fontSize="lg" fontWeight="bold">
          ذكاء اصطناعي 🤖
        </Text> */}
        <Text fontSize="md">
            {loading ? "جاري مراجعة أداءك ..." : message}
        </Text>
      </VStack>
    </Box>
  );
};

export default MotivationCard;
