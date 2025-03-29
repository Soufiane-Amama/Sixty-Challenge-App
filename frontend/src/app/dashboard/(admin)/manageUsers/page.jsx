"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus, FaStar } from "react-icons/fa";
// import users from "./data"; // شكل بيانات المستخدمين التي تأتي من الخادم

// بيانات المستخدمين الافتراضية
const initialUsers = [
  {
    _id: 1,
    fullName: "سفيان عماما",
    gender: "بطل",
    country: "الجزائر",
    dateOfBirth: "2004-08-25",
    instagramName: "",
    email: "user@example.com",
    isAdmin: true,
    about: "تجري الرياح بما لا تشتهي السفن نحن الرياح ونحن البحر والسفن..",
    createdAt: "2023-09-15",
    points: 100,
  },
  {
    _id: 2,
    fullName: "فاطمة الزهراء",
    gender: "بطلة",
    country: "المغرب",
    dateOfBirth: "1998-05-12",
    instagramName: "fatima_hero",
    email: "fatima@example.com",
    isAdmin: false,
    about: "النجاح يأتي لمن يثابر ولا يستسلم!",
    createdAt: "2023-10-20",
    points: 150,
  },
];

export default function ManageUsers() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPoints, setNewPoints] = useState("");

  // حذف مستخدم
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user._id !== id));
  };

  // فتح نافذة التعديل
  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewPoints(user.points);
    onOpen();
  };

  // تعديل بيانات المستخدم (إضافة نقاط)
  const handleUpdateUser = () => {
    setUsers(users.map((user) => 
      user._id === selectedUser._id ? { ...user, points: Number(newPoints) } : user
    ));
    onClose();
  };

  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <HStack justify="space-between" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">⚙️ إدارة الأبطال والبطلات للمشرف</Text>
      </HStack>

      {/* جدول المستخدمين في الشاشات الكبيرة */}
      <Box display={{ base: "none", md: "block" }}>
        <Table variant="simple" bg="white" shadow="md" borderRadius="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>الاسم الكامل</Th>
              <Th>النوع</Th>
              <Th>الدولة</Th>
              <Th>تاريخ الميلاد</Th>
              <Th>الإيميل</Th>
              <Th>النقاط</Th>
              <Th>الإجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user.fullName}</Td>
                <Td>{user.gender}</Td>
                <Td>{user.country}</Td>
                <Td>{user.dateOfBirth}</Td>
                <Td>{user.email}</Td>
                <Td>{user.points} ⭐</Td>
                <Td>
                  <HStack>
                    <IconButton icon={<FaStar />} aria-label="زيادة النقاط" colorScheme="blue" onClick={() => handleEdit(user)} />
                    <IconButton icon={<FaTrash />} aria-label="حذف المستخدم" colorScheme="red" onClick={() => handleDelete(user._id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* بطاقات المستخدمين في الشاشات الصغيرة */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} display={{ base: "grid", md: "none" }}>
        {users.map((user) => (
          <Card key={user._id} p={5} shadow="md" bg="white" borderRadius="md">
            <CardBody>
              <Text fontSize="xl" fontWeight="bold">{user.fullName}</Text>
              <Text fontSize="sm" color="gray.600" my={2}>{user.about}</Text>
              <Text fontSize="sm" color="gray.500">📍 الدولة: {user.country}</Text>
              <Text fontSize="sm" color="gray.500">📅 تاريخ الميلاد: {user.dateOfBirth}</Text>
              <Text fontSize="sm" color="gray.500">📧 {user.email}</Text>
              <Text fontSize="sm" color="gray.500">⭐ النقاط: {user.points}</Text>
              <HStack mt={3}>
                <Button leftIcon={<FaStar />} colorScheme="blue" size="sm" onClick={() => handleEdit(user)}>إضافة نقاط</Button>
                <Button leftIcon={<FaTrash />} colorScheme="red" size="sm" onClick={() => handleDelete(user._id)}>حذف</Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* نافذة تعديل المستخدم */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تعديل بيانات {selectedUser?.fullName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>النقاط الحالية</FormLabel>
                <Input
                  type="number"
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateUser}>
              حفظ التعديلات
            </Button>
            <Button variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
