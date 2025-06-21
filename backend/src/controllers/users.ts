import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

interface LoginBody {
    username?: string,
    password?: string,
}

// sign up (create)
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown > = async(req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        // if user didn't put in username/ email/ password
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

// log in (create)
export const login: RequestHandler<unknown, unknown, LoginBody, unknown > = async(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // if user didn't put in username/ password
        if (!username || !password) throw createHttpError(400, "Username/ password missing!");
        
        // check if can find the user
        const user = await UserModel.findOne({ username: username }).select("+password + email").exec();
        if (!user) throw createHttpError(401, "Invalid credentials, check your username.");

        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw createHttpError(401, "Invalid credentials, check your password");

        // log user in
        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

// logout (create)
export const logout:RequestHandler = async(req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
}

// auth session (read)
export const getAuthenticatedUser: RequestHandler = async(req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId) throw createHttpError(401, "User not authenticated");

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}