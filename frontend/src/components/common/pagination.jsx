const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const buttonStyle = (disabled) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: disabled ? "#f3f4f6" : "#2563eb",
    color: disabled ? "#9ca3af" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500,
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
      <button
        style={buttonStyle(page === 1)}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        onMouseEnter={(e) => {
          if (page !== 1) e.target.style.backgroundColor = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          if (page !== 1) e.target.style.backgroundColor = "#2563eb";
        }}
      >
        Prev
      </button>

      <span style={{ fontWeight: 500 }}>Page {page} of {totalPages}</span>

      <button
        style={buttonStyle(page === totalPages)}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        onMouseEnter={(e) => {
          if (page !== totalPages) e.target.style.backgroundColor = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          if (page !== totalPages) e.target.style.backgroundColor = "#2563eb";
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
