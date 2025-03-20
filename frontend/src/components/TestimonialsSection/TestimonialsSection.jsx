import { Box, Text, VStack, HStack, Avatar, SimpleGrid, AspectRatio, Link, Badge } from "@chakra-ui/react";

const testimonials = [
  {
    name: "أحمد",
    role: "مهندس برمجيات",
    feedback: "تحدي الستين غير حياتي تمامًا. الآن أنا أكثر نشاطًا وإنتاجية.",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_1",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "سارة",
    role: "مصممة جرافيك",
    feedback: "التحدي ساعدني على بناء عادات جديدة غيرت يومي للأفضل.",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_2",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "محمد",
    role: "رائد أعمال",
    feedback: "أنصح الجميع بالمشاركة! تجربة مذهلة ساعدتني على تحسين حياتي.",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_3",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <Box id="testimonials" py={12} px={{ base: 6, md: 16 }} textAlign="center">
      {/* العنوان والوصف */}
      <Badge colorScheme="purple" fontSize="sm" mb={4} px={4} py={1} borderRadius="full">
        انضم إلى آلاف الأشخاص الذين غيروا حياتهم مع تحدي 60.
      </Badge>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={8}>
        ماذا يقول المشاركون؟
      </Text>

      {/* الشبكة التي تحتوي على الفيديوهات والتعليقات */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {testimonials.map((testimonial, index) => (
          <VStack key={index} spacing={4} bg="white" boxShadow="md" borderRadius="lg" p={6}>
            {/* فيديو الشهادة */}
            <AspectRatio ratio={16 / 9} w="100%">
              <iframe
                src={testimonial.videoUrl}
                title={`Testimonial ${index + 1}`}
                allowFullScreen
                style={{ borderRadius: "8px" }}
              />
            </AspectRatio>

            {/* تعليق المستخدم */}
            <Text fontSize="md" fontStyle="italic" color="gray.600">
              "{testimonial.feedback}"
            </Text>

            {/* معلومات المستخدم */}
            <HStack spacing={3}>
              <Avatar name={testimonial.name} src={testimonial.avatar} size="sm" />
              <VStack spacing={0} align="start">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {testimonial.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {testimonial.role}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TestimonialsSection;
