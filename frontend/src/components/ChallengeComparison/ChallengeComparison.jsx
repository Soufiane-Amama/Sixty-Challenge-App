import { Box, Text, VStack, HStack, Button, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MySVG1 from "@/public/svg/feepik-2.svg";
import MySVG2 from "@/public/svg/feepik-3.svg";

const ChallengeComparison = () => {
  const router = useRouter();
  return (
    <Box id="challenge" py={12} px={{ base: 6, md: 16 }} bgGradient="linear(to-r, yellow.50, white)">
      {/* العنوان */}
      <VStack spacing={2} textAlign="center" mb={8}>
        <Button size="sm" bg="yellow.200" color="black" borderRadius="full" px={4}>
          😃 ستشعر بالفخر كلما حققت هدفًا جديدًا!
        </Button>
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.800">
          مستقبلك مع تحدي الستين 🚀
        </Text>
      </VStack>

      {/* المحتوى الرئيسي */}
      <HStack spacing={10} flexDirection={{ base: "column", md: "row" }} alignItems="center">
        {/* القسم الأيسر (قبل التحدي) */}
        <VStack align="center" spacing={6} flex="1">
          <Text fontSize="xl" fontWeight="bold" color="gray.700">
            قبل التحدي
          </Text>
          <List spacing={4} textAlign="right" color={"#5F5F86"}>
            <ListItem>
              <ListIcon as={FaTimesCircle} color="red.500" />
              تشعر بالإحباط وعدم الإنجاز.
            </ListItem>
            <ListItem>
              <ListIcon as={FaTimesCircle} color="red.500" />
              تفقد الحماس بسرعة.
            </ListItem>
            <ListItem>
              <ListIcon as={FaTimesCircle} color="red.500" />
              تعيد نفس الأخطاء كل يوم.
            </ListItem>
          </List>
          <Image src={MySVG1} alt="قبل التحدي" width="100%" height="auto" maxW="300px" />
        </VStack>

        {/* القسم الأيمن (بعد التحدي) */}
        <VStack align="center" spacing={6} flex="1">
          <Image src={MySVG2} alt="بعد التحدي" width="100%" height="auto" maxW="300px" />
          <Text fontSize="xl" fontWeight="bold" color="gray.700">
            بعد التحدي
          </Text>
          <List spacing={4} textAlign="right" color={"#5F5F86"}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              تشعر بالثقة والفخر بإنجازاتك.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              تلتزم بخطة يومية واضحة.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              تبني عادات إيجابية تدوم مدى الحياة.
            </ListItem>
          </List>
        </VStack>
      </HStack>

      {/* زر CTA */}
      <VStack mt={8}>
        <Button size="lg" bg="yellow.400" color="black" _hover={{ bg: "yellow.300" }} onClick={() => router.push("/register")}>
          ابدأ التحدي الآن
        </Button>
      </VStack>
    </Box>
  );
};

export default ChallengeComparison;
