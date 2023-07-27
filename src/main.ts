"use strict";

// import dotenv from "dotenv";
// dotenv.config();
import config from './config/index.js'

import express from "express";
import cookieParser from 'cookie-parser';
import path from "path";

import { CreateDBPool } from './models/db.js';
import { Quest } from './services/quest.js'
import { Store } from './services/store.js'



//__dirname 선언
const __dirname = path.resolve();

const minute = 1000 * 60;
const hour = minute * 60;

export const app = express();


app.use(cookieParser( config.cookie.secret));

import { router } from "./routes/index.js";

app.set("views", path.join(__dirname,"./src/views" ) );
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, '/src/public')));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', router);


const PORT = config.port || 3000;

// DB Connectin Pool 생성
CreateDBPool();

// Quest 관련 변하지 않는 Data를 DB로 부터 Load
Quest.getInstance().loadData();
Store.getInstance().loadData();


const server = app.listen(PORT, () =>{
    console.log("서버 가동 : ", PORT);
});