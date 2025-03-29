import { Box } from "@chakra-ui/react";
import { Handle, Position } from "react-flow-renderer";

const CustomNode = ({ data }) => {
  return (
    <Box
      p={4}
      bg={data.color || "gray.200"} // ✅ استخدام اللون المستلم
      color="white"
      borderRadius="md"
      textAlign="center"
      fontWeight="bold"
      boxShadow="md"
    >
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default CustomNode;