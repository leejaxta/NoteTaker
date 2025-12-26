const Input = ({ label, ...props }) => {
  return (
    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
      {label && (
        <label
          style={{
            marginBottom: "6px",
            fontWeight: 500,
            color: "#111827",
            fontSize: "14px",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          outline: "none",
          fontSize: "16px",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.boxShadow = "0 0 0 2px rgba(37, 99, 235, 0.2)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d5db";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};

export default Input;
