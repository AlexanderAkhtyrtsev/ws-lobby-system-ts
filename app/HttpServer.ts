import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from "http";
import Lobby from "./Lobby";
import path from "path";

dotenv.config();

export const app: Express = express();

app.get('/', (req, res) => {
   res.sendFile(path.resolve(__dirname, '../public/index.html'))
});

app.post('/lobby', (req, res) => {
    const lobby = new Lobby()

    console.log(`Lobby #${lobby.id} created`)
    res.send({id: lobby.id})
})

export const server = http.createServer(app);
