import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "The Midnight Library",
    description:
      "Between life and death there is a library filled with the stories of every path you could have taken. Nora Seed opens one and learns how small decisions reshape everything.",
    short:
      "An imaginative, hope-filled novel about second chances and the courage to choose your own ending.",
    heroImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80",
    coverImage: "https://i.ibb.co/TBDxKRjp/the-midnight.jpg",
    background: "from-amber-50 via-orange-50 to-amber-100",
    pill: "bg-orange-100 text-orange-800",
    bullet: "bg-orange-500",
    tag: "Heartfelt fiction",
    metaOne: "Fiction - 304 pages",
    metaTwo: "Next-day courier eligible",
  },
  {
    id: 2,
    title: "Project Hail Mary",
    description:
      "Ryland Grace wakes alone on a silent ship far from Earth. His only chance to save humanity is to decipher an alien mystery and accept an unexpected partner.",
    short:
      "A propulsive science adventure packed with puzzles, humor, and the thrill of first contact.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    coverImage: "https://i.ibb.co/6c1BTcd4/project-hail-marry.jpg",
    background: "from-blue-50 via-indigo-50 to-cyan-100",
    pill: "bg-blue-100 text-blue-800",
    bullet: "bg-blue-500",
    tag: "Smart sci-fi",
    metaOne: "Sci-fi - 496 pages",
    metaTwo: "Signature delivery available",
  },
  {
    id: 3,
    title: "Atomic Habits",
    description:
      "Tiny, daily improvements compound into remarkable change. James Clear breaks down a system for building habits that actually stick.",
    short:
      "Actionable, evidence-backed strategies that make good habits inevitable and bad ones harder to repeat.",
    heroImage:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80",
    coverImage: "https://i.ibb.co/G3HTZ26s/atomic-habits-dots.png",
    background: "from-emerald-50 via-lime-50 to-green-100",
    pill: "bg-emerald-100 text-emerald-800",
    bullet: "bg-emerald-500",
    tag: "Practical non-fiction",
    metaOne: "Non-fiction - 320 pages",
    metaTwo: "Pickup and courier options",
  },
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = slides.length;

  useEffect(() => {
    if (isPaused || totalSlides === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  return (
    <section
      className="relative w-full min-h-[560px] md:min-h-[640px] lg:min-h-[680px] overflow-hidden bg-base-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

      {slides.map((slide, index) => {
        const isActive = index === currentSlide;

        return (
          <article
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.heroImage}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.background} opacity-80 mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/45 to-black/30" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 32%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 40% 60%, rgba(255,255,255,0.2), transparent 32%)",
                }}
              />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10 min-h-[520px]">
              <div className="lg:w-7/12 space-y-4 md:space-y-6 text-white drop-shadow-sm">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${slide.pill}`}
                >
                  Featured read
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${slide.bullet}`}
                    />
                    <span>{slide.metaOne}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50" />
                    <span>{slide.metaTwo}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to="/books" className="btn btn-primary gap-2">
                    Explore this title
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="btn btn-outline border-white/50 text-white hover:border-white hover:bg-white/10 gap-2"
                  >
                    Next recommendation
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="lg:w-5/12 relative">
                <div className="absolute -inset-6 bg-white/30 blur-3xl hidden lg:block" />
                <div className="relative max-w-sm w-full mx-auto rounded-3xl bg-base-100/90 backdrop-blur border border-white/40 shadow-2xl overflow-hidden">
                  <div className="aspect-[2/3] w-full bg-base-200">
                    <img
                      src={slide.coverImage}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-3 text-base-content">
                    <p className="text-sm leading-relaxed text-base-content/70">
                      {slide.short}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>{slide.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <button
        type="button"
        onClick={prevSlide}
        className="btn btn-circle btn-ghost absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-base-content border-none shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="btn btn-circle btn-ghost absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-base-content border-none shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-10"
                : "bg-base-content/30 w-3 hover:bg-base-content/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;
