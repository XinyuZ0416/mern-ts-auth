import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

// sign up
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown > = async(req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        // if user didn't put in username/ email/ passwordRaw
        if (!username || !email || !passwordRaw) throw createHttpError(400, "Username/ email/ password missing!");

        // check if username already exists
        const existingUsername = await UserModel.findOne({ username: username}).exec();
        if (existingUsername) throw createHttpError(409, "Username already taken! Choose another username or log in.");

        // check if email already exists
        const existingEmail = await UserModel.findOne({ email: email}).exec();
        if (existingEmail) throw createHttpError(409, "Email already taken! Choose another email or log in.");

        // hash password
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        // create new user
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;
        
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}
