import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Activity,
  Eye,
  Filter,
  Clock,
  Route,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive User Tracking
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advanced analytics dashboard tracks and visualizes user
              behavior across your websites, providing valuable insights for
              your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: "User Profiles",
                description:
                  "Detailed visitor data including IP, browser, location, and more",
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Interaction Analytics",
                description:
                  "Track click-through rates on all contact channels",
              },
              {
                icon: <Filter className="w-6 h-6" />,
                title: "Advanced Filtering",
                description: "Sort and filter user data by any parameter",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Real-time Monitoring",
                description: "See active users and their current session data",
              },
              {
                icon: <Route className="w-6 h-6" />,
                title: "User Journey Maps",
                description: "Visualize user paths across multiple sessions",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">User Identification</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Data Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Track Your Users?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start monitoring user behavior and gain valuable insights to improve
            your website's performance.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Dashboard
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
