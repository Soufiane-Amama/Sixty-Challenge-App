"use client";

import { useState } from "react";
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
  Card,
  CardBody,
  HStack,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// بيانات التحديات
const initialChallenges = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `تحدي الستين ${i + 1}`,
  description: "التزم بالعادات الصحية لمدة 60 يومًا!",
  startTime: "1 أبريل 2025",
  endTime: "30 مايو 2025",
}));

export default function ManageChallenges() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [challenges, setChallenges] = useState(initialChallenges);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  // إضافة تحدي جديد
  const handleAddChallenge = () => {
    setChallenges([...challenges, { id: challenges.length + 1, ...newChallenge }]);
    setNewChallenge({ title: "", description: "", startTime: "", endTime: "" });
    onClose();
  };

  // حذف تحدي
  const handleDelete = (id) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id));
  };

  return (
    <Box p={5} bg="gray.50" minH="100vh">
      <HStack justify="space-between" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">⚙️ إدارة التحديات للمشرف</Text>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
          إضافة تحدي جديد
        </Button>
      </HStack>

      {/* عرض كـ جدول في الشاشات الكبيرة */}
      <Box display={{ base: "none", md: "block" }}>
        <Table variant="simple" bg="white" shadow="md" borderRadius="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>رقم التحدي</Th>
              <Th>الوصف</Th>
              <Th>وقت البداية</Th>
              <Th>وقت النهاية</Th>
              <Th>الإجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {challenges.map((challenge) => (
              <Tr key={challenge.id}>
                <Td>{challenge.id}</Td>
                <Td>{challenge.description}</Td>
                <Td>{challenge.startTime}</Td>
                <Td>{challenge.endTime}</Td>
                <Td>
                  <HStack>
                    <IconButton icon={<FaEdit />} aria-label="تعديل" colorScheme="yellow" />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="حذف"
                      colorScheme="red"
                      onClick={() => handleDelete(challenge.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* عرض كـ بطاقات في الشاشات الصغيرة */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} display={{ base: "grid", md: "none" }}>
        {challenges.map((challenge) => (
          <Card key={challenge.id} p={5} shadow="md" bg="white" borderRadius="md">
            <CardBody>
              <Text fontSize="xl" fontWeight="bold">{challenge.title}</Text>
              <Text fontSize="sm" color="gray.600" my={2}>{challenge.description}</Text>
              <Text fontSize="sm" color="gray.500">📅 يبدأ: {challenge.startTime}</Text>
              <Text fontSize="sm" color="gray.500">⏳ ينتهي: {challenge.endTime}</Text>
              <HStack mt={3}>
                <Button leftIcon={<FaEdit />} colorScheme="yellow" size="sm">تعديل</Button>
                <Button leftIcon={<FaTrash />} colorScheme="red" size="sm" onClick={() => handleDelete(challenge.id)}>
                  حذف
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* نافذة إضافة تحدي جديد */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>إضافة تحدي جديد</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>عنوان التحدي</FormLabel>
                <Input
                  placeholder="مثال: تحدي الستين الجديد"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>وصف التحدي</FormLabel>
                <Input
                  placeholder="وصف مختصر عن التحدي"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                />
              </FormControl>

              <HStack>
                <FormControl>
                  <FormLabel>وقت البداية</FormLabel>
                  <Input
                    type="date"
                    value={newChallenge.startTime}
                    onChange={(e) => setNewChallenge({ ...newChallenge, startTime: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>وقت النهاية</FormLabel>
                  <Input
                    type="date"
                    value={newChallenge.endTime}
                    onChange={(e) => setNewChallenge({ ...newChallenge, endTime: e.target.value })}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddChallenge}>
              إضافة التحدي
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
