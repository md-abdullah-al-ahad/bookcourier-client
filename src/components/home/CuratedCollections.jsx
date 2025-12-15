import { ArrowRight, Sparkles, Clock4 } from "lucide-react";

const collections = [
  {
    title: "Weekend Escape",
    blurb: "Short, uplifting reads that fit perfectly between brunch and a nap.",
    meta: "Curated by local librarians",
    color: "from-primary/15 via-primary/10 to-accent/10",
    accent: "text-primary",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Deep Work Stack",
    blurb: "Research-backed titles for focus, learning, and career leaps.",
    meta: "Updated weekly",
    color: "from-secondary/20 via-secondary/10 to-primary/10",
    accent: "text-secondary",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cozy Night In",
    blurb: "Atmospheric fiction, tea, and a courier knock right when you want it.",
    meta: "Reader-favorite picks",
    color: "from-accent/15 via-primary/10 to-base-200",
    accent: "text-accent",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
];

const CuratedCollections = () => {
  return (
    <section className="py-16 px-4 bg-base-200">
      <div className="container mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-base-100 text-base-content/80 border border-base-300">
              <Sparkles className="h-4 w-4" />
              Curated for mood + time
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Collections that meet you where you are
            </h2>
            <p className="text-base-content/70 max-w-2xl mt-2">
              Choose a vibe and we’ll assemble titles that fit your schedule, delivered together in one drop.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Clock4 className="h-4 w-4" />
            <span>Hand-picked every Friday</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.title}
              className="relative overflow-hidden rounded-3xl shadow-lg group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${collection.color}`}
              />
              <img
                src={collection.image}
                alt={collection.title}
                className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-40 transition-smooth"
              />
              <div className="relative p-6 space-y-4 bg-base-100/70 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{collection.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full bg-base-100 border border-base-300 ${collection.accent}`}
                  >
                    5-7 books
                  </span>
                </div>
                <p className="text-base-content/70 leading-relaxed">
                  {collection.blurb}
                </p>
                <div className="flex items-center justify-between text-sm text-base-content/70">
                  <span>{collection.meta}</span>
                  <button className="btn btn-link text-primary gap-1 px-0">
                    View picks <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuratedCollections;
