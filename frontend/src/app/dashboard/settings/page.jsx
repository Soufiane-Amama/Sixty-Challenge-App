"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Select,
  Text,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import countries from "./countries";

const SettingsPage = () => {
  const [gender, setGender] = useState("بطل");

  return (
    <Box flex="1" p="8">
      <Heading as="h2" size="lg" mb="6" mt="4">
        تغيير بيانات الحساب
      </Heading>

      {/* الحقول */}
      <Flex gap="4" mb="4" wrap="wrap">
        <Box flex="1" minWidth="250px">
          <Text mb="2">الاسم كامل</Text>
          <Input placeholder="أدخل اسمك الكامل" />
        </Box>
        <Box flex="1" minWidth="250px">
          <Text mb="2">البريد الإلكتروني</Text>
          <Input placeholder="أدخل بريدك الإلكتروني" />
        </Box>
      </Flex>

      <Flex gap="4" mb="4" wrap="wrap">
        <Box flex="1" minWidth="250px">
          <Text mb="2">كلمة المرور</Text>
          <Input type="password" placeholder="أدخل كلمة المرور" />
        </Box>
        <Box flex="1" minWidth="250px">
          <Text mb="2">تأكيد كلمة المرور</Text>
          <Input type="password" placeholder="أعد إدخال كلمة المرور" />
        </Box>
      </Flex>

      <Flex gap="4" mb="4" wrap="wrap">
        <Box flex="1" minWidth="250px">
          <Text mb="2">اختيار الهوية</Text>
          <RadioGroup onChange={setGender} value={gender}>
            <Stack direction="row">
              <Radio value="بطل">بطل</Radio>
              <Radio value="بطلة">بطلة</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box flex="1" minWidth="250px">
          <Text mb="2">اختيار البلد</Text>
          <Select placeholder="البلد" sx={{ textIndent: "12px" }}>
            {countries.map((country) => (
              <option key={country.code}>{country.name}</option>
            ))}
          </Select>
        </Box>
      </Flex>

      <Box mb="6">
        <Text mb="2">تاج إنستقرام (اختياري)</Text>
        <Input placeholder="أدخل اسم المستخدم على إنستقرام" />
      </Box>

      {/* الأزرار مع توزيعها على الجوانب */}
      <Flex direction={{ base: "column", md: "row" }} gap={2} justify="space-between">
        <Button colorScheme="blue" bg={"blue.500"} w={{ base: "100%", md: "auto" }}>
          حفظ الإعدادات
        </Button>
        <Button colorScheme="red" bg={"red.500"} w={{ base: "100%", md: "auto" }}>
          حذف الحساب
        </Button>
      </Flex>
    </Box>
  );
};

export default SettingsPage;
