import { createContext, useState, useContext, useCallback } from "react";
import Toast from "../components/common/Toast";


const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); 

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });

    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};
