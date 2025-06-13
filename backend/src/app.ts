import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";

const app = express();

// accept json body for Create
app.use(express.json());

app.use("/api/notes", notesRoutes);

// catch all (404) middleware
app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});

// error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    
    let errorMessage = "An unknown error has occurred";
    if (error instanceof Error) errorMessage = error.message;

    res.status(500).json({error: errorMessage});
});

export default app;
