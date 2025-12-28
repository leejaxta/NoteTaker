import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import Input from "../components/common/Input";
import Pagination from "../components/common/Pagination";
import { AuthContext } from "../context/AuthContext";
import { deleteNote, getNotes } from "../api/notes.api";
import { createCategory, getCategories } from "../api/categories.api";
import Navbar from "../components/common/Navbar";
import { timeAgo } from "../utils/timeAgo";
import "../styles/Notes.css";
import Button from "../components/common/Button";
import CategorySidebar from "../components/common/CategorySidebar";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";

const Notes = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [order, setOrder] = useState("DESC");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadNotes = async ({
    pageNumber = 1,
    categoryId = selectedCategory,
    searchText = search,
    sortField = sortBy,
    sortOrder = order,
  } = {}) => {
    const [notesRes, categoriesRes] = await Promise.all([
      getNotes({
        page: pageNumber,
        limit,
        categoryId,
        search: searchText,
        sort: sortField,
        order: sortOrder,
      }),
      getCategories(),
    ]);

    setNotes(notesRes.data.data.data);
    setPage(notesRes.data.data.page);
    setTotalPages(notesRes.data.data.totalPages);
    setCategories(categoriesRes.data.data);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await loadNotes({ pageNumber: 1 });
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [selectedCategory, search, sortBy, order]);

  const confirmDeleteNote = (note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    setDeleteModalOpen(false);
    setNoteToDelete(null);
    loadNotes({ pageNumber: page });
  };

  const handlePageChange = (newPage) => {
    loadNotes({ pageNumber: newPage });
  };

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
    setAddCategoryModalOpen(false);
    loadNotes({ pageNumber: 1 });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleOrder = () => setOrder(order === "ASC" ? "DESC" : "ASC");

  return (
    <>
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Navbar
        user={user}
        handleLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="notes-layout">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setIsSidebarOpen(false);
          }}
          onAddCategory={() => setAddCategoryModalOpen(true)}
          isOpen={isSidebarOpen}
        />

        <Modal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
          title="Add Category"
        >
          <Input
            placeholder="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setAddCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
        </Modal>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this note?</p>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirmed}
              style={{ backgroundColor: "#dc2626" }}
            >
              Delete
            </Button>
          </div>
        </Modal>
        <div className="notes-content">
          <div className="notes-page">
            <h2 className="notes-title">My Notes</h2>

            <div className="notes-filters">
              <Input
                className="search-input"
                label="Search notes"
                placeholder="Search by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="filter-add">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option className="sort-option" value="created_at">
                    Created Date
                  </option>
                  <option className="sort-option" value="updated_at">
                    Updated Date
                  </option>
                  <option className="sort-option" value="title">
                    Title
                  </option>
                </select>
                <button
                  className="sort-order-btn"
                  onClick={toggleOrder}
                  title={`Sort ${order === "ASC" ? "Ascending" : "Descending"}`}
                >
                  {order === "ASC" ? <FiArrowUp /> : <FiArrowDown />}
                </button>

                <Button
                  onClick={() => navigate("/notes/new")}
                  className="add-note-button"
                >
                  Add Note
                </Button>
              </div>
            </div>

            {notes.length === 0 ? (
              <div className="empty-notes">
                <FiPlusSquare className="empty-icon" />
                <p>Create your first note to get started!</p>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => {
                  const excerpt = note.content
                    .replace(/<[^>]*>/g, "")
                    .substring(0, 150);

                  return (
                    <div
                      key={note.id}
                      className="note-card"
                      onClick={() => navigate(`/notes/${note.id}`)}
                    >
                      <div className="note-card-header">
                        <h3 className="note-card-title">
                          {note.title || "Untitled"}
                        </h3>
                        <div
                          className="note-card-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteNote(note);
                          }}
                        >
                          <FiTrash2 />
                        </div>
                      </div>
                      <p className="note-card-content">{excerpt}</p>
                      {note.categories?.length > 0 && (
                        <div className="note-card-tags">
                          {note.categories.map((c) => (
                            <span key={c.id} className="note-card-tag">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="note-card-date">
                        Updated · {timeAgo(note.updated_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
};

export default Notes;
