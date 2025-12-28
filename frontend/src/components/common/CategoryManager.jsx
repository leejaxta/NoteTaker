import { useState, useEffect } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories.api";
import { FiEdit, FiTrash2, FiX, FiCheck, FiTag } from "react-icons/fi";
import Toast from "./Toast";
import "../../styles/CategoryManager.css";

const CategoryManager = ({ selectedCategories, setSelectedCategories }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [toast, setToast] = useState(null);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data.data);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await loadCategories();
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    if (
      categories.find(
        (c) => c.name.toLowerCase() === newCategoryName.toLowerCase()
      )
    ) {
      setToast({ message: "Category already exists!", type: "error" });
      return;
    }
    await createCategory({ name: newCategoryName.trim() });
    setNewCategoryName("");
    loadCategories();
  };

  const handleEditCategory = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) return;
    if (
      categories.find(
        (c) => c.name.toLowerCase() === editCategoryName.toLowerCase()
      )
    ) {
      setToast({ message: "Category already exists!", type: "error" });
      return;
    }
    await updateCategory(editCategoryId, { name: editCategoryName.trim() });
    setEditCategoryId(null);
    setEditCategoryName("");
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    loadCategories();
    setSelectedCategories(selectedCategories.filter((cid) => cid !== id));
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cid) => cid !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className="category-manager">
      <div className="category-label">
        <FiTag className="category-label-icon" />
        <span className="category-label-text">Categories</span>
      </div>
      <div className="selected-categories">
        {selectedCategories.map((id) => {
          const cat = categories.find((c) => c.id === id);
          if (!cat) return null;
          return (
            <div key={id} className="selected-category">
              {cat.name}
              <FiX
                className="selected-category-remove"
                onClick={() =>
                  setSelectedCategories(
                    selectedCategories.filter((cid) => cid !== id)
                  )
                }
              />
            </div>
          );
        })}

        <Button onClick={() => setModalOpen(true)} className="add-manage-btn">
          Add / Manage
        </Button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Manage Categories"
      >
        <div className="new-category-form">
          <Input
            placeholder="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="add-button">
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
        </div>

        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="categories-list">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="category-item">
              {editCategoryId === cat.id ? (
                <div className="edit-category-form">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <div className="add-button">
                    <div>
                      <Button onClick={handleUpdateCategory}>Save</Button>
                    </div>
                    <div>
                      <Button
                        variant="secondary"
                        onClick={() => setEditCategoryId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="category-name"
                    onClick={() => toggleSelectCategory(cat.id)}
                  >
                    {cat.name}{" "}
                    {selectedCategories.includes(cat.id) && (
                      <FiCheck className="selected-icon" />
                    )}
                  </div>
                  <div className="category-actions">
                    <FiEdit onClick={() => handleEditCategory(cat)} />
                    <FiTrash2 onClick={() => handleDeleteCategory(cat.id)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CategoryManager;
