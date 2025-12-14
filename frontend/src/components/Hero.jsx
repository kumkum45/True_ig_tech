import { Link } from "react-router-dom";
import { useUI } from "../context/UIContext";

export default function Hero() {
  const { openModal } = useUI();

  return (
    <section className="relative">
      {/* Placeholder background image: do not embed a real image */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="h-full w-full opacity-30 bg-[url('/placeholder-fitness.jpg')] bg-cover bg-center" />
      </div>
      <div className="section relative py-24 md:py-32 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Transform Your Body with Expert-Designed Fitness Plans
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Certified trainers craft proven programs. You choose, purchase, and follow — anytime, anywhere.
          </p>
          <div className="mt-8 flex gap-4">
            <button onClick={() => openModal(<div><h3 className="text-lg font-semibold mb-2">Quick Signup</h3><p className="text-sm text-gray-600">Join as a user or trainer. For full signup, visit the signup page.</p><div className="mt-4 flex gap-2"><Link to="/signup" className="btn-primary">Signup</Link><Link to="/signup?type=trainer" className="btn-secondary">Trainer</Link></div></div>)} className="btn-primary">Get Started</button>
            <a href="#plans" className="btn-secondary">Explore Plans</a>
          </div>
        </div>
      </div>
    </section>
  );
}
