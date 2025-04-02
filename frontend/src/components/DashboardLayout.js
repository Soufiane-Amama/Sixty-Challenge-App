"use client";

import { useState } from "react";
import Header from "@/src/components/DashboardHeader/Header";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useApp } from '@/src/context/AppContext';

// تحميل الصفحات ديناميكيًا
const ChampionsPage = dynamic(() => import("@/src/app/dashboard/champions/page"));
const AnnouncedChallengesPage = dynamic(() => import("@/src/app/dashboard/announcedChallenges/page"));
const MyChallengesPage = dynamic(() => import("@/src/app/dashboard/myChallenges/page"));
const DaysGrid = dynamic(() => import("@/src/app/dashboard/DaysGrid/page"));
const WeeklyPerformancePage = dynamic(() => import("@/src/app/dashboard/weeklyPerformance/page"));
const QRScannerPage = dynamic(() => import("@/src/app/dashboard/qrScanner/page"));
const AchievementsPage = dynamic(() => import("@/src/app/dashboard/achievements/page"));
const ManageChallengesPage = dynamic(() => import("@/src/app/dashboard/(admin)/manageChallenges/page"));
const ManageUsers = dynamic(() => import("@/src/app/dashboard/(admin)/manageUsers/page"));
const SettingsPage = dynamic(() => import("@/src/app/dashboard/settings/page"));
const MindMapPage = dynamic(() => import("@/src/app/dashboard/mindmap/page"));
const ProfilePage = dynamic(() => import("@/src/app/dashboard/profile/page"));
const HomePage = dynamic(() => import("@/src/app/dashboard/homePage/page"));


const DashboardLayout = () => {
  const { startDate, setStartDate, endDate, setEndDate, setChallenge, challenge, activePage, setActivePage } = useApp(); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAdmin, setIsAdmin] = useState(true);
  // const [activePage, setActivePage] = useState("dashboard");

    // حالة إضافية للاحتفاظ بمعرف التحدي الذي سنعرض أيامه في DaysGrid
    const [daysGridChallengeId, setDaysGridChallengeId] = useState(null);

    // دالة لتغيير الصفحة
    const handlePageChange = (page) => {
      setActivePage(page);
    };

  // دالة تُستدعى عند الضغط على زر العين في صفحة التحديات
  // حيث نستقبل challengeId ونُحدِّث الحالة
  const handleShowDaysGrid = (challengeId, start, end, challenge) => {
    setDaysGridChallengeId(challengeId);
    setChallenge(challenge);
    setStartDate(start);
    console.log("START: ", startDate);
    setEndDate(end);
    console.log("END: ", endDate);
    setActivePage("daysGrid");
  };

  // تحديد الصفحة المراد عرضها
  const renderPage = () => {
    switch (activePage) {
      case "manageUsers":
        return <ManageUsers />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <ProfilePage />;
      case "champions":
        return <ChampionsPage />;
      case "announcedChallenges":
        return <AnnouncedChallengesPage />;
      case "myChallenges":
        return <MyChallengesPage onShowDaysGrid={handleShowDaysGrid} />;
      case "daysGrid":
        return <DaysGrid challengeId={daysGridChallengeId} startDate={startDate} endDate={endDate} challenge={challenge} />;
      case "weeklyPerformance":
        return <WeeklyPerformancePage />;
      case "qrScanner":
        return <QRScannerPage />;
      case "achievements":
        return <AchievementsPage />;
      case "mindmap":
        return <MindMapPage />;
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
