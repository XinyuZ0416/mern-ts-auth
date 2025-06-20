import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row } from 'react-bootstrap';
import * as NotesApi from "./network/notes_api";
import { AddNoteDialog } from './components/AddNoteDialog';

function App() {
  const [ notes, setNotes ] = useState<NoteModel[]>([]);
  const [ showAddNoteDialog, setShowAddNoteDialog ] = useState(false);

  useEffect(() => {
    const loadNotes = async() => {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  },[]);

  const deleteNote = async(note: NoteModel) => {
    try {
      await NotesApi.deleteNote(note._id);

      // update frontend
      setNotes(notes.filter(n => n._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div>
      <Button onClick={() => setShowAddNoteDialog(true)}>Create</Button>
      {notes.map((note) => {
        return(
          <>
          <Container>
            <Row>
              <Col>
                <Note key={note._id} note={note} onDeleteNoteClicked={deleteNote} />
              </Col>
              <Col>
                <Row>
                  <Col><Button>Update</Button></Col>
                </Row>
              </Col>
            </Row>
          </Container>
          </>
        )
      })}

      {showAddNoteDialog && 
        <AddNoteDialog 
          onDismiss={() => setShowAddNoteDialog(false)} 
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />}
    </div>
  );
}

export default App;
