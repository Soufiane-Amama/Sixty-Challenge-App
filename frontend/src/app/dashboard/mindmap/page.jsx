"use client";

import { useState, useRef } from "react";
import { Box, Button, Input, VStack, Stack, Heading, Text } from "@chakra-ui/react";
import { toPng, toSvg } from "html-to-image"
import apiClient from "@/src/config/axios";
import ReactFlow, { Background, ReactFlowProvider } from "react-flow-renderer"; 
import CustomNode from "@/src/components/CustomNode/CustomNode"; // ✅ استيراد العقدة المخصصة

const nodeTypes = { custom: CustomNode }; // ✅ تعريف نوع العقدة المخصصة

const MindMapPage = () => {
  const flowRef = useRef(null);
  const [goal, setGoal] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateMindMap = async () => {
    if (!goal) {
      alert("يرجى إدخال هدف!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await apiClient.post("/api/mindmap", { userGoal: goal });
  
      // تحويل الخطوات إلى عقد منفصلة
      const mindMapNodes = response.data.nodes.map((node, index) => ({
        id: node.id,
        type: "custom", // العقدة المخصصة
        data: { label: node.label, color: node.color }, // ✅ تمرير اللون
        position: { x: (index % 2) * 200, y: index * 150 },
      }));
      
      const mindMapEdges = response.data.nodes
      .filter(node => node.parent !== null)
      .map(node => ({
        id: `edge-${node.id}`,
        source: node.parent.toString(),  // تأكد أن المعرفات نصوص
        target: node.id.toString(),
        animated: true,
        style: { stroke: "#333", strokeWidth: 2 }
      }));
    
  
      setNodes(mindMapNodes);
      setEdges(mindMapEdges);
    } catch (error) {
      console.error("Error fetching mind map:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadImage = async (type = "png") => {
    if (!flowRef.current) return;
    
    try {
      const dataUrl =
        type === "png"
          ? await toPng(flowRef.current)
          : await toSvg(flowRef.current);
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `flowchart.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("حدث خطأ أثناء حفظ الصورة:", error);
    }
  };

  return (
    <Box p={5} minH="100vh" bg="gray.50">
      <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
        <Heading as="h2" size="xl" textAlign="center" color="teal.500">
          خريطة لهدف تحدي 60
        </Heading>
        <Text textAlign="center" color="gray.600">
          أدخل هدفك في تحدي الستين لإنشاء خريطة باستخدام الذكاء الاصطناعي تساعدك
          على تحقيق أهدافك بوضوح، وتخطيط مهامك بذكاء🚀💡
        </Text>

        <VStack spacing={4}>
          <Input
            placeholder="أدخل هدفك (مثل: تعلم مهارة جديدة)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            size="lg"
            focusBorderColor="teal.500"
          />
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleGenerateMindMap}
            isLoading={loading}
            loadingText="جارٍ التوليد..."
          >
            إنشاء الخريطة
          </Button>
        </VStack>

        {!!nodes.length && (
          <Box
            display="flex"
            flexDirection="column"
            gap={4}
            p={5}
            minH="100vh"
            bg="gray.50"
          >
            {/* 🔹 الحاوية الرئيسية للخريطة */}
            <Box
              ref={flowRef}
              h="500px"
              w="100%"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="white"
              overflow="hidden" // منع أي تجاوزات
            >
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes} // تحديد نوع العقد
                  style={{ width: "100%", height: "100%" }}
                  nodesDraggable={false}
                  fitView // يكفي دون الحاجة لـ defaultZoom={1}
                >
                  <Background color="gray.300" gap={16} />
                </ReactFlow>
              </ReactFlowProvider>
            </Box>

            {/* 🔹 أزرار التحميل بتنسيق أفضل */}
            <Stack direction="row" spacing={4} display="flex" justifyContent="center">
              <Button colorScheme="blue" onClick={() => downloadImage("png")}>
                تحميل كصورة PNG
              </Button>
              <Button colorScheme="green" onClick={() => downloadImage("svg")}>
                تحميل كملف SVG
              </Button>
            </Stack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MindMapPage;
