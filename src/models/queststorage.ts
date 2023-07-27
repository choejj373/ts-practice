"use strict"

import { GetConnection, ReleaseConnection, Format } from "./db.js";


/*
user_quest
id : AUTO INC not null unique
quest_index = quest_list.id not null
quest_type  = quest_list.type not null
owner = account.id : secondary key not null
value : DEFAULT 0   not null

expire_date : NULL
complete : 보상 까지 받아서 완료 되었는지 체크
*/

/*
quest_list
id : pk int
type    // 일일/주간/업적 not null int
reward_type default 0 
reward_Value default 0
reward_subtype default 0 - 보상이 아이템일 경우 item_index를 설정한다.

fulfill_type default 0  
fulfill_value default 0 

next_quest int default 0        : 자동 연계 퀘스트로 다음 자동 생성될 퀘스트 ID( 일일/주간 퀘스트에 적용하면 안됨;;)
init_quest tinyint default 0    : 캐릭터 생성시 자동으로 생성될 퀘스트

limit_type  : 완료 제한 타입( 모바일의 경우 퀘스트는 자동으로 시작되는 경우가 대부분이다.)
limit_value : 제한 값
*/

// enum
// quest type   : 0 - 일반,       1 - 일일,       2 - 주간
// fulfill type : 1 - 로그인,     2 - 다이아 사용  3 - 스테이지 클리어
// reward type  : 1 - 다이아몬드, 2 - 골드,        3 - 아이템
// limit_type   : 1 - 스테이지 클리어


export class QuestStorage
{

    private static _instance:QuestStorage;
    private constructor(){

    }

    public static getInstance():QuestStorage
    {
        if( this._instance == null )
            this._instance  = new QuestStorage();

        return this._instance;
    }
        

