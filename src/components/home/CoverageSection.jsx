import { MapPin, Check } from "lucide-react";

const CoverageSection = () => {
  const cities = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  return (
    <section className="py-16 px-4 bg-base-200">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            We Deliver Across Bangladesh
          </h2>
          <p className="text-base-content/70 text-lg">
            Fast and reliable book delivery in major cities
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <div
              key={city}
              className="card card-compact bg-base-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="card-body items-center text-center">
                {/* Map Pin Icon */}
                <div className="mb-3">
                  <MapPin className="w-12 h-12 text-primary" strokeWidth={2} />
                </div>

                {/* City Name */}
                <h3 className="card-title text-lg">{city}</h3>

                {/* Available Badge */}
                <div className="badge badge-success gap-1 mt-2">
                  <Check className="w-3 h-3" />
                  Available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
