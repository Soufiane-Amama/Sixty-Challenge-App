import { Box, Text, VStack, Button, List, ListItem, ListIcon, HStack } from "@chakra-ui/react";
import { FaRegClock, FaClipboardList, FaBan, FaTasks } from "react-icons/fa";
import { useRouter } from "next/navigation";
import MySVG from "@/public/svg/feepik-1.svg";
import Image from "next/image";
import { useApp } from '@/src/context/AppContext';

const FeaturesSection = () => {
  const { user } = useApp(); 
  const router = useRouter();

  return (
    <Box 
      id="features"
      display="flex" 
      flexDirection={{ base: "column", md: "row" }} 
      alignItems="center" 
      justifyContent="space-between" 
      py={12} 
      px={{ base: 6, md: 16 }} 
      bg="white"
    >
      {/* القسم الأيسر (النصوص) */}
      <VStack align="start" spacing={6} maxW="lg">
        {/* شارة العنوان */}
        <Button size="sm" bg="yellow.200" color="black" borderRadius="full" px={4}>
          🎯 تحقيق الأهداف في 60 يوم فقط
        </Button>

        {/* العنوان الرئيسي */}
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.800">
          هل تعبت من الفشل في تحقيق أهدافك؟
        </Text>

        {/* قائمة المشاكل */}
        <List spacing={4} color={"#5F5F86"}>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={FaRegClock} color="purple.500" />
            تضع أهدافًا كبيرة ولكنك تفقد الحماس بعد أيام قليلة.
          </ListItem>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={FaClipboardList} color="yellow.500" />
            لا ترى أي تقدم، وتفقد الثقة في قدرتك على التغيير.
          </ListItem>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={FaBan} color="red.500" />
            عدم وجود نظام يساعدك على الالتزام.
          </ListItem>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={FaTasks} color="blue.500" />
            خطة غير واضحة = الإحباط وعدم الإنجاز.
          </ListItem>
        </List>

        {/* زر CTA */}
        <Button size="lg" bg="yellow.400" color="black" _hover={{ bg: "yellow.300" }} onClick={() => router.push(user !== null ? "/dashboard" : "/register")}>
          انضم الآن وابدأ التحدي
        </Button>
      </VStack>

      {/* القسم الأيمن (الصورة) */}
      <Box maxW={{ base: "100%", md: "50%" }} mt={{ base: 8, md: 0 }}>
        <Image src={MySVG} alt="Hero Image" width={500} height={500} />
      </Box>
    </Box>
  );
};

export default FeaturesSection;

