import dotenv from 'dotenv';
import express from 'express';

import { Application, json } from "express";

dotenv.config();

const app: Application = express();

app.use(json());

app.get("/", (req, res) => {
    return res.status(200).json({'message':'Hello World!'});
});

const PORT = process.env.PORT || 8080

try {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
catch(error){
    console.log("Failed to start the server with error : ${error}");
}