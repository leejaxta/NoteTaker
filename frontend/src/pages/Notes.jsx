import { useContext, useEffect, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../api/notes.api";
import { createCategory, getCategories } from "../api/categories.api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import CategorySelect from "../components/common/CategorySelect";
import { AuthContext } from "../context/AuthContext";
import Pagination from "../components/common/pagination";

const Notes = () => {
  const { user, logout } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategories, setEditCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);


  const loadNotes = async ({ pageNumber = 1, categoryId = selectedCategory, searchText = search } = {}) => {
    const [notesRes, categoriesRes] = await Promise.all([
      getNotes({
        page: pageNumber,
        limit,
        categoryId,
        search: searchText,
      }),
      getCategories(),
    ]);

    console.log(notesRes.data.data);

    setNotes(notesRes.data.data.data);
    setPage(notesRes.data.data.page);
    setTotalPages(notesRes.data.data.totalPages);
    setCategories(categoriesRes.data.data);
  };

  useEffect(() => {
    loadNotes({ pageNumber: 1 });
  }, [selectedCategory, search]);


  const handleCreate = async () => {
    if (!title || !content) return alert("Title and content required");

    await createNote({
      title,
      content,
      categoryIds: selectedCategories,
    });

    setTitle("");
    setContent("");
    setSelectedCategories([]);
    loadNotes({ pageNumber: 1 });
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    await createCategory({ name: newCategory });
    setNewCategory("");
    loadNotes({}); 
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes({});
  };

  const openEditModal = (note) => {
    setEditNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategories((note.categories || []).map((c) => c.id));
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editContent) return alert("Title and content required");

    await updateNote(editNoteId, {
      title: editTitle,
      content: editContent,
      categoryIds: editCategories.filter(Boolean),
    });

    setIsModalOpen(false);
    loadNotes({});
  };


  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>My Notes</h2>
      {user && <Button onClick={logout}>Logout</Button>}

      <Input
        label="Search notes"
        placeholder="Search by title or content..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Input
        label="New Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <Button onClick={handleCreateCategory}>Add Category</Button>

      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <CategorySelect
        categories={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />
      <Button onClick={handleCreate}>Add Note</Button>

      <hr />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {notes.map((note) => (
        <div key={note.id} style={{ marginBottom: "16px" }}>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          <div>
            {(note.categories || []).map((c) => (
              <span key={c.id} style={{ marginRight: "6px", fontSize: "12px" }}>
                #{c.name}
              </span>
            ))}
          </div>
          <Button onClick={() => openEditModal(note)}>Edit</Button>
          <Button onClick={() => handleDelete(note.id)}>Delete</Button>
        </div>
      ))}

      <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => loadNotes({ pageNumber: newPage })} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Note">
        <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        <Input label="Content" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        <CategorySelect categories={categories} selected={editCategories} onChange={setEditCategories} />
        <Button onClick={handleUpdate}>Save</Button>
      </Modal>
    </div>
  );
};

export default Notes;
