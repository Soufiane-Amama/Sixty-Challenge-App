import { Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack } from "@chakra-ui/react";

const faqs = [
  {
    question: "كم تكلفة الانضمام لتحدي الستين؟",
    answer: "تحدي الستين مجاني تمامًا. نحن نؤمن بأن التغيير الإيجابي يجب أن يكون متاحًا للجميع.",
  },
  {
    question: "ما هي الميزات التي يوفرها التحدي؟",
    answer: "التحدي يوفر لك خطة تدريبية متكاملة، دعم من المجتمع، ونصائح غذائية لتحقيق أفضل النتائج.",
  },
  {
    question: "هل يمكنني الحصول على استرداد للرسوم إذا لم أكن راضيًا؟",
    answer: "بما أن التحدي مجاني، فلا توجد رسوم قابلة للاسترداد.",
  },
  {
    question: "كم من الوقت يستغرق التحدي؟",
    answer: "التحدي يستمر لمدة 60 يومًا، مع خطط يومية لتحقيق أفضل النتائج.",
  },
];

const FAQSection = () => {
  return (
    <Box id="faq" py={12} px={{ base: 6, md: 16 }} textAlign="center">
      {/* العنوان */}
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={6}>
        أسئلة وأجوبة عن تحدي الستين
      </Text>

      {/* الأكورديون الخاص بالأسئلة */}
      <Accordion allowToggle width={{ base: "100%", md: "70%" }} mx="auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index}  borderBottom="1px solid #E2E8F0">
            <h2>
              <AccordionButton py={4} _expanded={{ color: "purple.600", fontWeight: "bold" }}>
                <Box flex="1" textAlign="right">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel py={5} textAlign="right" color="gray.600">
              {faq.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default FAQSection;
