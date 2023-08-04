import { redisCli } from './redis.js';

interface questInfo {
    id:number,
    quest_index:number,
    fulfill_type:number,
}
export const QuestCache = {
    isExist : async ( userId:number) =>{
        const key = 'quest:' + String( userId );
        const result = await redisCli.exists( key );
        return result;
    },

    saveQuestInfo :  async ( userId:number, infos:questInfo[] ) =>{
        const key = 'quest:' + String( userId );

       
        const payload = infos.map((value)=>{
            return { id:value.id, quest_index:value.quest_index, fulfill_type:value.fulfill_type };
        })


        redisCli.SET( key, JSON.stringify( payload ) );
        redisCli.expire( key, 60 );
    },

    getQuestList :  async( userId:number ) =>{
        let questIds : number[];

        const key = 'quest:' + String( userId );
        
        const rows = await redisCli.GET( key );

        const res = JSON.parse( rows??"" );

        return res;
    },
}