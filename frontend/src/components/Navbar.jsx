import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { getCurrentUser, logout } from "../utils/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { openModal } = useUI();
  const navigate = useNavigate();
  const u = getCurrentUser();

  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="section flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/trainer" className="text-xl font-bold text-brand-600">Trainer Dashboard</Link>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/dashboard/trainer/profile" className="text-sm text-gray-700 hover:text-gray-900 transition">Profile</Link>
          <Link to="/dashboard/trainer/create" className="text-sm text-gray-700 hover:text-gray-900 transition">Create Plan</Link>
          <Link to="/dashboard/trainer/plans" className="text-sm text-gray-700 hover:text-gray-900 transition">Active Plans</Link>
          <Link to="/signup" className="btn-secondary">Sign up</Link>
          {!u ? (
            <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">Login</Link>
          ) : (
            <>
              <button className="text-sm text-gray-700 hover:text-gray-900" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
              <div className="ml-2"><button className="p-1 rounded-full hover:scale-105 transition"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u?.full_name || u?.sub || 'T')}&background=003366&color=fff&size=64`} alt="profile" className="w-8 h-8 rounded-full" /></button></div>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setOpen((s) => !s)} aria-label="Toggle menu" className="p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <a href="#plans" className="text-gray-700">Plans</a>
            <a href="#features" className="text-gray-700">Features</a>
            <Link to="/signup" className="btn-secondary">Sign up</Link>
            {!u ? (
              <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">Login</Link>
            ) : (
              <button className="text-sm text-gray-700 hover:text-gray-900" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
            )}
            <button onClick={() => openModal(<div><h3 className="text-lg font-semibold mb-2">Quick Signup</h3><p className="text-sm text-gray-600">Or go to the full signup page.</p><div className="mt-4"><Link to="/signup" className="btn-primary">Continue</Link></div></div>)} className="btn-primary">Get Started</button>
          </div>
        </div>
      )}
    </header>
  );
}
