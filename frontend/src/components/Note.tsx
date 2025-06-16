import React from 'react'
import { Note as NoteModel } from "../models/note";
import { Card, Container, Row } from 'react-bootstrap';

interface NoteProps {
    note: NoteModel,
}

export const Note = ({ note }: NoteProps) => {
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
