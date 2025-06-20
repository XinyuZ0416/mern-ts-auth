import React from 'react'
import { Note as NoteModel } from "../models/note";
import { Button, Card, Container, Row } from 'react-bootstrap';

interface NoteProps {
    note: NoteModel,
    onDeleteNoteClicked: (note: NoteModel) => void,
}

export const Note = ({ note, onDeleteNoteClicked }: NoteProps) => {
  return (
    <>
    <Card>
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

// export default function Note({ note }: NoteProps) {
//   return (
//     <>
//     <Card>
//         <Card.Body>
//             <Card.Title>
//                 {note.title}
//             </Card.Title>
//         </Card.Body>
//     </Card>
//     </>
//   )
// }
