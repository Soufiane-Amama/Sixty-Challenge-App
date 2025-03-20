import { Box, Text, VStack, HStack, Button, SimpleGrid } from "@chakra-ui/react";

const StatsSection = () => {
  return (
    <Box py={12} px={{ base: 6, md: 16 }} textAlign="center">
      {/* الإحصائيات */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={15}>
        <Box bg="#FFFDE1" p={6} borderRadius="lg" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            60 يوم
          </Text>
          <Text fontSize="md" color="gray.600">
            من التغيير الإيجابي
          </Text>
        </Box>
        <Box  bg="#FFFDE1" p={6} borderRadius="lg" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            1000+ 
          </Text>
          <Text fontSize="md" color="gray.600">
            شخص غيروا حياتهم
          </Text>
        </Box>
        <Box  bg="#FFFDE1" p={6} borderRadius="lg" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            10 عادات
          </Text>
          <Text fontSize="md" color="gray.600">
            إيجابية جديدة
          </Text>
        </Box>
      </SimpleGrid>

      {/* النص التحفيزي */}
      <VStack spacing={4} mt={12}>
        <Text fontSize="xl" fontWeight="medium" color="gray.800">
          لا تدع الفرصة تفوتك! انضم إلى تحدي الستين الآن وابدأ رحلتك نحو حياة أفضل.
        </Text>
        <Button size="lg" bg="yellow.400" color="black" _hover={{ bg: "yellow.300" }}>
          ابدأ التحدي
        </Button>
      </VStack>
    </Box>
  );
};

export default StatsSection;
