"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import countries from "./countries";
import myImg from "@/public/images/img-register.jpg";
import { useRegister } from "@/src/hooks/useRegister";
import useCustomToast from "@/src/hooks/useCustomToast";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("بطل");
  const [dateOfBirth, setDateOfBirth] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [instagramName, setInstagramName] = useState("");

  const { register, loading, fieldErrors, error } = useRegister();
  const showToast = useCustomToast();

  //  منع السكرول على مستوى الصفحة
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔹 دالة التسجيل
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showToast("خطأ", "كلمة المرور وتأكيدها غير متطابقين", "error");
      return;
    }

    const success = await register({
      fullName,
      email,
      country,
      gender,
      dateOfBirth,
      password,
      instagramName,
    });

    if (success) {
      showToast("نجاح", "تم إنشاء الحساب بنجاح!", "success");
    }
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" height="100vh">
      {/* القسم الأيسر للصورة */}
      <Box flex="1" height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Image src={myImg} alt="تسجيل حساب" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50px" }} />
      </Box>

      {/* القسم الأيمن لنموذج التسجيل */}
      <Box flex="1" bg="white" p={8} boxShadow="md" width="100%" height="100vh" overflow="hidden">
        <Heading size="lg" textAlign="start" mb={2}>تحدي الستين ✨</Heading>
        <Heading size="lg" textAlign="start" mb={2}>أنشئ حسابك الآن وابدأ التحدي</Heading>
        <Text textAlign="start" color="gray.500" mb={6}>سجل بياناتك لتبدأ رحلتك مع التحدي</Text>

        <Stack spacing={4}>
          <HStack spacing={4}>
            <FormControl isRequired isInvalid={fieldErrors?.fullName}>
              <FormLabel>الاسم كامل</FormLabel>
              <Input type="text" placeholder="ادخل اسمك الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Text color="red.500">{fieldErrors?.fullName}</Text>
            </FormControl>

            <FormControl isRequired isInvalid={fieldErrors?.email}>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <Input type="email" placeholder="ادخل بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Text color="red.500">{fieldErrors?.email}</Text>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl isRequired isInvalid={fieldErrors?.password}>
              <FormLabel>كلمة المرور</FormLabel>
              <Input type="password" placeholder="ادخل كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Text color="red.500">{fieldErrors?.password}</Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <Input type="password" placeholder="أعد إدخال كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>اختيار الهوية</FormLabel>
              <RadioGroup value={gender} onChange={setGender}>
                <Stack direction="row">
                  <Radio value="بطل">بطل</Radio>
                  <Radio value="بطلة">بطلة</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl>
              <FormLabel>اسم الانستجرام (اختياري)</FormLabel>
              <Input type="text" placeholder="أدخل اسم المستخدم على إنستجرام" value={instagramName} onChange={(e) => setInstagramName(e.target.value)} />
            </FormControl>

            <FormControl isRequired isInvalid={fieldErrors?.country}>
              <FormLabel>اختر البلد</FormLabel>
              <Select placeholder="اختر بلدك" value={country} onChange={(e) => setCountry(e.target.value)} sx={{ textIndent: "12px" }}>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>{country.name}</option>
                ))}
              </Select>
              <Text color="red.500">{fieldErrors?.country}</Text>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl isRequired isInvalid={fieldErrors?.dateOfBirth}>
              <FormLabel>تاريخ الميلاد</FormLabel>
              <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              <Text color="red.500">{fieldErrors?.dateOfBirth}</Text>
            </FormControl>
          </HStack>

          {error && <Text color="red.500" textAlign="center">{error}</Text>}

          <Button colorScheme="yellow" size="lg" width="100%" isLoading={loading} onClick={handleRegister}>
            تسجيل
          </Button>

          <Text textAlign="center">
            هل لديك حساب بالفعل؟{" "}
            <Link as={NextLink} href="/login" color="blue.500">
              سجل الدخول
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}
