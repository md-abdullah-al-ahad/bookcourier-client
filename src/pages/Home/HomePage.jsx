import BannerSlider from "../../components/home/BannerSlider";
import LatestBooks from "../../components/home/LatestBooks";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import CoverageSection from "../../components/home/CoverageSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Latest Books Section */}
      <LatestBooks />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Coverage Section */}
      <CoverageSection />
    </div>
  );
};

export default HomePage;
