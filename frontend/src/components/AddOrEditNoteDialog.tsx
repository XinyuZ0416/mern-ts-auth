import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Note } from '../models/note'
import { useForm } from 'react-hook-form'
import { NoteInput } from '../network/notes_api'
import * as NotesApi from "../network/notes_api";
import { TextInputField } from './form/TextInputField'

interface AddOrEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

export const AddOrEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddOrEditNoteDialogProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    }
  });

  const onSubmit = async(input: NoteInput) => {
    try {
      let noteResponse: Note;
      if (noteToEdit) { // edit note
        noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
      } else { // create note
        noteResponse = await NotesApi.createNote(input);
      }
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? "Edit Note" : "Add Note"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id='addOrEditNoteFom' onSubmit={handleSubmit(onSubmit)}>
          <TextInputField 
            name='title' 
            label='Title' 
            type='text'
            placeholder='Title'
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          <TextInputField 
            name='text' 
            label='Text' 
            as='textarea'
            rows={5}
            placeholder='Text'
            register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button type='submit' form='addOrEditNoteFom' disabled={isSubmitting}>Save</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}
