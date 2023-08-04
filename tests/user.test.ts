import request from "supertest";
import config from '../src/config/index.js';

import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { createApp } from "../src/app";
import { CreateDBPool } from "../src/models/db";
import { ConnectRedis } from '../src/caches/redis.js';

import { Quest } from '../src/services/quest';
import { Store } from '../src/services/store';

import { QuestCache } from '../src/caches/questcache.js';

describe("Sign up", ()=>{
    let app;    
    let agent;
    let guestId;

    beforeAll( async()=>{
        app = createApp();
 
        const dbconfig = config.database;
        dbconfig.database = "test_practice";

        CreateDBPool( dbconfig );
        ConnectRedis( config.redis );

        Quest.getInstance().loadData();
        Store.getInstance().loadData();

    })

    afterAll( async()=>{

    })

    // test("guest regist", async ()=>{
    //     const res = await request(app)
    //      .post('/user/guest')
    //      .expect(200)

    //      guestId = res.body.guestId;
    //      console.log( "guestId:" + guestId)
    // })

    // test("guest login", async ()=>  {
    //     agent = request.agent(app);

    //      await agent
    //     .put('/user/guest')
    //     .send({guestId: guestId})
    //     .expect(200, { success:true } );//false, msg: "존재하지 않는 아이디 입니다" } )
    // })

    // test("get user info - no token", async ()=>{
    //     await request(app)
    //     .get('/user') 
    //     .expect(401)
    // }) 

    // test("get user info - has token", async ()=>{
    //     await agent
    //     .get('/user')
    //     .expect(200)
    // })

    // test("save quest info", async ()=>{
    //     const questInfos = [ {id:1,index:1,fulfillType:1},{id:2,index:3,fulfillType:1},{id:3,index:3,fulfillType:1}];
    //     QuestCache.saveQuestInfo( 2, questInfos );
    // })

    
    // test("isExist false", async ()=>{
    //     expect( await QuestCache.isExist( 3 )).toBe(0);
    // })

    // test("isExist true", async ()=>{
    //     expect( await QuestCache.isExist( 2 )).toBe(1);
    // })

    // test("get quest info from redis", async()=>{
    //     await QuestCache.getQuestIdsByIndex( 2, 3 );
    // })
 
    test("quest process login", async ()=>{
        await Quest.getInstance().processLogin( 71 );
    })
     
})