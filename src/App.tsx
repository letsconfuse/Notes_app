import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import "./styles.css";

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState("");

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) setNotes(storedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const content = editorState.getCurrentContent().getPlainText().trim();
    if (title.trim() && content) {
      setNotes([...notes, { title, content }]);
      setTitle("");
      setEditorState(EditorState.createEmpty());
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Notes</h1>
      </header>
      <div className="editor-container">
        <input
          type="text"
          className="title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editor-box">
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={(command, editorState) => {
              const newState = RichUtils.handleKeyCommand(editorState, command);
              if (newState) {
                setEditorState(newState);
                return "handled";
              }
              return "not-handled";
            }}
          />
        </div>
        <button className="add-note-btn" onClick={addNote}>
          ➕ Add Note
        </button>
      </div>
      <ul className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-message">No notes yet. Start writing!</p>
        ) : (
          notes.map((note, index) => (
            <li key={index} className="note-item">
              <div className="note-content">
                <strong className="note-title">{note.title}</strong>
                <p className="note-text">{note.content}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteNote(index)}>
                🗑
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NoteTakingApp;
