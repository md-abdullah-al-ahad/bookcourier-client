import {
  Truck,
  BookOpen,
  DollarSign,
  RotateCcw,
  Shield,
  Headphones,
} from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: "Fast Delivery",
      description: "Get books delivered within 24-48 hours",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Wide Selection",
      description: "Access thousands of books from multiple libraries",
    },
    {
      id: 3,
      icon: DollarSign,
      title: "Affordable Prices",
      description: "Budget-friendly rates for all book lovers",
    },
    {
      id: 4,
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Hassle-free return process",
    },
    {
      id: 5,
      icon: Shield,
      title: "Trusted Service",
      description: "Secure payment and reliable delivery",
    },
    {
      id: 6,
      icon: Headphones,
      title: "24/7 Support",
      description: "Customer support always available",
    },
  ];

  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose BookCourier?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="card-body items-center text-center">
                  {/* Icon */}
                  <div className="mb-4 p-4 bg-primary/10 rounded-full">
                    <IconComponent
                      className="w-12 h-12 text-primary"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="card-title text-xl mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
