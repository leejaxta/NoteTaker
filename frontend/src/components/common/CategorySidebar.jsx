import { FiPlus } from "react-icons/fi";
import "../../styles/CategorySidebar.css";

const CategorySidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  isOpen,
}) => {
  return (
    <aside className={`category-sidebar ${isOpen ? "open" : ""}`}>
      <div className="category-sidebar-header">
        <h4>Categories</h4>
        <button
          className="category-add-btn"
          onClick={onAddCategory}
          title="Add category"
        >
          <FiPlus />
        </button>
      </div>

      <div className="category-list">
        <div
          className={`category-item ${selectedCategory === "" ? "active" : ""}`}
          onClick={() => onSelectCategory("")}
        >
          <span>All</span>
        </div>

        {categories.map((c) => (
          <div
            key={c.id}
            className={`category-item ${
              selectedCategory === String(c.id) ? "active" : ""
            }`}
            onClick={() => onSelectCategory(String(c.id))}
          >
            <span className="category-name">{c.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;
