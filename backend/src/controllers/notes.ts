import { RequestHandler } from "express";
import NoteModel from "../models/note";

// read all notes
export const getNotes: RequestHandler = async(req, res, next) => {
    try{
        const notes = await NoteModel.find().exec(); // .exec() executes the query asynchronously and returns a promise 
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

// read one note
export const getNote: RequestHandler = async(req, res, next) => {
    const noteId = req.params.noteId;
    
    try {
        const note = await NoteModel.findById(noteId).exec();
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

// create one note
export const createNotes: RequestHandler = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try{
        const newNote = await NoteModel.create({
            title: title,
            text: text
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}