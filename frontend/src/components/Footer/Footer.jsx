import { Box, Flex, Link, Text, IconButton, Stack } from "@chakra-ui/react";
import { FaYoutube, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

const Footer = () => {
  return (
    <Box bg="black" color="white" py={6} textAlign="center">
      {/* روابط التصفح */}
      <Flex
        justify="center"
        wrap="wrap"
        gap={{ base: 4, md: 8 }}
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="bold"
        mb={4}
      >
        <ScrollLink to="challenge" smooth={true} duration={800} offset={-80}>
        <Text _hover={{ textDecoration: "none", color: "gray.400" }} cursor="pointer">عن التحدي</Text>
        </ScrollLink>
        <ScrollLink to="features" smooth={true} duration={800} offset={-80}>
          <Text _hover={{ textDecoration: "none", color: "gray.400" }} cursor="pointer">المميزات</Text>
        </ScrollLink>
        <ScrollLink to="faq" smooth={true} duration={800} offset={-80}>
          <Text _hover={{ textDecoration: "none", color: "gray.400" }} cursor="pointer">الأسئلة الشائعة</Text> 
        </ScrollLink>
      </Flex>

      {/* أيقونات السوشيال ميديا */}
      <Stack direction="row" justify="center" spacing={4} mb={4}>
        <IconButton as="a" href="#" icon={<FaYoutube />} aria-label="YouTube" variant="ghost" color="white" fontSize="lg" _hover={{ color: "gray.400" }} />
        <IconButton as="a" href="#" icon={<FaFacebook />} aria-label="Facebook" variant="ghost" color="white" fontSize="lg" _hover={{ color: "gray.400" }} />
        <IconButton as="a" href="#" icon={<FaTwitter />} aria-label="Twitter" variant="ghost" color="white" fontSize="lg" _hover={{ color: "gray.400" }} />
        <IconButton as="a" href="#" icon={<FaInstagram />} aria-label="Instagram" variant="ghost" color="white" fontSize="lg" _hover={{ color: "gray.400" }} />
        <IconButton as="a" href="#" icon={<FaLinkedin />} aria-label="LinkedIn" variant="ghost" color="white" fontSize="lg" _hover={{ color: "gray.400" }} />
      </Stack>

      {/* حقوق النشر */}
      <Text fontSize="sm" color="gray.400">
        &copy; 2025 كل الحقوق محفوظة
      </Text>
    </Box>
  );
};

export default Footer;
