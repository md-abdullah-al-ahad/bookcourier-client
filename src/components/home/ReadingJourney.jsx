import { Search, PackageCheck, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Find your next read",
    description: "Filter by genre, vibe, delivery speed, or recommendations from our librarians.",
    icon: Search,
  },
  {
    id: 2,
    title: "We courier it fast",
    description: "Pick doorstep delivery or pickup; live tracking keeps you updated.",
    icon: PackageCheck,
  },
  {
    id: 3,
    title: "Keep momentum",
    description: "Return, renew, or line up the next title with one tap. Reading streaks stay alive.",
    icon: Sparkles,
  },
];

const ReadingJourney = () => {
  return (
    <section className="relative py-16 px-4 bg-base-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute -top-12 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 -left-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative container mx-auto max-w-7xl space-y-12">
        <div className="text-center space-y-3">
          <p className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
            How BookCourier works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            A smoother reading journey, end to end
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            From browsing to returns, every step is built for people who want more time for stories.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 top-16 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
                        {step.id}
                      </span>
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-base-content/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadingJourney;
