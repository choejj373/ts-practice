import request from "superset";

import { describe, expect, test, assert } from 'vitest'
import { createApp } from "../src/app";

describe("Sign up", ()=>{
    let app = createApp();    

    // beforeAll( async()=>{
    //     app = createApp();
    // })

    // afterAll( async()=>{

    // })
    //app.request()

    test("not at all", async()=>{
        assert.equal(Math.sqrt(4), 2)
    })
})