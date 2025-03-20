import { Box, Flex, Text, Avatar, AvatarGroup } from "@chakra-ui/react";

const HeroBadge = () => {
  return (
    <Box
      bg="purple.100"
      px={4}
      py={2}
      borderRadius="full"
      display="inline-flex"
      alignItems="center"
    >
      <Text fontSize="sm" fontWeight="bold" ml={2}>
        🚀 100+ ألف بطل وبطلة
      </Text>
      <AvatarGroup size="xs" max={3}>
        <Avatar name="" src="/avatars/avatar-2.png" />
        <Avatar name="" src="/avatars/avatar-3.png" />
        <Avatar name="" src="/avatars/avatar-1.png" />
        <Avatar name="" src="/avatars/avatar-1.png" />
      </AvatarGroup>
    </Box>
  );
};

export default HeroBadge;
