import { useState, useEffect, useRef } from "react";
import { BookOpen, Users, MapPin, Award } from "lucide-react";

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    books: 0,
    customers: 0,
    cities: 0,
    years: 0,
  });
  const sectionRef = useRef(null);

  const statistics = [
    {
      id: "books",
      icon: BookOpen,
      title: "Books Available",
      target: 10000,
      suffix: "+",
      duration: 2000,
    },
    {
      id: "customers",
      icon: Users,
      title: "Happy Customers",
      target: 5000,
      suffix: "+",
      duration: 2000,
    },
    {
      id: "cities",
      icon: MapPin,
      title: "Cities Covered",
      target: 8,
      suffix: "",
      duration: 1500,
    },
    {
      id: "years",
      icon: Award,
      title: "Years of Service",
      target: 3,
      suffix: "+",
      duration: 1500,
    },
  ];

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const animateCounter = (stat) => {
      const increment = stat.target / (stat.duration / 50);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          setCounts((prev) => ({ ...prev, [stat.id]: stat.target }));
          clearInterval(timer);
        } else {
          setCounts((prev) => ({ ...prev, [stat.id]: Math.floor(current) }));
        }
      }, 50);

      return timer;
    };

    const timers = statistics.map((stat) => animateCounter(stat));

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ",000";
    }
    return num.toString();
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 bg-gradient-to-r from-primary via-secondary to-accent text-primary-content"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="stats stats-vertical md:stats-horizontal shadow-xl w-full bg-base-100 text-base-content">
          {statistics.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="stat">
                <div className="stat-figure text-primary">
                  <IconComponent className="w-8 h-8" strokeWidth={2} />
                </div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value text-primary">
                  {stat.id === "books" || stat.id === "customers"
                    ? formatNumber(counts[stat.id])
                    : counts[stat.id]}
                  {stat.suffix}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
