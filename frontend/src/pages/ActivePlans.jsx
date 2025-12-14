import React, { useEffect, useState } from "react";
import api from "../api/client";
import PlanCard from "../components/PlanCard";
import { SAMPLE_PLANS } from "../data/samplePlans";

export default function ActivePlans() {
  const [plans, setPlans] = useState(SAMPLE_PLANS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // try fetching live plans; fallback to sample
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/plans/trainer');
        if (res.data && res.data.length) setPlans(res.data);
      } catch (e) {
        // keep sample data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="section py-16">Loading...</div>;

  return (
    <div className="section py-8">
      <h1 className="text-2xl font-bold mb-4">Active Plans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  );
}
