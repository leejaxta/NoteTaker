import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import RichTextEditor from "../components/common/RichTextEditor";
import CategoryManager from "../components/common/CategoryManager";
import { AuthContext } from "../context/AuthContext";
import { createNote, getNote, updateNote } from "../api/notes.api";
import Toast from "../components/common/Toast";
import Navbar from "../components/common/Navbar";
import "../styles/NoteDetails.css";
import { timeAgo } from "../utils/timeAgo";
import BackButton from "../components/common/BackButton";

const NoteDetails = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const isEdit = !!noteId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      if (isEdit) {
        const res = await getNote(noteId);
        const note = res.data.data;
        setTitle(note.title);
        setContent(note.content);
        setSelectedCategories(
          (note.categories || []).map((c) => c?.id).filter(Boolean)
        );
        setCreatedAt(note.created_at);
        setUpdatedAt(note.updated_at);
      }
    };
    loadNote();
  }, [noteId, isEdit]);

  const handleSave = async () => {
    if (!title || !content) {
      setToast({ message: "Title and content are required!", type: "error" });
      return;
    }

    try {
      if (isEdit) {
        await updateNote(noteId, {
          title,
          content,
          categoryIds: selectedCategories,
        });
      } else {
        await createNote({ title, content, categoryIds: selectedCategories });
      }

      setToast({
        message: isEdit
          ? "Note updated successfully!"
          : "Note added successfully!",
        type: "success",
      });

      navigate("/");
    } catch {
      setToast({ message: "Something went wrong!", type: "error" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="note-details-container">
        <BackButton />
        <Input
          value={title}
          placeholder="Enter title..."
          onChange={(e) => setTitle(e.target.value)}
        />

        {isEdit && createdAt && updatedAt && (
          <div className="note-meta">
            <span>Created: {timeAgo(createdAt)}</span>
            <span>Last updated: {timeAgo(updatedAt)}</span>
          </div>
        )}

        <div className="category-manager">
          <CategoryManager
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="note-details-editor">
          <RichTextEditor content={content} setContent={setContent} />
        </div>

        <div className="note-details-actions">
          <Button onClick={handleSave}>
            {isEdit ? "Save Changes" : "Add Note"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            className="cancel-button"
          >
            Cancel
          </Button>
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

export default NoteDetails;
