import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="section text-center">
        <h2 className="section-title">Ready to Start?</h2>
        <p className="section-subtitle">Join as a user or share your expertise as a trainer.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup?type=user" className="btn-primary">Join as User</Link>
          <Link to="/signup?type=trainer" className="btn-secondary">Join as Trainer</Link>
        </div>
      </div>
    </section>
  );
}
