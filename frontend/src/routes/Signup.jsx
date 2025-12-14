import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { saveToken } from "../api/client";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

import { useUI } from "../context/UIContext";

export default function Signup() {
  const { showToast } = useUI();
  const query = useQuery();
  const initialType = query.get("type") === "trainer" ? "trainer" : "user";
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Sync with query
    setType(initialType);
  }, [initialType]);

  return (
    <div className="section py-12">
      <h1 className="section-title">Create your account</h1>
      <p className="section-subtitle">Choose how you want to join FitForge.</p>

      {/* Selection */}
      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        <button
          className={`card p-6 text-left ${type === "user" ? "ring-2 ring-brand-600" : ""}`}
          onClick={() => setType("user")}
        >
          <h3 className="font-semibold">Signup as User</h3>
          <p className="mt-2 text-sm text-gray-600">
            Purchase and follow plans tailored to your goals.
          </p>
        </button>
        <button
          className={`card p-6 text-left ${type === "trainer" ? "ring-2 ring-brand-600" : ""}`}
          onClick={() => setType("trainer")}
        >
          <h3 className="font-semibold">Signup as Trainer</h3>
          <p className="mt-2 text-sm text-gray-600">
            Create and sell your best fitness programs.
          </p>
        </button>
      </div>

      {/* Forms */}
      <div className="mt-10">
        {type === "user" ? (
          <UserForm setLoading={setLoading} setError={setError} showToast={showToast} />
        ) : (
          <TrainerForm setLoading={setLoading} setError={setError} showToast={showToast} />
        )}
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}
      {loading && <div className="mt-4 text-gray-600">Submitting...</div>}
    </div>
  );
}

function UserForm({ setLoading, setError }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitness_goal: "Weight Loss",
    activity_level: "Moderate",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple client-side validation
    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in name, email, and password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age, 10) : null,
        height: form.height ? parseFloat(form.height) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
      };
      const res = await api.post("/api/signup/user", payload);
      saveToken(res.data.token);
      if (showToast) showToast("Account created — welcome!");
      navigate("/dashboard/user", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Something went wrong";
      setError(msg);
      if (showToast) showToast(msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 grid md:grid-cols-2 gap-4">
      <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
      <Input label="Age" type="number" name="age" value={form.age} onChange={handleChange} />
      <Select label="Gender" name="gender" value={form.gender} onChange={handleChange}
        options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
      <Input label="Height (cm)" type="number" step="0.1" name="height" value={form.height} onChange={handleChange} />
      <Input label="Weight (kg)" type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} />
      <Select label="Fitness Goal" name="fitness_goal" value={form.fitness_goal} onChange={handleChange}
        options={["Weight Loss", "Muscle Gain", "Yoga", "Cardio"]} />
      <Select label="Activity Level" name="activity_level" value={form.activity_level} onChange={handleChange}
        options={["Sedentary", "Light", "Moderate", "Active", "Athlete"]} />
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="btn-primary">Create Account</button>
      </div>
    </form>
  );
}

function TrainerForm({ setLoading, setError }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    years_experience: "",
    certifications: "",
    specializations: [],
    bio: "",
  });

  const SPECIALIZATIONS = ["Yoga", "Weight Training", "Cardio", "CrossFit", "Pilates"];

  const toggleSpecialization = (spec) => {
    setForm((f) => {
      const exists = f.specializations.includes(spec);
      return { ...f, specializations: exists ? f.specializations.filter(s => s !== spec) : [...f.specializations, spec] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple client-side validation
    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in name, email, and password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        years_experience: form.years_experience ? parseInt(form.years_experience, 10) : null,
        certifications: form.certifications
          ? form.certifications.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      };
      const res = await api.post("/api/signup/trainer", payload);
      saveToken(res.data.token);
      if (showToast) showToast("Trainer account created — welcome!");
      navigate("/dashboard/trainer", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Something went wrong";
      setError(msg);
      if (showToast) showToast(msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 grid md:grid-cols-2 gap-4">
      <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
      <Input label="Years of Experience" type="number" name="years_experience" value={form.years_experience} onChange={handleChange} />
      <Input label="Certifications (comma-separated)" name="certifications" value={form.certifications} onChange={handleChange} />
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Specializations</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SPECIALIZATIONS.map((spec) => (
            <button
              type="button"
              key={spec}
              onClick={() => toggleSpecialization(spec)}
              className={`px-3 py-1 rounded border ${
                form.specializations.includes(spec) ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-700"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Short Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
          placeholder="Share your coaching philosophy, certifications, and approach."
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="btn-primary">Create Trainer Account</button>
      </div>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
