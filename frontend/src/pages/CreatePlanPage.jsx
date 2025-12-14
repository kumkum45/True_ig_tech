import React, { useState } from "react";
import api from "../api/client";

export default function CreatePlanPage({ onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", price: 0, duration: "", goal: "", purchase_type: "one-time" });
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/plans', form);
      onCreated && onCreated(res.data);
      alert('Plan created');
    } catch (err) {
      console.error(err);
      alert('Failed to create plan');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section py-8">
      <h1 className="text-2xl font-bold mb-4">Create Plan</h1>
      <form onSubmit={submit} className="card p-6 space-y-4 max-w-xl">
        <label className="block">Plan name<input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input" /></label>
        <label className="block">Description<textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input" /></label>
        <label className="block">Image (UI only)<input type="file" className="input" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">Price<input type="number" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} className="input" /></label>
          <label className="block">Duration<input value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="input" /></label>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
          <button type="button" className="btn-secondary" onClick={() => { setForm({ title: "", description: "", price: 0, duration: "", goal: "", purchase_type: "one-time" }); }}>Reset</button>
        </div>
      </form>
    </div>
  );
}
