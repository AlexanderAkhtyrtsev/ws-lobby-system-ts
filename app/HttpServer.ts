import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from "http";
import Lobby from "./Lobby";

dotenv.config();

export const app: Express = express();

app.post('/lobby', () => {
    const lobby = new Lobby()

    console.log(`Lobby #${lobby.id} created`)
})

export const server = http.createServer(app);