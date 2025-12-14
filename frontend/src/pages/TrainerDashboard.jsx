import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { getCurrentUser, logout } from "../utils/auth";
import PlanCard from "../components/PlanCard";
import { useUI } from "../context/UIContext";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const u = getCurrentUser();
  const { openModal, closeModal } = useUI();
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!u || u.role !== "trainer") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  async function fetchData() {
    setLoading(true);
    try {
      const pid = u.sub;
      const [pRes, plansRes] = await Promise.all([
        api.get(`/trainers/${pid}`),
        api.get(`/plans/trainer`),
      ]);
      setProfile(pRes.data);
      setPlans(plansRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    openModal(
      <CreatePlanForm
        onClose={() => {
          closeModal();
          fetchData();
        }}
      />
    );
  }

  async function handleDelete(planId) {
    if (!confirm("Delete this plan?")) return;
    try {
      await api.delete(`/plans/${planId}`);
      setPlans((s) => s.filter((p) => p.id !== planId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete plan");
    }
  }

  async function handleUpdate(plan) {
    openModal(
      <div>
        <h3 className="text-lg font-semibold mb-2">Update Plan</h3>
        <UpdatePlanForm plan={plan} onClose={() => { closeModal(); fetchData(); }} />
      </div>
    );
  }

  if (loading) return <div className="section py-16">Loading...</div>;

  return (
    <div className="section py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          <button className="btn-primary" onClick={openCreate}>Create Plan</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-lg">Profile</h3>
            <p className="mt-2">{profile?.full_name}</p>
            <p className="text-sm text-gray-600">{profile?.email}</p>
            <p className="mt-2 text-sm">{profile?.bio}</p>
            <p className="mt-2 text-sm">Specializations: {profile?.specializations}</p>
            <p className="mt-2 text-sm">Followers: {profile?.follower_count}</p>
            <p className="mt-2 text-sm">Avg Rating: {profile?.avg_rating?.toFixed(1)}</p>
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-semibold text-lg mb-4">Active Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} isOwner onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePlanForm({ onClose }) {
  const [form, setForm] = useState({ title: "", description: "", price: 0, duration: "", goal: "", purchase_type: "one-time" });
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/plans', form);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create plan');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">Title<input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input" /></label>
      <label className="block">Description<textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input" /></label>
      <label className="block">Price<input type="number" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} className="input" /></label>
      <label className="block">Duration<input value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="input" /></label>
      <label className="block">Goal<input value={form.goal} onChange={(e) => setForm({...form, goal: e.target.value})} className="input" /></label>
      <label className="block">Purchase Type<select value={form.purchase_type} onChange={(e) => setForm({...form, purchase_type: e.target.value})} className="input"><option value="one-time">One-time</option><option value="subscription">Subscription</option></select></label>
      <div className="flex items-center gap-2">
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

function UpdatePlanForm({ plan, onClose }) {
  const [form, setForm] = useState({ ...plan });
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/plans/${plan.id}`, form);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update plan');
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">Title<input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input" /></label>
      <label className="block">Price<input type="number" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} className="input" /></label>
      <label className="block">Duration<input value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="input" /></label>
      <label className="block">Goal<input value={form.goal} onChange={(e) => setForm({...form, goal: e.target.value})} className="input" /></label>
      <div className="flex items-center gap-2">
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update'}</button>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}
