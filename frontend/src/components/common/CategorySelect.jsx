const CategorySelect = ({ categories, selected, onChange }) => {
  const toggleCategory = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{ fontWeight: "500", marginBottom: "6px", display: "block" }}
      >
        Categories
      </label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "6px",
        }}
      >
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <span
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                backgroundColor: isSelected ? "#2563eb" : "#f3f4f6",
                color: isSelected ? "#fff" : "#111827",
                fontWeight: isSelected ? "600" : "500",
                transition: "all 0.2s ease",
                border: isSelected ? "none" : "1px solid #d1d5db",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.target.style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.target.style.backgroundColor = "#f3f4f6";
              }}
            >
              {cat.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelect;
