"use strict";

import config from './config/index.js'

import { createApp } from './app.js';
import { CreateDBPool } from './models/db.js';
import { Quest } from './services/quest.js';
import { Store } from './services/store.js';


const PORT = config.port || 3000;

const app = createApp();
// DB Connectin Pool 생성
CreateDBPool();

// Quest 관련 변하지 않는 Data를 DB로 부터 Load
Quest.getInstance().loadData();
Store.getInstance().loadData();


const server = app.listen(PORT, () =>{
    console.log("서버 가동 : ", PORT);
});