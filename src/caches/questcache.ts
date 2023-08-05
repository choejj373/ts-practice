import { redisCli } from './redis.js';

interface questInfo {
    id:number,
    quest_index:number,
    fulfill_type:number,
}

//TODO redis String -> Hash로 변경
export const QuestCache = {
    isExist : async ( userId:number) =>{
        const key = 'quest:' + String( userId );
        const result = await redisCli.exists( key );
        return result;
    },

    setQuestList :  async ( userId:number, infos:questInfo[] ) =>{
        const key = 'quest:' + String( userId );

       
        infos.forEach((value)=>{
            redisCli.HSET(  key, 
                            value.id, 
                            JSON.stringify({ id:value.id, quest_index:value.quest_index, fulfill_type:value.fulfill_type }));
        })

        redisCli.expire( key, 60 );
    },

    getQuestList :  async( userId:number ) =>{
        const key = 'quest:' + String( userId );
        
        const rows = await redisCli.HGETALL( key );


        let res : questInfo[] = [];
        Object.values( rows ).forEach((value)=>{
            res.push( JSON.parse(value) );
        })

        console.log( res ); 
        return res;
    },
    
    delQuestInfo : async ( userId:number, questId:number)=>{
        const key = 'quest:' + String( userId );
        
        redisCli.HDEL( key, String(questId) );
    },
}