import { Box, Flex, Text, Button, Spacer, HStack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, useDisclosure } from "@chakra-ui/react";
import { Link as ScrollLink } from "react-scroll";
import { HamburgerIcon } from "@chakra-ui/icons";
import { links } from "./data";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box bg="white" px={{ base: 4, md: 10 }} py={4} boxShadow="sm" position="fixed" top="0" left="0" w="full" zIndex="100">
      <Flex align="center">
        {/* الشعار */}
        <Text fontSize="xl" fontWeight="bold" color="black" cursor="pointer">
          تحدي الستين<span style={{ color: "#FFC107" }}>⭐</span>
        </Text>

        <Spacer />

        {/* روابط التنقل في الشاشات الكبيرة */}
        <HStack display={{ base: "none", md: "flex" }} spacing={6}>
          {links.map((link) => (
            <ScrollLink key={link.id} to={link.to} smooth={true} duration={800} offset={-80}>
              <Text fontSize="md" color="gray.700" _hover={{ color: "yellow.500" }} cursor="pointer">{link.title}</Text>
            </ScrollLink>
          ))}
        </HStack>

        <Spacer />

        {/* أزرار التسجيل في الشاشات الكبيرة */}
        <HStack display={{ base: "none", md: "flex" }} spacing={4}>
          <Button size="md" variant="ghost" color="gray.700" _hover={{ bg: "gray.100" }} onClick={() => router.push("/login")}>
            تسجيل الدخول
          </Button>
          <Button size="md" bg="yellow.400" color="black" _hover={{ bg: "yellow.300" }} onClick={() => router.push("/register")}>
            انضم الآن مجانا
          </Button>
        </HStack>

        {/* زر القائمة الجانبية في الهاتف */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onOpen}
          aria-label="فتح القائمة"
          ml={2}
        />
      </Flex>

      {/* القائمة الجانبية للجوال */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader dir="ltr">القائمة</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" justifyContent="space-between" mt={4}>
            {/* الروابط */}
            <VStack spacing={4} align="start" dir="ltr">
              {links.map((link) => (
                <ScrollLink
                  key={link.id}
                  to={link.to}
                  smooth={true}
                  duration={800}
                  offset={-80}
                  onClick={onClose} // ✨ إضافة هذه الخاصية لغلق القائمة بعد النقر
                >
                  <Text
                    fontSize="md"
                    color="gray.700"
                    _hover={{ color: "yellow.500" }}
                    cursor="pointer"
                  >
                    {link.title}
                  </Text>
                </ScrollLink>
              ))}
            </VStack>

            {/* الأزرار  */}
            <VStack spacing={3} align="stretch">
              <Button size="md" variant="ghost" color="gray.700" _hover={{ bg: "gray.100" }} w="full" onClick={() => router.push("/login")}>
                تسجيل الدخول
              </Button>
              <Button size="md" bg="yellow.400" color="black" _hover={{ bg: "yellow.300" }} w="full" onClick={() => router.push("/register")}>
                انضم الآن مجانا
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
