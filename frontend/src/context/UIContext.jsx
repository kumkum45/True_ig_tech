import React, { createContext, useCallback, useContext, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [modal, setModal] = useState({ open: false, content: null });
  const [toast, setToast] = useState(null);

  const openModal = useCallback((content) => setModal({ open: true, content }), []);
  const closeModal = useCallback(() => setModal({ open: false, content: null }), []);
  const showToast = useCallback((message, timeout = 3500) => {
    setToast(message);
    setTimeout(() => setToast(null), timeout);
  }, []);

  return (
    <UIContext.Provider value={{ modal, openModal, closeModal, toast, showToast }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}

export default UIContext;
