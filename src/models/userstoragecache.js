"use strict"
// caching 중지
// const redis = require('redis');

// const redisClient = redis.createClient({
//     url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//     legacyMode: true, // 반드시 설정 !!
//  });

//  //async/await이 잘 동작 되려면 꼭 필요
//  const redisCli = redisClient.v4;

//  redisClient.on('connect', () => {
//     console.info('Redis connected!');
//  });

//  redisClient.on('error', (err) => {
//     console.error('Redis Client Error', err);
//  });

// redisClient.connect().then(); // redis v4 연결 (비동기)


class UserStorageCache{
    static async getItemAll( user_id){
        
        let result = { success:false };

        // caching 정지
        return result;

        console.log(`${user_id}:item`)
        const ret = await redisCli.keys(`${user_id}:item`)
        if( ret <= 0 ){
            console.log("not found from cache")
            return result;
        }
        
        let object = await redisCli.hGetAll( `${user_id}:item` );
        //let object = await redisCli.hGetAll( "choejj:item" );
        // console.log( object )
        if( object )
        {
            result.success = true;
            result.items = [];

            Object.values(object).forEach( element =>{
                result.items.push( JSON.parse(element) );
            });
            // console.log( result.success );

        };
        // await redisClient.hGetAll( "choejj:item", function( err, obj){
        //     if( !err ){
        //         result.success = true;
        //         result.items = [];
    
        //         Object.values(obj).forEach( element =>{
        //             result.items.push( JSON.parse(element) );
        //         });
        //         console.log( result );
        //     }
        //     else{
        //         console.error( err );
        //     }
        // });
        return result;
    }

    static saveItemAll( user_id, items ){
        return;// caching 중지

        items.forEach(element => {
            /*console.log( element );
            console.log( `${user_id}:item`);*/
            redisCli.hSet( `${user_id}:item`, element.item_uid, JSON.stringify( element) );
        });
        redisCli.expire( `${user_id}:item`, 60 );
    }

    static deleteItemAll( user_id){
        return;// caching 중지
        redisCli.del( `${user_id}:item` );
    }
}

module.exports = UserStorageCache;