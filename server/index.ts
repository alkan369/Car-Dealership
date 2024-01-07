import dotenv from 'dotenv';
import express from 'express';
import { Application, json } from "express";
import { ConnectOptions, connect } from 'mongoose';
import cors from 'cors';
import {connect as connectAPI} from "./api/connect"

dotenv.config();

const DB_CONNECTION = process.env.DB_CONNECTION_STRING;

const PORT = 3000

const app: Application = express();

app.use(json());
app.use(cors());

connectAPI(app,'/api');

app.get("/", (req, res) => {
    return res.status(200).json({ 'message': 'Hello World!' });
});

app.listen(PORT, () => {
    connect(DB_CONNECTION as string)
    .then(() => console.log('Connected To MongoDB'))
    .catch(error => console.log("Error connecting to DB " + error))
    .then(() => console.log(`Server listening on port ${PORT}`))
    .catch(error => console.log(error + "from error"));
})