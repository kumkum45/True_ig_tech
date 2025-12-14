import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import PlanCard from "../components/PlanCard";
import { getCurrentUser } from "../utils/auth";

export default function TrainerPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const u = getCurrentUser();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const [pRes, plansRes] = await Promise.all([
          api.get(`/trainers/${id}`),
          api.get(`/plans/trainer/${id}`),
        ]);
        setProfile(pRes.data);
        setPlans(plansRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  async function toggleFollow() {
    try {
      if (profile.is_following) {
        await api.delete(`/trainers/${id}/follow`);
      } else {
        await api.post(`/trainers/${id}/follow`);
      }
      const r = await api.get(`/trainers/${id}`);
      setProfile(r.data);
    } catch (e) {
      console.error(e);
      alert('Action failed');
    }
  }

  if (loading) return <div className="section py-16">Loading...</div>;

  return (
    <div className="section py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 card p-4">
          <h2 className="text-lg font-semibold">{profile.full_name}</h2>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <p className="mt-2">{profile.bio}</p>
          <p className="mt-2 text-sm">Specializations: {profile.specializations}</p>
          <p className="mt-2 text-sm">Followers: {profile.follower_count}</p>
          <p className="mt-2 text-sm">Avg Rating: {profile.avg_rating?.toFixed(1)}</p>
          {u && u.role === 'user' && (
            <button className="btn-primary mt-4" onClick={toggleFollow}>{profile.is_following ? 'Unfollow' : 'Follow'}</button>
          )}
        </div>

        <div className="col-span-2">
          <h3 className="font-semibold text-lg mb-4">Active Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(p => <PlanCard key={p.id} plan={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
