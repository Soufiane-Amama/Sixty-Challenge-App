import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>
            تأكيد
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            إلغاء
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;