    // 모든 Quest 기본 정보를 db에서 가져온다.
    async loadQuestList(){
        console.log("loadQuestList")
        const conn = await GetConnection();

        let retVal = { success: false, quests:[] };

        try{
            const [row]:any = await conn.query("SELECT * FROM quest_list;" );
            retVal.success = true;
            retVal.quests = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async questDeleteNCreate( userId:number, deleteQuestId:number, createQuestIndex:number, createQuestType:number )
    {
        const conn = await GetConnection();
        let retVal = { success:false,msg:"" };
        try{
            const sql1 = "DELETE FROM user_quest WHERE id = ? AND owner = ?;"
            const sql1a = [ deleteQuestId, userId ]
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2 = "INSERT INTO user_quest ( quest_index, quest_type, owner ) values ( ?, ?, ? );";
            const sql2a = [ createQuestIndex, createQuestType, userId]
            const sql2s = Format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result : any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true,msg:""};
            }else{
                console.log( "rollback : ", "db query failed");                            
                await conn.rollback();
                retVal = {success:false, msg:"db query failed"};
            }

        } catch( err ){
            console.log( "rollback : ", err );
            retVal = {success:false, msg:"db query error"};
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;         
    }
    // rewardValue : 아이템의 갯수, 소모 아이템등의 갯수가 존재하는 아이템의 경우 사용 defalut = 1
    async rewardItem( userId:number, questId:number, questIndex:number, fulfillValue:number, rewardValue:number, rewardSubtype:number )
    {
        const conn = await GetConnection();
        let retVal = { success:false, msg:"" };
        try{
            const sql1 = "UPDATE user_quest SET complete = 1 WHERE  id = ? AND complete = 0 AND owner = ? AND quest_index = ? AND value >= ?;";
            const sql1a = [ questId, userId, questIndex, fulfillValue ];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2 = "INSERT INTO item_table (item_index, owner) values (?,?);";
            const sql2a = [rewardSubtype, userId]
            const sql2s = Format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result : any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                console.log( "rollback : ", "db query failed");                            
                await conn.rollback();
                retVal = {success:false, msg:"db query failed"};
            }

        } catch( err ){
            console.log( "rollback : ", err );
            retVal = {success:false, msg:"db query error"};
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;      
    }
    async rewardMoney( userId:number, questId:number, questIndex:number, fulfillValue:number, rewardValue:number )
    {
        const conn = await GetConnection();

        let retVal = { success:false, msg:"" };
        try{
            const sql1 = "UPDATE user_quest SET complete = 1 WHERE  id = ? AND complete = 0 AND owner = ? AND quest_index = ? AND value >= ?;";
            const sql1a = [ questId, userId, questIndex, fulfillValue ];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [ rewardValue, userId ];
            const sql2 = "UPDATE user SET money = money + ? WHERE id = ?;";
            const sql2s = Format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result : any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                console.log( "rollback : ", "db query failed");                            
                await conn.rollback();
                retVal = {success:false, msg:"db query failed"};
            }

        } catch( err ){
            console.log( "rollback : ", err );
            retVal = {success:false, msg:"db query error"};
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;        
    }
    async rewardDiamond( userId:number, questId:number, questIndex:number, fulfillValue:number, rewardValue:number )
    {
        const conn = await GetConnection();
        let retVal = { success:false , msg:""};
        try{
            const sql1 = "UPDATE user_quest SET complete = 1 WHERE  id = ? AND complete = 0 AND owner = ? AND quest_index = ? AND value >= ?;";
            const sql1a = [ questId, userId, questIndex, fulfillValue ];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [ rewardValue, userId ];
            const sql2 = "UPDATE user SET diamond = diamond + ? WHERE id = ?;";
            const sql2s = Format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result : any = await conn.query( sql1s + sql2s);

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0  ) {                
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                console.log( "rollback");                            
                await conn.rollback();
                retVal = {success:false, msg:"db query failed"};
            }
        } catch( err ){
            console.log( "rollback-", err );
            retVal = {success:false, msg:"db query error"};
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;
    }
    async setUserQuestValue( userId:number, fulfillType:number, fulfillValue:number ){
        const conn = await GetConnection();

        try{
            // await conn.query("UPDATE user_quest SET value = value + ? WHERE owner = ? AND quest_index=?;", 
            //         [addValue, userId, questIndex] );

            await conn.query("UPDATE user_quest SET value = ? WHERE owner = ? AND quest_index IN ( select quest_list.id from quest_list where quest_list.fulfill_type = ?  AND quest_list.fulfill_value = ?);", 
                    [ fulfillValue, userId, fulfillType, fulfillValue] );

        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
    }
    async addUserQuestValue( userId:number, fulfillType:number, addValue:number ){

        const conn = await GetConnection();

        try{
            // await conn.query("UPDATE user_quest SET value = value + ? WHERE owner = ? AND quest_index=?;", 
            //         [addValue, userId, questIndex] );

            await conn.query("UPDATE user_quest SET value = value + ? WHERE owner = ? AND quest_index IN ( select quest_list.id from quest_list where quest_list.fulfill_type = ? );", 
                    [addValue, userId, fulfillType] );

        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
    }

    async getUserQuestInfo( userId:number, questType:number ){
        const conn = await GetConnection();

        let retVal = { success: false, quests:[] };

        try{
            const [row] : any = await conn.query("SELECT * FROM user_quest WHERE owner = ? AND quest_type=?;", 
                    [userId, questType] );

            retVal.success = true;
            retVal.quests = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }
    

    // 만료된 일일/주간 퀘스트 RESET
    async resetRepeatQuestInfo( questId:number, userId:number, expireDate:any )
    {
        const conn = await GetConnection();

        let retVal = { success: false };

        try{
            const [result1] = await conn.query("UPDATE user_quest SET value = 0, complete = 0, expire_date = ? WHERE id = ? AND owner = ?;", 
                        [ expireDate, questId, userId ] );

            retVal.success = true;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async createUserQuestAll( userId:number, questList:any )
    {
        console.log( "QuestStorage.createUserQuestAll");

        const conn = await GetConnection();
        
        try{
            const nowDate = new Date();
            const nowDay = nowDate.getDay();

            // 주의 다음 라인부터 nowDate는 당일 자정
            const expireDailyDate = new Date( nowDate.setHours( 24,0,0,0 ) );

            let remainDayToWeekend = 0;
            if( nowDay > 0 ){
                remainDayToWeekend = 7 - nowDay;
            }
    
            const weeklyExpireDate = new Date( nowDate.setDate( nowDate.getDate() + remainDayToWeekend )  );
    

            // TODO 소스 정리좀;
            questList.forEach( (element:any)=>{
                
                if( element.init_quest === 0 )
                    return;

                switch( element.type ){
                    case 1://일일 퀘스트
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, expire_date, owner ) values ( ?, ?, ?, ? )" ,
                                [ element.id, element.type, expireDailyDate, userId ] );
                        break;
                    case 2://주간 퀘스트
                        //expireDate 금주 일요일 자정으로 변경
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, expire_date, owner ) values ( ?, ?, ?, ? )" ,
                                [ element.id, element.type, weeklyExpireDate, userId ] );

                        break;
                    default:// 업적
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, owner ) values ( ?, ?, ? )" ,
                                [ element.id, element.type, userId ] );

                        break;
                }
            });
            
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
    }
}


