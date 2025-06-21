import { Note } from "../models/note";
import { User } from "../models/user";

export interface NoteInput {
    title: string,
    text?: string,
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export interface LogInCredentials {
    username: string,
    password: string,
}

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

// update a note
export const  updateNote = async(noteId: string, note: NoteInput) => {
    const response = await fetchData(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    return response.json();
}

// delete a note
export const deleteNote = async(noteId: string) => {
    await fetchData(`/api/notes/${noteId}`, { method: "DELETE"});
}

// get logged in user
export const getLoggedInUser = async(): Promise<User> => {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

// sign up
export const signUp = async(credentials: SignUpCredentials): Promise<User> => {
    const response = await fetchData("/api/users/signup", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

// log in
export const login = async(credentials: LogInCredentials): Promise<User> => {
    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

// log out
export const logout = async() => {
    await fetchData("/api/users/logout", { method: "POST" });
}