import { Note } from "../models/note";

// manually handle error http codes because frontend doesn't automatically console.error() them
const fetchData = async(input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.ok) { // http code 200-299
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error; // errorBody.error because of `res.status(statusCode).json({error: errorMessage});` in backend/src/app.ts
        throw Error(errorMessage);
    }
}

// get all notes
export const fetchNotes = async(): Promise<Note[]> => {
    const response = await fetchData("/api/notes", { method: "GET" });
    return response.json();
}

// create a note
export interface NoteInput {
    title: string,
    text?: string,
}
export const createNote = async(note: NoteInput): Promise<Note> => {
    const response = await fetchData("/api/notes", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json();
}

