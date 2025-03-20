"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { FaMedal } from "react-icons/fa";
import hero from "@/public/images/hero-1.png";
import heroine from "@/public/images/heroine-1.png";

import { useEffect, useState } from "react";
import FormModal from '@/src/components/Modal/FormModal';
import ConfirmModal from "@/src/components/Modal/ConfirmModal";
import useCustomToast from "@/src/hooks/useCustomToast";
import useGetData from "@/src/hooks/useGetData";
import useUpdateData from "@/src/hooks/useUpdateData";
import useDeleteData from "@/src/hooks/useDeleteData";
import {  } from "@/src/config/urls";


// بيانات الأبطال (مثال)
const champions = [
  { id: 1, name: "طارق إبراهيم", points: 1000, image: "/images/hero-.png", rank: "gold" },
  { id: 2, name: "معتصم يوسف", points: 900, image: "/images/hero-.png", rank: "silver" },
  { id: 3, name: "بشرى معتصم", points: 800, image: "/images/heroine-.png", rank: "bronze" },
  { id: 4, name: "سعيد خالد", points: 700, image: "/images/hero-.png" },
  { id: 5, name: "مريم عبدالله", points: 650, image: "/images/heroine-.png" },
  { id: 6, name: "حسين محمود", points: 600, image: "/images/hero-.png" },
  { id: 7, name: "رغد عمر", points: 550, image: "/images/hero-.png" },
  { id: 8, name: "عمر أحمد", points: 500, image: "/images/hero-.png" },
  { id: 9, name: "ياسمين حسن", points: 450, image: "/images/heroine-.png" },
];

export default function ChampionsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChampion, setSelectedChampion] = useState(null);

  // فتح النافذة وعرض بيانات البطل
  const handleOpenModal = (champion) => {
    setSelectedChampion(champion);
    onOpen();
  };

  // ألوان الميداليات
  const rankColors = {
    gold: "yellow.400",
    silver: "gray.400",
    bronze: "orange.500",
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        أبطال المتصدرين 🏆
      </Text>

      {/* أفضل 3 أبطال */}
      <HStack justify="center" spacing={10} mb={10}>
        {champions.slice(0, 3).map((champion, index) => (
          <VStack key={champion.id} spacing={3} onClick={() => handleOpenModal(champion)} cursor="pointer">
            <Box
              borderWidth={3}
              borderColor={rankColors[champion.rank]}
              borderRadius="full"
              p={1}
              position="relative"
            >
              <Avatar size="xl" src={champion.image} />
              <IconButton
                icon={<FaMedal />}
                isRound
                size="sm"
                position="absolute"
                bottom={0}
                left="50%"
                transform="translateX(-50%)"
                bg={rankColors[champion.rank]}
                color="white"
              />
            </Box>
            <Text fontWeight="bold">{champion.name}</Text>
            <Text color="gray.600">{champion.points} نقطة</Text>
          </VStack>
        ))}
      </HStack>

      {/* باقي الأبطال */}
      <Table variant="simple" bg="white" borderRadius="md" shadow="md">
        <Thead bg="yellow.300">
          <Tr>
            <Th textAlign="right">الترتيب</Th>
            <Th textAlign="right">الصورة</Th>
            <Th textAlign="right">الاسم</Th>
            <Th textAlign="right">النقاط</Th>
          </Tr>
        </Thead>
        <Tbody>
          {champions.slice(3).map((champion, index) => (
            <Tr key={champion.id} onClick={() => handleOpenModal(champion)} cursor="pointer" _hover={{ bg: "gray.100" }}>
              <Td>{index + 4}</Td>
              <Td>
                <Avatar size="sm" src={champion.image} />
              </Td>
              <Td>{champion.name}</Td>
              <Td>{champion.points} نقطة</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* نافذة عرض معلومات البطل */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>معلومات البطل</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            {selectedChampion && (
              <>
                <Avatar size="xl" src={selectedChampion.image} mb={4} />
                <Text fontSize="lg" fontWeight="bold">{selectedChampion.name}</Text>
                <Text color="gray.600">{selectedChampion.points} نقطة</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="blue">
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
