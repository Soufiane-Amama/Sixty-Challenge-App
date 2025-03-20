"use client";
import {
  Box,
  Button,
  Heading,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  FormErrorMessage, // استيراد عرض الأخطاء تحت الحقل
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import loginImage from "@/public/images/img-login.jpg";
import useCustomToast from "@/src/hooks/useCustomToast";
import { useLogin } from "@/src/hooks/useLogin";

export default function Login() {
  const { showToast } = useCustomToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, fieldErrors, error } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("يرجى إدخال البريد الإلكتروني وكلمة المرور", "error");
      return;
    }

    const success = await login(email, password);
    if (success) {
      showToast("تم تسجيل الدخول بنجاح", "success");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      height="100vh"
    >
      {/* القسم الأيسر - نموذج تسجيل الدخول */}
      <Box
        flex="1"
        bg="white"
        p={8}
        boxShadow="md"
        borderRadius={{ base: "0 0 15px 15px", md: "0 15px 15px 0" }}
        width="100%"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="sm">
          <Heading size="lg" textAlign="start" mb={2}>
            تحدي الستين ✨
          </Heading>
          <Heading size="lg" textAlign="start" mb={2}>
            أهلاً بالأبطال
          </Heading>
          <Text textAlign="start" color="gray.500" mb={6}>
            "أملأ بك في تحدي الستين، الأبطال جاهزون؟ انطلقوا نحو النجاح!"
          </Text>

          {/* عرض رسالة خطأ عامة إذا كانت هناك مشكلة مثل خطأ تسجيل الدخول */}
          {error && (
            <Text color="red.500" textAlign="center" mb={4}>
              {error}
            </Text>
          )}

          <Stack spacing={4}>
            {/* إدخال البريد الإلكتروني مع عرض الأخطاء */}
            <FormControl isRequired isInvalid={!!fieldErrors?.email}>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ادخل بريدك الإلكتروني"
              />
              {fieldErrors?.email && (
                <FormErrorMessage>{fieldErrors.email}</FormErrorMessage>
              )}
            </FormControl>

            {/* إدخال كلمة المرور مع عرض الأخطاء */}
            <FormControl isRequired isInvalid={!!fieldErrors?.password}>
              <FormLabel>كلمة المرور</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ادخل كلمة المرور"
              />
              {fieldErrors?.password && (
                <FormErrorMessage>{fieldErrors.password}</FormErrorMessage>
              )}
            </FormControl>

            <Text textAlign="start" color="blue.500">
              <Link as={NextLink} href="/forgot-password">
                هل نسيت كلمة السر؟
              </Link>
            </Text>

            <Button
              colorScheme="yellow"
              size="lg"
              width="100%"
              isLoading={loading}
              onClick={handleLogin}
            >
              تسجيل الدخول
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* القسم الأيمن - الصورة */}
      <Box
        flex="1"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Image
          src={loginImage}
          alt="تسجيل الدخول"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50px",
          }}
        />
      </Box>
    </Flex>
  );
}
