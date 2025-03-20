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
    <Box p={5} bg="gray.50" minH="100vh" display="flex" justifyContent="center" alignItems="center">
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
