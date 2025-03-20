"use client";

import DashboardLayout from "@/src/components/DashboardLayout";
import { Text, Box, useColorModeValue } from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue("light.text", "dark.text")}>
          👋 مرحبًا بك في لوحة التحكم!
        </Text>
        <Text color={useColorModeValue("light.text", "dark.text")}>
          هنا يمكنك إدارة كل شيء في التطبيق بسهولة.
        </Text>
      </Box>
    </DashboardLayout>
  );
}