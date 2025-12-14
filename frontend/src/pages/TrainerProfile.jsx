import React, { useState } from "react";
import Avatar from "../components/Avatar";

export default function TrainerProfile({ profile }) {
  // profile prop is optional; show dummy if not provided
  const [editing, setEditing] = useState(false);
  const [p, setP] = useState(profile || {
    full_name: 'Demo Trainer',
    email: 'demo.trainer@example.com',
    specializations: 'Strength, Cardio',
    years_experience: 5,
    bio: 'Passionate trainer focused on sustainable results.',
  });

  return (
    <div className="section py-8">
      <div className="flex items-center gap-6">
        <Avatar name={p.full_name} size={96} />
        <div>
          <h1 className="text-2xl font-bold">{p.full_name}</h1>
          <p className="text-sm text-gray-600">{p.email}</p>
          <p className="mt-2 text-sm">Specializations: {p.specializations}</p>
          <p className="mt-1 text-sm">Experience: {p.years_experience} years</p>
        </div>
        <div className="ml-auto">
          <button className="btn-primary" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</button>
        </div>
      </div>

      <div className="mt-6 card p-4">
        {!editing ? (
          <p className="text-sm">{p.bio}</p>
        ) : (
          <div className="space-y-3">
            <label className="block">Full name<input className="input" value={p.full_name} onChange={(e) => setP({...p, full_name: e.target.value})} /></label>
            <label className="block">Email<input className="input" value={p.email} onChange={(e) => setP({...p, email: e.target.value})} /></label>
            <label className="block">Specialization<input className="input" value={p.specializations} onChange={(e) => setP({...p, specializations: e.target.value})} /></label>
            <label className="block">Experience<input type="number" className="input" value={p.years_experience} onChange={(e) => setP({...p, years_experience: parseInt(e.target.value || 0)})} /></label>
            <label className="block">Bio<textarea className="input" value={p.bio} onChange={(e) => setP({...p, bio: e.target.value})} /></label>
            <div className="flex items-center gap-2">
              <button className="btn-primary" onClick={() => setEditing(false)}>Save</button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
