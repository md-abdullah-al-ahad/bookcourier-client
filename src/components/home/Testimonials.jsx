import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "BookCourier has made my research so much easier. I can access academic books from multiple libraries without leaving my desk. The delivery is fast and reliable!",
      name: "Fatima Rahman",
      role: "PhD Student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      rating: 5,
    },
    {
      id: 2,
      text: "As a book lover, this service is a dream come true. The selection is amazing and the prices are very reasonable. I've been using it for months now!",
      name: "Arif Hassan",
      role: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arif",
      rating: 5,
    },
    {
      id: 3,
      text: "The delivery is always on time and books arrive in perfect condition. Customer service is excellent and very helpful. Highly recommend BookCourier!",
      name: "Nadia Khan",
      role: "Teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 px-4 bg-linear-to-br from-secondary/10 to-accent/10">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            What Our Readers Say
          </h2>
          <p className="text-base-content/70 text-lg">
            Hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="card-body">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote
                    className="w-10 h-10 text-primary"
                    fill="currentColor"
                  />
                </div>

                {/* Testimonial Text */}
                <p className="text-base-content/80 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Rating */}
                <div className="rating rating-sm mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < testimonial.rating
                          ? "text-orange-400 fill-orange-400"
                          : "text-base-300"
                      }`}
                    />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-base-300">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-base-content/70">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
