import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Have questions about our watches or your order? We'd love to hear
            from you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14">
        {/* Contact Form */}
        <div className="bg-white border rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8">
            Send a Message
          </h2>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
              className="w-full border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-3xl font-bold mb-8">
            Get in Touch
          </h2>

          <div className="space-y-8">

            <div className="flex gap-5">
              <Mail className="w-7 h-7 text-black" />

              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-600">
                  support@timexstore.com
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <Phone className="w-7 h-7 text-black" />

              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-gray-600">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <MapPin className="w-7 h-7 text-black" />

              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-gray-600">
                  TimeX Headquarters
                </p>
                <p className="text-gray-600">
                  Rajkot, Gujarat, India
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <Clock className="w-7 h-7 text-black" />

              <div>
                <h3 className="font-semibold text-lg">
                  Working Hours
                </h3>

                <p className="text-gray-600">
                  Monday - Saturday
                </p>

                <p className="text-gray-600">
                  9:00 AM - 7:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-10 border rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="TimeX Location"
              src="https://www.google.com/maps?q=Rajkot,Gujarat&output=embed"
              width="100%"
              height="300"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;