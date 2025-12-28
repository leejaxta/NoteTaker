const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1002,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "400px",
          maxWidth: "90%",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          animation: "scaleIn 0.2s ease",
        }}
      >
        {title && (
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {title}
          </h3>
        )}

        {children}

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.color = "#000")}
          aria-label="Close Modal"
        >
          &times;
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; } 
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
