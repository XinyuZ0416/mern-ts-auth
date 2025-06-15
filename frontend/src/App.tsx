import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Note } from './models/note';

function App() {
  const [ notes, setNotes ] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async() => {
      try {
        const response = await fetch("/api/notes", { method: "GET" });
        const notes = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        {JSON.stringify(notes)}
      </header>
    </div>
  );
}

export default App;
