import { InferSchemaType, model, Schema } from "mongoose";

const noteSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String },
}, {timestamps: true});

// create a type
type Note = InferSchemaType<typeof noteSchema>;

// create and export a model
export default model<Note>("Note", noteSchema);