import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, select: false }, // don't return email and password by default when queried unless specified
    password: { type: String, required: true, select: false },
});

// create a type
type User = InferSchemaType<typeof userSchema>;

// create and export a model
export default model<User>("User", userSchema);
