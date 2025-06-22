import React, { useEffect, useState } from 'react'
import * as NotesApi from "../network/notes_api";
import { Button, Col, Container, Row } from 'react-bootstrap';
import { AddOrEditNoteDialog } from './AddOrEditNoteDialog';
import { Note as NoteModel } from '../models/note';
import Note from './Note';

export const NotesPageLoggedInView = () => {
  const [ notes, setNotes ] = useState<NoteModel[]>([]);
  const [ showAddNoteDialog, setShowAddNoteDialog ] = useState(false);
  const [ noteToEdit, setNoteToEdit ] = useState<NoteModel | null>(null);

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
    <>
    <Button onClick={() => setShowAddNoteDialog(true)}>Create</Button>
    {notes.map((note) => {
      return(
        <>
        <Container>
          <Row>
            <Col>
              <Note
                key={note._id} 
                note={note} 
                onNoteClicked={setNoteToEdit}
                onDeleteNoteClicked={deleteNote} />
            </Col>
          </Row>
        </Container>
        </>
      )
    })}

    {showAddNoteDialog && 
      <AddOrEditNoteDialog 
        onDismiss={() => setShowAddNoteDialog(false)} 
        onNoteSaved={(newNote) => {
          setNotes([...notes, newNote]);
          setShowAddNoteDialog(false);
        }}
      />}

    {noteToEdit && 
      <AddOrEditNoteDialog 
        noteToEdit={noteToEdit}
        onDismiss={() => setNoteToEdit(null)} 
        onNoteSaved={(updatedNote) => {
          setNotes(notes.map(n => n._id === updatedNote._id ? updatedNote : n));
          setNoteToEdit(null);
        }}
      />}
    </>
  )
}
