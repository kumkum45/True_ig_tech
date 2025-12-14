import React from "react";
import { useUI } from "../context/UIContext";

export default function Toast() {
  const { toast } = useUI();
  if (!toast) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="bg-gray-900 text-white px-4 py-2 rounded shadow-md">{toast}</div>
    </div>
  );
}
