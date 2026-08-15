import { ShieldCheck, Truck, Award, Clock } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Award size={36} />,
      title: "Premium Collection",
      description:
        "Every watch in our collection is selected for its craftsmanship, precision, and timeless design.",
    },
    {
      icon: <ShieldCheck size={36} />,
      title: "Authentic Products",
      description:
        "We guarantee 100% genuine watches sourced directly from trusted manufacturers and authorized distributors.",
    },
    {
      icon: <Truck size={36} />,
      title: "Fast & Secure Delivery",
      description:
        "Your orders are carefully packed and delivered safely across India with real-time order tracking.",
    },
    {
      icon: <Clock size={36} />,
      title: "Timeless Experience",
      description:
        "TimeX combines luxury, innovation, and reliability to help you find the perfect watch for every occasion.",
    },
  ];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About TimeX
          </h1>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-8">
            TimeX is more than an online watch store. We believe a watch is an
            expression of personality, confidence, and craftsmanship. Our goal
            is to make premium watches accessible through a seamless shopping
            experience.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
              alt="Luxury Watch"
              className="rounded-xl shadow-lg w-full h-[500px] object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Our Story
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              Founded with a passion for premium timepieces, TimeX was created
              to offer customers a trusted destination for discovering elegant,
              durable, and high-quality watches.
            </p>

            <p className="text-gray-600 leading-8 mb-6">
              From classic leather designs to modern smartwatches, our carefully
              selected collection meets the needs of professionals, athletes,
              and fashion enthusiasts alike.
            </p>

            <p className="text-gray-600 leading-8">
              We focus on authenticity, exceptional customer service, and a
              secure shopping experience so every purchase becomes memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            Why Choose TimeX?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition duration-300"
              >
                <div className="mb-5 text-black">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div>
              <h3 className="text-5xl font-bold text-black">5K+</h3>
              <p className="text-gray-500 mt-3">
                Happy Customers
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-black">250+</h3>
              <p className="text-gray-500 mt-3">
                Premium Watches
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-black">99%</h3>
              <p className="text-gray-500 mt-3">
                Customer Satisfaction
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-black">24/7</h3>
              <p className="text-gray-500 mt-3">
                Customer Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Find Your Perfect Watch Today
          </h2>

          <p className="text-gray-300 text-lg mb-10">
            Browse our premium collection and discover timeless designs crafted
            for every lifestyle.
          </p>

          <a
            href="/shop"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Collection
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;