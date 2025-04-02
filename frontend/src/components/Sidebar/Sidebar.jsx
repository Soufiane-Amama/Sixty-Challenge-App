"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  IconButton,
  useColorMode,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { userMenu, adminMenu } from "./data";
import { useApp } from '@/src/context/AppContext';

const Sidebar = ({ isOpen, onClose, isAdmin, onPageChange, activePage, setActivePage }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useApp();

  const menuItems = isAdmin ? adminMenu : userMenu || [];

  return (
    <>
      {/* الشريط الجانبي العادي (يظهر فقط في الشاشات الكبيرة) */}
      <Box
        w="288px"
        h="100vh"
        bg={colorMode === "light" ? "light.cardBg" : "dark.cardBg"}
        p={4}
        display={{ base: "none", md: "block" }} // إخفاء على الشاشات الصغيرة
      >
        <Flex align="center" mb={4}>
          {user ? (
            <>
              <Avatar
                size="md"
                name={user?.fullName}
                src={user?.gender === "بطل" ? "/images/hero-1.png" : "/images/heroine-1.png"}
                ml={3}
                // filter="sepia(50%) hue-rotate(30deg) brightness(1.0) contrast(1.2)"
              />
              <Text fontSize="lg" fontWeight="bold">
                {user?.fullName}
              </Text>
            </>
          ) : (
            <Heading fontSize={"xl"} fontWeight="bold" my={3}>
              القائمة
            </Heading>
          )}
        </Flex>

        {/* القسم القابل للتمرير */}
        <Box overflowY="auto" maxH="calc(100vh - 80px)" pr={2}>
          <VStack align="start" spacing={5}>
            {menuItems.map((item) => (
              <Flex
                key={item.key}
                fontSize="lg"
                align="center"
                p={3}
                w="full"
                cursor="pointer"
                borderRadius="md"
                bg={
                  activePage === item.key
                    ? useColorModeValue("light.gold", "dark.gold")
                    : "transparent"
                }
                _hover={{ bg: useColorModeValue("light.gold", "dark.gold") }}
                transition="background-color 0.2s"
                onClick={() => onPageChange(item.key)}
              >
                <Icon as={item.icon} ml={3} />
                <Text>{item.label}</Text>
              </Flex>
            ))}

            {/* زر تغيير وضع الإضاءة */}
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              my={3}
              borderRadius={100}
            />
          </VStack>
        </Box>
      </Box>

      {/* القائمة الجانبية المنبثقة للشاشات الصغيرة */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent
          h="full"
          bg={colorMode === "light" ? "light.cardBg" : "dark.cardBg"}
          overflowY="auto" // إضافة خاصية التمرير العمودي
          display={{ base: "block", md: "none" }}
        >
          <DrawerCloseButton />
          <DrawerHeader
            color={useColorModeValue("light.text", "dark.text")}
            fontSize="xl"
            fontWeight="bold"
            dir="ltr"
          >
            لوحة التحكم
          </DrawerHeader>
          <DrawerBody overflowY="auto" maxH="100vh">
            <VStack align="start" spacing={5} mt={3}>
              {menuItems.map((item) => (
                <Flex
                  key={item.key}
                  fontSize="lg"
                  align="center"
                  p={2}
                  cursor="pointer"
                  borderRadius="md"
                  transition="background-color 0.2s"
                  w="full"
                  bg={
                    activePage === item.key
                      ? useColorModeValue("light.gold", "dark.gold")
                      : "transparent"
                  }
                  _hover={{ bg: useColorModeValue("light.gold", "dark.gold") }}
                  onClick={() => {
                    onPageChange(item.key);
                    onClose();
                  }} // تغيير الصفحة عند النقر
                >
                  <Icon as={item.icon} ml={3} />
                  <Text>{item.label}</Text>
                </Flex>
              ))}

              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                mt={4}
                borderRadius={100}
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
