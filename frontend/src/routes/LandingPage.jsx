import Hero from "../components/Hero";
import PlanCard from "../components/PlanCard";
import FeatureCard from "../components/FeatureCard";
import About from "../components/About";
import CTASection from "../components/CtaSection";
import Footer from "../components/Footer";

const PLANS = [
  { id: 1, name: "Lean in 6", trainer: "Aarav Singh", duration: "6 weeks", goal: "Weight Loss", price: 2499 },
  { id: 2, name: "Muscle Forge 12", trainer: "Priya Mehta", duration: "12 weeks", goal: "Muscle Gain", price: 4999 },
  { id: 3, name: "Calm Flow", trainer: "Rohan Verma", duration: "8 weeks", goal: "Yoga", price: 2999 },
  { id: 4, name: "Cardio Max", trainer: "Neha Kapoor", duration: "10 weeks", goal: "Cardio", price: 3499 },
];

const FEATURES = [
  { title: "Certified Trainers", description: "All plans are created and reviewed by certified professionals." },
  { title: "Personalized Plans", description: "Adjust workouts and nutrition to your lifestyle and goals." },
  { title: "Nutrition Guidance", description: "Macros, meals, and habits that support your progress." },
  { title: "Progress Tracking", description: "Track workouts, body metrics, and milestones." },
  { title: "Secure Payments", description: "Encrypted transactions for peace of mind." },
  { title: "Anytime Access", description: "Train on the go with a mobile-friendly experience." },
];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <section id="plans" className="section py-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Famous Fitness Plans</h2>
          <p className="section-subtitle">Curated programs trusted by thousands.</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>
      </section>

      <section id="features" className="section py-16">
        <h2 className="section-title">Features</h2>
        <p className="section-subtitle">Everything you need to stay consistent and see results.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => <FeatureCard key={idx} feature={f} />)}
        </div>
      </section>

      <About />
      <CTASection />
      <Footer />
    </>
  );
}
