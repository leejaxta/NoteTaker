import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare, FiTrash2 } from "react-icons/fi";
import Input from "../components/common/Input";
import Pagination from "../components/common/Pagination";
import { AuthContext } from "../context/AuthContext";
import { deleteNote, getNotes } from "../api/notes.api";
import { getCategories } from "../api/categories.api";
import Navbar from "../components/common/Navbar";
import { timeAgo } from "../utils/timeAgo";
import "../styles/Notes.css";
import Button from "../components/common/Button";
import CategorySidebar from "../components/common/CategorySidebar";

const Notes = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotes = async ({
    pageNumber = 1,
    categoryId = selectedCategory,
    searchText = search,
  } = {}) => {
    const [notesRes, categoriesRes] = await Promise.all([
      getNotes({ page: pageNumber, limit, categoryId, search: searchText }),
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
  }, [selectedCategory, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    await deleteNote(id);
    loadNotes({ pageNumber: page });
  };

  const handlePageChange = (newPage) => {
    loadNotes({ pageNumber: newPage });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
    <div className="notes-layout">
  <CategorySidebar
    categories={categories}
    selectedCategory={selectedCategory}
    onSelectCategory={(id) => setSelectedCategory(id)}
    onAddCategory={() => {
      console.log("Add category");
    }}
  />
  <div className="notes-content">

      <div className="notes-page">
        <h2 className="notes-title">My Notes</h2>

        <div className="notes-filters">
          <Input
            label="Search notes"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-add">
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
              const excerpt = note.content.replace(/<[^>]*>/g, "").substring(0, 150);

              return (
                <div
                  key={note.id}
                  className="note-card"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <div className="note-card-header">
                    <h3 className="note-card-title">{note.title || "Untitled"}</h3>
                             <div
                    className="note-card-delete"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(note.id);
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
         
                  <span className="note-card-date">{timeAgo(note.updated_at)}</span>
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
    </div>
    </>
  );
};

export default Notes;
