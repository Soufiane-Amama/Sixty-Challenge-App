import { Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const CallToAction = () => {
  const router = useRouter();

  return (
    <Box
      bg="yellow.50"
      borderRadius="lg"
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 10 }}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      w="full"
      mt={10}
    >
      {/* النص */}
      <Box textAlign={{ base: "center", md: "right" }} flex="1">
        <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color="gray.800">
          🚀 لا تدع الفرصة تفوتك!
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2}>
          "انضم إلى أبطال تحدي الستين الآن، واجعل الذكاء الاصطناعي شريكك في بناء عادات إيجابية وإنجازات مذهلة!"
        </Text>
      </Box>

      {/* الزر مع التأثير */}
      <Button
        mt={{ base: 4, md: 0 }}
        colorScheme="purple"
        bgGradient="linear(to-r, purple.400, purple.600)"
        color="white"
        px={8}
        py={5}
        borderRadius="full"
        fontSize="md"
        fontWeight="bold"
        _hover={{ bgGradient: "linear(to-r, purple.500, purple.700)", transform: "scale(1.05)" }}
        onClick={() => router.push("/register")}
      >
        ✨ ابدأ التحدي
      </Button>
    </Box>
  );
};

export default CallToAction;
