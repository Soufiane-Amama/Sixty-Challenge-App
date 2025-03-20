"use client";

import { 
  Flex, 
  Text, 
  Spacer, 
  IconButton, 
  useColorModeValue, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button 
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiLogOut, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";
import useCustomToast from "@/src/hooks/useCustomToast";
import { useApp } from '@/src/context/AppContext';


const Header = ({ onSidebarOpen }) => {
  const { logout } = useApp(); 
  const { showToast } = useCustomToast();
  const router = useRouter();

  const _logout = () => {
    logout();
    showToast("تم تسجيل الخروج بنجاح", "success");
  };

  return (
    <Flex 
      w="100%" 
      p={4} 
      bg={useColorModeValue("light.cardBg", "dark.cardBg")} 
      align="center"
    >
      {/* زر فتح القائمة في الشاشات الصغيرة فقط */}
      <IconButton 
        aria-label="فتح القائمة" 
        icon={<HamburgerIcon />} 
        display={{ base: "block", md: "none" }} 
        onClick={onSidebarOpen}
        bg={useColorModeValue("light.icon", "dark.icon")}
        // _hover={{ bg: useColorModeValue("light.gold", "dark.hover") }}
        ml={2}
      />
      <Text fontSize="lg" fontWeight="bold">لوحة التحكم</Text>
      <Spacer />
      {/* إخفاء "مرحبا بك" على الشاشات الصغيرة */}
      <IconButton 
        aria-label="الصفحة الرئيسية" 
        icon={<FiHome />} 
        // display={{ base: "block", md: "none" }} 
        onClick={() => router.push("/")}
        bg={useColorModeValue("light.icon", "dark.icon")}
        // _hover={{ bg: useColorModeValue("light.gold", "dark.hover") }}
        ml={2}
      />
      <Menu>
          <MenuButton 
            as={IconButton} 
            aria-label="Logout" 
            icon={<FiLogOut />} 
            variant="ghost" 
            bg={useColorModeValue("light.icon", "dark.icon")}
          />
          <MenuList>
            <MenuItem>
              <Button 
                colorScheme="red" 
                width="100%" 
                onClick={_logout}
              >
                تأكيد تسجيل الخروج
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
    </Flex>
  );
};

export default Header;
