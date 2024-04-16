import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Common headers and authentication token
  const headers = {
    'Content-Type': 'application/json',
    "auth-token": localStorage.getItem('token')
  };

  // Get all Notes
  // const getNotes = async () => {
  //   try {
  //     const response = await fetch(`${host}/api/notes/fetchallnotes`, {
  //       method: 'GET',
  //       headers: headers,
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch notes');
  //     }
  //     const json = await response.json();
  //     setNotes(json);
  //   } catch (error) {
  //     console.error('Error fetching notes:', error);
  //   }
  // };

  const getNotes = async () => {
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
        "auth-token" : localStorage.getItem('token')
      }
    });
    const json = await response.json() 
    setNotes(json)
  }

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ title, description, tag })
      });
      const note = await response.json();
      setNotes([...notes, note]);
    } catch (error) {
      // Handle error
      console.error('Error adding note:', error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: headers
      });
      await response.json();
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      // Handle error
      console.error('Error deleting note:', error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ title, description, tag })
      });
      await response.json();
      setNotes(notes.map(note => (note._id === id ? { ...note, title, description, tag } : note)));
    } catch (error) {
      // Handle error
      console.error('Error editing note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
