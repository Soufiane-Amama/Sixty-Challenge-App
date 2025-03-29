"use client";

import { useState } from "react";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { startQrScanner } from "@/src/helpers/qrScanner"; // استدعاء دالة قراءة QR

export default function QRScannerPage() {
  const [scanner, setScanner] = useState(null);
  const [qrResult, setQrResult] = useState("");

  // فتح الكاميرا وبدء المسح
  const handleStartScanner = () => {
    const newScanner = startQrScanner(
      "reader",
      (decodedText) => {
        setQrResult(decodedText);
        newScanner.clear(); // إيقاف المسح بعد النجاح
      },
      (errorMessage) => {
        console.error(errorMessage);
      }
    );
    setScanner(newScanner);
  };

  // إيقاف الكاميرا
  const handleStopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
  };

  return (
    <Box p={5} bg="gray.50" h="100vh" display="flex" flexDirection={"column"} gap={5} justifyContent="center" alignItems="center">
      <Text fontSize="sm" color="gray.600" textAlign="center">
      يمكنك الضغط على الزر أدناه لعرض البطاقات التحفيزية يمكنك أخذ جرعة تحفيزية أثناء رحلتك الستينية 💪🏼🔥
      </Text>

      <Button
        as="a"
        href="https://drive.google.com/drive/folders/1fVJUmHLszKxuFCKQbp6rVUmoxTUJil9t?usp=sharing"
        target="_blank"
        colorScheme="teal"
        mb={9}
      >
        📂 استعراض جميع البطاقات
      </Button>

      <VStack spacing={4} bg="white" p={5} borderRadius="md" shadow="md">
        <Text fontSize="xl" fontWeight="bold">📷 مسح رمز QR</Text>

        {/* زر فتح الكاميرا */}
        <Button colorScheme="blue" onClick={handleStartScanner}>
          📸 فتح الكاميرا
        </Button>

        {/* زر إيقاف الكاميرا */}
        <Button colorScheme="red" onClick={handleStopScanner}>
          🔒 قفل الكاميرا
        </Button>

        {/* مكان عرض الكاميرا */}
        <Box id="reader" width="250px" height="250px" bg="gray.200"></Box>

        {/* زر "شاهد" عند نجاح المسح */}
        {qrResult && (
          <Button as="a" href={qrResult} target="_blank" colorScheme="green">
            ▶️ شاهد
          </Button>
        )}
      </VStack>
    </Box>
  );
}
