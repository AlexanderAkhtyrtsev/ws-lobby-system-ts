import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from "http";

dotenv.config();

export const app: Express = express();

export const server = http.createServer(app);