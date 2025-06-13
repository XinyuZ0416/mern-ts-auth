import app from "./app";
import "dotenv/config";
import mongoose from "mongoose";
import env from "./util/validateEnv";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        
        app.listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });