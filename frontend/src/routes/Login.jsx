import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../utils/auth";
import { saveToken } from "../api/client";

export default function Login() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiLogin(role, { email, password });
      saveToken(res.token);
      if (res.role === "user") navigate("/dashboard/user");
      else navigate("/dashboard/trainer");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="section py-12 max-w-md mx-auto">
      <h1 className="section-title">Login</h1>
      <p className="section-subtitle">Choose a role and sign in.</p>

      <div className="mt-6 flex gap-3">
        <button className={`px-4 py-2 rounded ${role === "user" ? "bg-brand-600 text-white" : "bg-white"}`} onClick={() => setRole("user")}>Login as User</button>
        <button className={`px-4 py-2 rounded ${role === "trainer" ? "bg-brand-600 text-white" : "bg-white"}`} onClick={() => setRole("trainer")}>Login as Trainer</button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 mt-6 grid gap-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input className="mt-1 rounded border border-gray-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" className="mt-1 rounded border border-gray-300 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
}
