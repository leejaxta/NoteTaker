import { useEffect } from "react";

const Toast = ({ message, type = "error", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "error" ? "#f56565" : "#48bb78"; 

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: bgColor,
        color: "white",
        padding: "12px 20px",
        borderRadius: "6px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        fontWeight: "bold",
        minWidth: "200px",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
