"use strict";

import express from "express";

import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import { Quest } from './services/quest.js'

import path from "path";



dotenv.config();
//__dirname 선언
const __dirname = path.resolve();



const minute = 1000 * 60;
const hour = minute * 60;

export const app = express();


app.use(cookieParser(process.env.COOKIE_SECRET));

import { router } from "./routes/index.js";


app.set("views", "./views" );
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/src/public')));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', router);

// console.log( process.env.PORT );
const PORT = process.env.PORT || 3000;


// Quest.getInstance().loadData();

const server = app.listen(PORT, () =>{
    console.log("서버 가동 : ", PORT);
});