import { Box, Text, Button, VStack, HStack, Image, Badge } from "@chakra-ui/react";
import { FaRegStar } from "react-icons/fa";
import HeroBadge from "../../elements/HeroBadge";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <Box textAlign="center" py={20} my={10} bg="yellow.50">
      <VStack spacing={6} maxW="container.md" mx="auto">
        {/* شارة الأبطال */}
        <HeroBadge />

        {/* العنوان الرئيسي */}
        <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="black">
          هل أنت مستعد لتحدي نفسك؟
        </Text>

        {/* الوصف */}
        <Text fontSize="lg" color="gray.700" maxW="600px">
          استخدم قوة الذكاء الاصطناعي لبناء عادات إيجابية في 60 يومًا، وحقق أهدافك بذكاء!
        </Text>

        {/* الأزرار */}
        <HStack spacing={4}>
          <Button 
            bgGradient="linear(to-r, purple.400, purple.600)"
            color="white" 
            size="lg" 
            borderRadius="full" 
            _hover={{ bgGradient: "linear(to-r, purple.500, purple.700)", transform: "scale(1.05)" }}
            onClick={() => router.push("/register")}
          >
            انضم لأبطال الستين
            <svg height="20" width="20" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default HeroSection;
