"use client";

import { useState } from "react";
import Header from "@/src/components/DashboardHeader/Header";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";

// تحميل الصفحات ديناميكيًا
const ChampionsPage = dynamic(() => import("@/src/app/dashboard/champions/page"));
const AnnouncedChallengesPage = dynamic(() => import("@/src/app/dashboard/announcedChallenges/page"));
const MyChallengesPage = dynamic(() => import("@/src/app/dashboard/myChallenges/page"));
const WeeklyPerformancePage = dynamic(() => import("@/src/app/dashboard/weeklyPerformance/page"));
const QRScannerPage = dynamic(() => import("@/src/app/dashboard/qrScanner/page"));
const AchievementsPage = dynamic(() => import("@/src/app/dashboard/achievements/page"));
const ManageChallengesPage = dynamic(() => import("@/src/app/dashboard/(admin)/manageChallenges/page"));
const ManageUsers = dynamic(() => import("@/src/app/dashboard/(admin)/manageUsers/page"));
const SettingsPage = dynamic(() => import("@/src/app/dashboard/settings/page"));
const HomePage = dynamic(() => import("@/src/app/dashboard/homePage/page"));


const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAdmin, setIsAdmin] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

    // دالة لتغيير الصفحة
    const handlePageChange = (page) => {
      setActivePage(page);
    };

  // تحديد الصفحة المراد عرضها
  const renderPage = () => {
    switch (activePage) {
      case "manageUsers":
        return <ManageUsers />;
      case "settings":
        return <SettingsPage />;
      case "champions":
        return <ChampionsPage />;
      case "announcedChallenges":
        return <AnnouncedChallengesPage />;
      case "myChallenges":
        return <MyChallengesPage />;
      case "weeklyPerformance":
        return <WeeklyPerformancePage />;
      case "qrScanner":
        return <QRScannerPage />;
      case "achievements":
        return <AchievementsPage />;
      case "manageChallenges":
        return <ManageChallengesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Flex h="100vh">
      {/* الشريط الجانبي العادي (يختفي على الشاشات الصغيرة) */}
      <Sidebar 
        isOpen={isOpen} 
        onClose={onClose} 
        isAdmin={isAdmin} 
        onPageChange={handlePageChange}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* المحتوى الرئيسي */}
      <Box flex="1" bg={useColorModeValue("light.bg", "dark.bg")} p={4} overflowY="auto" h="100vh" boxShadow="sm">
        {/* زر الفتح موجود داخل الهيدر */}
        <Header onSidebarOpen={onOpen} />
        {renderPage()}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
