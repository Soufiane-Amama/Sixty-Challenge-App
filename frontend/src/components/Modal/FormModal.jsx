import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react';
  
  const FormModal = ({ isOpen, onClose, title, children, handleSaveChanges, type }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="md"> {/* يمكنك تغيير الحجم هنا */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody
          maxHeight="60vh" // تعيين أقصى ارتفاع للـ ModalBody
          overflowY="auto" // إضافة سكرول عمودي
        >
          {children}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
            {type === "edit" ? "حفظ التعديلات" : type === "log" ? "توثيق" : type === "subscription" ? "اشتراك" : "إضافة"}
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            إلغاء
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  
  export default FormModal;