"use client";

import { Box, Avatar, Text, VStack, Button, useColorMode, IconButton, Divider, Badge, Flex, Spinner, } from "@chakra-ui/react";
import { FaMoon, FaSun, FaInstagram, } from "react-icons/fa";
import { useApp } from '@/src/context/AppContext';

export default function ProfilePage() {
  const { colorMode, toggleColorMode } = useColorMode();
    const { user, loading } = useApp();

  return (
    <Flex minH="100vh" justify="center" align="center" bg={colorMode === "light" ? "gray.100" : "gray.900"} p={4}>
      <Box bg={colorMode === "light" ? "white" : "gray.800"} p={6} borderRadius="lg" shadow="xl" maxW="400px" w="100%">

        {/* زر الوضع الليلي */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">👤 الملف الشخصي</Text>
          {/* <IconButton aria-label="Toggle Dark Mode" icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} /> */}
        </Flex>

        {/* عرض الحالة بناءً على البيانات */}
        {loading ? (
          <VStack spacing={4} py={10}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.500">جارٍ تحميل بياناتك...</Text>
          </VStack>
        ) : (
          <VStack spacing={2} textAlign="center">
            <Avatar src={user?.gender === "بطل" ? "/images/hero-1.png" : "/images/heroine-1.png"} name={user.fullName} size="2xl" />
            <Text fontSize="2xl" fontWeight="bold">{user.fullName}</Text>
            <Text fontSize="md" color="gray.500">{user.gender} | {user.country}</Text>

            {/* شارة المشرف */}
            {user.isAdmin ? <Badge colorScheme="red">👑 مشرف</Badge> : <Badge colorScheme="blue">👤 مستخدم عادي</Badge>}

            {/* النقاط */}
            <Badge colorScheme="yellow" fontSize="lg" mt={2} p={2} borderRadius="md">
              🔥 {user.totalPoints} نقطة
            </Badge>

            <Divider my={5} />

            {/* معلومات الحساب */}
            <VStack spacing={3} align="start">
              <Text fontSize="sm" color="gray.600">📧 البريد: {user.email}</Text>
              <Text fontSize="sm" color="gray.600">🎂 تاريخ الميلاد: {new Date(user.dateOfBirth).toLocaleDateString()}</Text>
              <Text fontSize="sm" color="gray.600">🗓️ انضم في: {new Date(user.createdAt).toLocaleDateString()}</Text>
            </VStack>

            <Divider my={5} />

            {/* زر انستقرام */}
            {user.instagramName && (
              <Button as="a" href={`https://instagram.com/${user.instagramName}`} target="_blank" leftIcon={<FaInstagram />} colorScheme="pink" w="full">
                زيارة انستقرام
              </Button>
            )}
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
