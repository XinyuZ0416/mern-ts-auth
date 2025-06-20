import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row } from 'react-bootstrap';
import * as NotesApi from "./network/notes_api";

function App() {
  const [ notes, setNotes ] = useState<NoteModel[]>([]);

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

  return (
    <div>
      <Button>Create</Button>
      {notes.map((note) => {
        return(
          <>
          <Container>
            <Row>
              <Col><Note note={note} key={note._id} /></Col>
              <Col>
                <Row>
                  <Col><Button>Update</Button></Col>
                </Row>
                <Row>
                  <Col><Button>Delete</Button></Col>
                </Row>
              </Col>
            </Row>
          </Container>
          </>
        )
      })}
    </div>
  );
}

export default App;
