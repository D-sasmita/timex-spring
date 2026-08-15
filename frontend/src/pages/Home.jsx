import { Link } from "react-router-dom";

const WatchIllustration = () => (
  <svg viewBox="0 0 400 400" className="w-full h-auto max-w-md mx-auto">
    <circle cx="200" cy="200" r="150" fill="none" stroke="#0a0a0a" strokeWidth="3" />
    <circle cx="200" cy="200" r="140" fill="none" stroke="#0a0a0a" strokeWidth="1" />
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 200 + 125 * Math.sin(angle);
      const y1 = 200 - 125 * Math.cos(angle);
      const x2 = 200 + 140 * Math.sin(angle);
      const y2 = 200 - 140 * Math.cos(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#0a0a0a"
          strokeWidth={i % 3 === 0 ? 3 : 1}
        />
      );
    })}
    <line x1="200" y1="200" x2="200" y2="105" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" />
    <line x1="200" y1="200" x2="255" y2="200" stroke="#a9812f" strokeWidth="3" strokeLinecap="round" />
    <circle cx="200" cy="200" r="6" fill="#a9812f" />
    <rect x="185" y="40" width="30" height="20" rx="4" fill="none" stroke="#0a0a0a" strokeWidth="2" />
    <rect x="180" y="20" width="12" height="20" fill="#0a0a0a" />
    <rect x="208" y="20" width="12" height="20" fill="#0a0a0a" />
  </svg>
);

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-brass font-sans font-medium mb-4">
              Precision Since Day One
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brand-black leading-[1.05] mb-6">
              Time, worn <br />
              <span className="italic text-brand-brass">deliberately.</span>
            </h1>
            <p className="text-brand-gray text-lg font-sans leading-relaxed max-w-md mb-8">
              Every TimeX watch is built on one idea: a mechanism you trust
              is worth wearing every day, not saving for occasions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-brand-black text-white px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-brass transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="border border-brand-black text-brand-black px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-black hover:text-white transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Watch illustration side */}
          <div className="order-first lg:order-last">
            <WatchIllustration />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-display text-2xl text-brand-black mb-1">Free Shipping</h3>
            <p className="text-sm text-brand-gray font-sans">On every order, no minimum</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-brand-black mb-1">2-Year Warranty</h3>
            <p className="text-sm text-brand-gray font-sans">Movement and case covered</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-brand-black mb-1">30-Day Returns</h3>
            <p className="text-sm text-brand-gray font-sans">Try it, wear it, decide later</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;