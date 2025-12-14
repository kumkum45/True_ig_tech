import React from "react";
import { useUI } from "../context/UIContext";

export default function Modal() {
  const { modal, closeModal } = useUI();

  if (!modal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6 z-10">
        <button
          aria-label="Close"
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <div>{modal.content}</div>
      </div>
    </div>
  );
}
