import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

interface CreateNoteBody {
    title?: string,
    text?: string
}

interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string,
    text?: string,
}

// create one note
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try{
        assertIsDefined(authenticatedUserId);

        if (!title) throw createHttpError(400, "Note must have a title!!!");

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

// read all notes
export const getNotes: RequestHandler = async(req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try{
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec(); // .exec() executes the query asynchronously and returns a promise 
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

// read one note
export const getNote: RequestHandler = async(req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;
    
    try {
        assertIsDefined(authenticatedUserId);

        // if note ID is invalid
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note ID...");
        
        const note = await NoteModel.findById(noteId).exec();
        
        // if there's no such note
        if (!note) throw createHttpError(404, "Note not found...");

        // if note doesn't belong to the user
        if (!note.userId.equals(authenticatedUserId)) throw createHttpError(401, "You can't access this note!");

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

// update one note
export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        // if note ID is invalid
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note ID!");

        // if user didn't enter title
        if (!newTitle) throw createHttpError(400, "Note must have a title!");

        // if note doesn't exist
        const note = await NoteModel.findById(noteId).exec();
        if (!note) throw createHttpError(404, "Note not found.");

        // if note doesn't belong to the user
        if (!note.userId.equals(authenticatedUserId)) throw createHttpError(401, "You can't access this note!");

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
}

// delete one note
export const deleteNote: RequestHandler<UpdateNoteParams, unknown, unknown, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        // if note ID is invalid
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note ID!");

        // if note doesn't exist
        const originalNote = await NoteModel.findById(noteId);
        if (!originalNote) throw createHttpError(404, "This note doesn't exist!");

        // if note doesn't belong to the user
        if (!originalNote.userId.equals(authenticatedUserId)) throw createHttpError(401, "You can't access this note!");

        await NoteModel.findByIdAndDelete(noteId);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}