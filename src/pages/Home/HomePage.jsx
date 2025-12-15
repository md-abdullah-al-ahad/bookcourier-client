import BannerSlider from "../../components/home/BannerSlider";
import LatestBooks from "../../components/home/LatestBooks";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import CoverageSection from "../../components/home/CoverageSection";
import StatisticsSection from "../../components/home/StatisticsSection";
import Testimonials from "../../components/home/Testimonials";
import ReadingJourney from "../../components/home/ReadingJourney";
import CuratedCollections from "../../components/home/CuratedCollections";

/**
 * HomePage Component
 * Main landing page with all home sections
 */
const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider - Full Width */}
      <BannerSlider />

      {/* Latest Books Section */}
      <LatestBooks />

      {/* Animated Journey Section */}
      <ReadingJourney />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Curated Collections Section */}
      <CuratedCollections />

      {/* Coverage Section */}
      <CoverageSection />

      {/* Statistics Section - Full Width with Animation */}
      <StatisticsSection />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default HomePage;
