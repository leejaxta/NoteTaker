const Input = ({ label, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginTop: "10px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
export default Input;
