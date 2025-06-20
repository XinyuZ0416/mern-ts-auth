import React from 'react'
import { Note as NoteModel } from "../models/note";
import { Button, Card, Container, Row } from 'react-bootstrap';

interface NoteProps {
    note: NoteModel,
    onNoteClicked: (note: NoteModel) => void,
    onDeleteNoteClicked: (note: NoteModel) => void,
}

export const Note = ({ note, onNoteClicked, onDeleteNoteClicked }: NoteProps) => {
  return (
    <>
    <Card onClick={() => onNoteClicked(note)} style={{ cursor: "pointer"}}>
      <Card.Body>
        <Card.Title>
            {note.title}
        </Card.Title>
        <Card.Text>
          <Container>
            <Row>
              {note.text}
            </Row>
            <Row>
              Created at {note.createdAt}
            </Row>
            <Row>
              Updated at {note.updatedAt}
            </Row>
            <Row>
              <Button onClick={(e) => {
                onDeleteNoteClicked(note);
                e.stopPropagation();
              }}>Delete</Button>
            </Row>
          </Container>
        </Card.Text>
      </Card.Body>
    </Card>
    </>
  )
}


export default Note