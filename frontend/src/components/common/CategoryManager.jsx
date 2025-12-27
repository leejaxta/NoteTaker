import { useState, useEffect } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories.api";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import Toast from "./Toast";

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
    if (categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
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
    if (categories.find(c => c.name.toLowerCase() === editCategoryName.toLowerCase())) {
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

    setSelectedCategories(selectedCategories.filter(cid => cid !== id));
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(cid => cid !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
        {selectedCategories.map((id) => {
          const cat = categories.find(c => c.id === id);
          if (!cat) return null;
          return (
            <div key={id} style={{
              display: "flex",
              alignItems: "center",
              background: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "14px"
            }}>
              {cat.name}
              <FiX
                style={{ marginLeft: "6px", cursor: "pointer" }}
                onClick={() => setSelectedCategories(selectedCategories.filter(cid => cid !== id))}
              />
            </div>
          );
        })}

        <Button onClick={() => setModalOpen(true)} style={{ display: "flex", alignItems: "center" }}>
          <FiPlus style={{ marginRight: "4px" }} /> Add / Manage
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Manage Categories">
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <Input
            placeholder="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleAddCategory}>Add</Button>
        </div>

        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "12px" }}
        />

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {filteredCategories.map((cat) => (
            <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              {editCategoryId === cat.id ? (
                <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                  <Input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                  <Button onClick={handleUpdateCategory}>Save</Button>
                  <Button onClick={() => setEditCategoryId(null)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <div style={{ cursor: "pointer" }} onClick={() => toggleSelectCategory(cat.id)}>
                    {cat.name} {selectedCategories.includes(cat.id) && "(Selected)"}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <FiEdit style={{ cursor: "pointer" }} onClick={() => handleEditCategory(cat)} />
                    <FiTrash2 style={{ cursor: "pointer" }} onClick={() => handleDeleteCategory(cat.id)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Modal>
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CategoryManager;
