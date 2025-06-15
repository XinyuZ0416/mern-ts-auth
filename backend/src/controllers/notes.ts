import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
        // if note ID is invalid
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note ID...");
        
        const note = await NoteModel.findById(noteId).exec();
        
        // if there's no such note
        if (!note) throw createHttpError(404, "Note not found...");

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

// create one note
interface CreateNoteBody {
    title?: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try{
        if (!title) throw createHttpError(400, "Note must have a title!!!");

        const newNote = await NoteModel.create({
            title: title,
            text: text
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

// update one note
interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string,
    text?: string,
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        // if note ID is invalid
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note ID!");

        // if user didn't enter title
        if (!newTitle) throw createHttpError(400, "Note must have a title!");

        const note = await NoteModel.findById(noteId).exec();
        // if there's no such note
        if (!note) throw createHttpError(404, "Note not found!");
        
        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
}