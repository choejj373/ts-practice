import request from "supertest";
import config from '../src/config/index.js';

import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { createApp } from "../src/app";
import { CreateDBPool } from "../src/models/db";
describe("Sign up", ()=>{
    let app;    
    let agent;
    let guestId;

    beforeAll( async()=>{
        app = createApp();
        const dbconfig = config.database;
        dbconfig.database = "test_practice";

        CreateDBPool( dbconfig );
        

        // app.get("/user", (req, res) => res.json({ name: "alice" }))
    })

    afterAll( async()=>{

    })
    //app.request()

    test("guest regist", async()=>{
        const res = await request(app)
         .post('/user/guest')
         .expect(200)

         guestId = res.body.guestId;
         console.log( "guestId:" + guestId)
    })

    test("guest login", async()=>{
        agent = request.agent(app);

        await agent
        .put('/user/guest')
        .send({guestId: guestId})
        .expect(200, { success:true } );//false, msg: "존재하지 않는 아이디 입니다" } )
    })

    test("get user info - no token", async()=>{
        await request(app)
        .get('/user') 
        .expect(401)
    }) 

    test("get user info - has token", async()=>{
        await agent
        .get('/user')
        .expect(200)
    })

})