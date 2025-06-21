import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import usersRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"));

// accept json body for Create
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/notes", notesRoutes);

// catch all (404) middleware
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    
    // fallback error messages and status code
    let errorMessage = "An unknown error has occurred";
    let statusCode = 500; 

    if (isHttpError(error)) {
        errorMessage = error.message;
        statusCode = error.status;
    }

    res.status(statusCode).json({error: errorMessage});
});

export default app;
