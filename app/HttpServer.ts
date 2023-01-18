import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

