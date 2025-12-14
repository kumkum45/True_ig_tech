export default function About() {
  return (
    <section id="about" className="section py-16">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="section-title">About FitForge</h2>
          <p className="section-subtitle">
            FitForge was born from a simple idea: make expert fitness accessible. Trainers bring their best programs; you bring your commitment.
          </p>
          <div className="mt-6 space-y-4 text-gray-700">
            <p>
              Our mission is to empower every person with proven, personalized plans backed by certified professionals.
              We envision a world where progress feels clear, motivating, and measurable.
            </p>
            <p>
              Trust matters. We vet trainers, prioritize secure payments, and build tools that keep you focused on
              results — not complexity.
            </p>
          </div>
        </div>
        <div className="card p-6 bg-brand-50 border-brand-600">
          <h3 className="font-semibold text-brand-900">Why Choose Us</h3>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>Programs designed by certified experts</li>
            <li>Nutrition and progression guidance built in</li>
            <li>Mobile-friendly experience</li>
            <li>Transparent pricing and secure checkout</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
