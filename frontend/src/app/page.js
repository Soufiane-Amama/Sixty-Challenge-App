"use client"

import { Box, Container } from "@chakra-ui/react";
import Navbar from "@/src/components/Navbar/Navbar";
import HeroSection from "@/src/components/HeroSection/HeroSection";
import CardsSection from "@/src/components/CardsSection/CardsSection";
import FeaturesSection from "@/src/components/FeaturesSection/FeaturesSection";
import ChallengeComparison from "@/src/components/ChallengeComparison/ChallengeComparison";
import StatsSection from "@/src/components/StatsSection/StatsSection";
import TestimonialsSection from "@/src/components/TestimonialsSection/TestimonialsSection";
import FAQSection from "@/src/components/FAQSection/FAQSection";
import Footer from "@/src/components/Footer/Footer";
import CallToAction from "@/src/components/CallToAction/CallToAction";

export default function Home() {
  return (
    <Box>
      <Navbar />
      <HeroSection />
      <Container maxW="container.xl">
          <CardsSection />
          <FeaturesSection />
          <ChallengeComparison />
          <StatsSection />
          <TestimonialsSection />
          <FAQSection />
          <CallToAction />
      </Container>
      <Footer />
    </Box>
);
}
