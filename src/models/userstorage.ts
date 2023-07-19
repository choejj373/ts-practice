"use strict";

import  { GetConnection, ReleaseConnection, Format }  from  "../config/db.js";

//use function for mysql module
// function getConnection(callback){
//     dbPool.getConnection( function(err, conn ){
//         if(!err){
//             callback(conn);
//         }
//     });
// }

export class UserStorage{
    
    private static _instance:UserStorage;

    private constructor(){

    }

    public static getInstance():UserStorage
    {
        if( UserStorage._instance == null )
            UserStorage._instance  = new UserStorage();

        return UserStorage._instance;
    }
    test()
    {
        // return new Promise( (resolve, reject) =>{
        //     getConnection( (conn) =>{
        //         conn.query("call testProc3(?);", "choejj", ( err ) =>{
        //             if(err) reject (`${err}`);
        //             resolve();
        //         });
        //         conn.release();
        //     });
        // });
    }
    async updateNickName( userId:number, newNickName : string){
        let result = { success:false, msg:"db error"}
        const conn = await GetConnection();
        //UPDATE user SET money = money + ? WHERE id = ?;
        try{
            console.log( userId); 
            console.log( newNickName ); 

            const query_result:any = await conn.query("update user SET name = ? where id = ?;", 
                        [ newNickName, userId] );

            console.log( query_result);
            console.log( query_result[0]);

            if( query_result[0].affectedRows > 0  ) {
                console.log("success");
                result = {success:true, msg:newNickName};
            }else{
                result = {success:false, msg:"nick name is duplicated or not found user id"};
            }

        }catch( err : any){
            console.log( err );
            //result.msg = err.sqlMessage;
        }finally{
            ReleaseConnection( conn );
        }        
        return result;
    }
    // 5분마다 1씩 충전되는 battleCoin에 대한 처리 : 유저 정보를 가져가거나 사용전 호출 필요
    async updateBattleCoin( user_id:number ){
        const conn = await GetConnection();

        try{
            const [row] : any = await conn.query("SELECT battle_coin, update_time FROM user WHERE id = ?;", [user_id] );
            console.log( row );
            
            if( Array.isArray(row) && row.length === 0 ) {
                console.log("not found : ", user_id );
            }else{
    
                const maxBattleCoin = 100;
    
                const nowDateUTC = new Date();//.now().getTime();
                const updateDateUTC = new Date( row[0].update_time );
    
                // console.log( nowDateUTC );
                // console.log( updateDateUTC );
    
                const nowTimeUTC : number = nowDateUTC.getTime();
                const updateTimeUTC : number = updateDateUTC.getTime();
                const elapsedTime : number = nowTimeUTC - updateTimeUTC;
                
                // console.log( nowTimeUTC );
                // console.log( updateTimeUTC );
                // console.log( elapsedTime );
                
                // todo : check int
                const elapsedCount : number = elapsedTime / ( 1000 * 60 * 5 )//5분마다 1번
    
                // console.log( "elapsedCount : ", elapsedCount);
    
                if( row[0].battle_coin < maxBattleCoin )
                {
                    if( elapsedCount > 0 )
                    {
                        let newBattleCoin = row[0].battle_coin + elapsedCount;
    
                        if( newBattleCoin > maxBattleCoin ){ newBattleCoin = maxBattleCoin;}
                        console.log( "new battle coin : ", newBattleCoin );
    
                        const result1 = await conn.query("UPDATE user SET battle_coin = ?, update_time = DATE_ADD( update_time, INTERVAL ? MINUTE) WHERE id = ?",
                                            [ newBattleCoin, elapsedCount  * 5, user_id ]);
    
                        // console.log( result1 );
                    }
                    else
                    {
                        console.log("time is not enough");
                    }
                }
                else
                {
                    console.log("battle coin is full : ", row[0].battle_coin );

                    const result1 = await conn.query("UPDATE user SET update_time = ? WHERE id = ?",
                                [ new Date(), user_id ]);
    
                    // console.log( result1 );
                }
            }
        }catch( err ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }        
    }

    async deleteTradeDailyStore( userId : number, tradeId : number )
    {
        const conn = await GetConnection();

        try{
            conn.query("delete from trade_daily_store where id = ? AND owner = ?;", 
                        [ tradeId, userId] );

        }catch( err ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }
    }
    async getTradeDailyStore( user_id : number ){
        const conn = await GetConnection();
        let retVal : any;

        try{
            const [row]:any = await conn.query("select * from trade_daily_store where owner = ?;", [user_id] );

            retVal = row;
        }catch( err ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }


    async getAccountInfo(id:string){

        // await UserStorage.updateBattleCoin( id );

        const conn = await GetConnection();
        let retVal = null;

        try{
            const [row]:any= await conn.query("select * from account where account.id = ?;", [id] );
            // console.log( row );
            retVal = row[0];
        }catch( err ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async getUserInfo(id:number){

        await this.updateBattleCoin( id );

        const conn = await GetConnection();
        let retVal;

        try{
            const [row] : any = await conn.query("SELECT * FROM user WHERE id = ?;", [id] );
            retVal = row[0];
        }catch( err ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    //todo 닉네임 중복시 기존 닉네임 + a 로 자동으로 변경
    public async save( id:string, name:string ,hashedpassword:string, salt:string ){
        
        console.log( "UserStorage.save");

        const conn = await GetConnection();
        let retVal = {success:false, userId:0, msg:""};;
        try{


            const sql1 = "INSERT INTO user( name ) VALUES (?);";
            const sql1a = [ name ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "INSERT INTO account(id, psword, salt, user_id) VALUES(?, ?, ?, LAST_INSERT_ID());";
            const sql2a = [id,hashedpassword, salt];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, userId:result[0][0].insertId, msg:""};
            }else{
                console.log( "rollback");                            
                await conn.rollback();
            }
         
 
 
        }catch( err:any ){
            console.log( err );
            await conn.rollback();
            retVal = {success:false,userId:0,msg:err.sqlMessage};
        }finally{
            await ReleaseConnection( conn );;
        }

        return retVal;
    };

    async getItems( user_id:number ){
        const conn = await GetConnection();
        let retVal = { success: false, items:[]};
        try{
            const result:any = await conn.query("SELECT * FROM user_item WHERE owner = ?;", [user_id] );
            // console.log( result[0] );
            retVal.success = true;
            retVal.items = result[0];
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );;
        }
        return retVal;
    };
    async sellItem( user_id:number, item_uid:number ){
        const conn = await GetConnection();
        let retVal = { success:false };
        try{
            const sql1 = "DELETE FROM user_item WHERE id = ? AND owner = ?;";
            const sql1a = [ item_uid, user_id ];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            //over flow check
            const price = 100;
            const sql2a = [ price, user_id ];
            const sql2 = "UPDATE user SET money = money + ? WHERE id = ?;";
            const sql2s = Format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].changedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback");                            
                await conn.rollback();
            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );;
        }
        return retVal;
    };

    async isSoldOutDailyStore( user_id:number, type:number){
        const conn = await GetConnection();
        let retVal = { success:true , msg:'sold out'};
        
        try{
            const sql1 = "SELECT * FROM trade_daily_store WHERE owner = ? and type = ?";
            const sql1a = [user_id, type]
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const [row]:any = await conn.query( sql1s );

            if( Array.isArray(row) && row.length === 0 ) {
                retVal = {success:false,msg:""};
            }
        } catch( err ){
            console.log( err );
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async getFreeDiamond( user_id:number ){
        const conn = await GetConnection();
        let retVal = { success:false, msg:"" };

        try{

    
            const nowDate = new Date();
            const expireDate = new Date( nowDate.setHours( 24,0,0,0 ) );

            console.log( expireDate );

            const freeDiamond = 100;
            const sql1 = "INSERT INTO trade_daily_store (owner, type, value, expire_time ) values (?,?,?,?);";
            const sql1a = [user_id, 1, freeDiamond, expireDate ]
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            
            const sql2a = [freeDiamond, user_id]
            const sql2 = "UPDATE user SET diamond = diamond + ? WHERE id = ?;";
            const sql2s = Format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].changedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                console.log( "rollback : ");                            
                await conn.rollback();
            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;
    };

    //TODO ITEM_INDEX는 DB에서 가져오지 말고 CLIENT에서 받아서 UPDATE시에 검증하는 방식으로 바꾸자
    //ITEM_TABLE => USER_ITEM 변경, ITEM_LIST 추가 필요
    async unEquipItemSameType( userId:number, itemId:number )
    {
        console.log( "unEquipItemSameType : ", userId," ", itemId)
        const conn = await GetConnection();
        try{        
            let [row1]:any = await conn.query("SELECT item_id FROM user_item WHERE id = ? ;", [itemId] );

            if( Array.isArray( row1 ) && row1.length > 0 )
            {
                console.log( row1[0].item_index) ;
                // TODO : item_uid != itemId를 하지 않으면 이어서 실행될 equpItem이 제대로 동작하지 않는다.
                // equipItem이후 처리가 되는게 아닐까?????
                const [row2] = await conn.query("UPDATE user_item SET equip = 0 WHERE owner = ? AND item_id = ? AND id != ?;", 
                             [userId, row1[0].item_index, itemId] );

            }
            else{
                console.log("not found");
            }

        }catch( err ){
            console.error( err );
        }finally{
            ReleaseConnection( conn );
        }
    }

    async equipItem( userId:number, itemId:number )
    {
        // TODO : 중복 장착 체크 추가 필요
        this.unEquipItemSameType( userId, itemId );
        // 테이블 구조를 바꿀지 INDEX를 추가 할지 선택 필요 => 인덱스 추가
        // 현재 있는 item_index 를 item_type으로 사용하자 일단;
        const conn = await GetConnection();
        let retVal = { success:false };
        try{        
            const [result]:any = await conn.query("UPDATE user_item SET equip = 1 WHERE id = ? AND owner = ? ;", 
                        [itemId, userId] );

            if( result.changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async unEquipItem( userId:number, itemId:number )
    {
        const conn = await GetConnection();
        let retVal = { success:false };
        try{        
            const [result] :any = await conn.query("UPDATE user_item SET equip = 0 WHERE id = ? AND owner = ? ;", 
                        [itemId, userId] );

            if( result.changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    }

    async buyItemByDia( user_id:number, itemType:number, price:number ){
        const conn = await GetConnection();
        let retVal = { success:false,msg:"error" };
        try{
            const sql1 = "INSERT INTO user_item (item_id, owner) values (?,?);";
            const sql1a = [itemType, user_id]
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [price, user_id, price]
            const sql2 = "UPDATE user SET diamond = diamond - ? WHERE id = ? AND diamond >= ?;";
            const sql2s = Format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true,msg:""};
            }else{
                console.log( "rollback : ");                            
                await conn.rollback();
                if( result[0][1].affectedRows <= 0 ){
                    retVal = {success:false, msg:'not enough diamond'};
                }

            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;
    }
    // 뭔가 지저분 그냥 sp를 호출할까? 아님 money를 일단 가져올까?
    async buyItem( user_id:number ){

        const conn = await GetConnection();
        let retVal = { success:false };
        try{
            const sql1 = "INSERT INTO user_item (owner) values (?);";
            const sql1s = Format( sql1, user_id );
            console.log( sql1s );

            const price = 100;
            const sql2a = [price, user_id, price ]
            const sql2 = "UPDATE user SET money = money - ? WHERE id = ? AND money >= ?;";
            const sql2s = Format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback : ");                            
                await conn.rollback();
            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            ReleaseConnection( conn );
        }
        return retVal;
    };

    async startSingleGame( user_id:number ){

        await this.updateBattleCoin( user_id );

        const conn = await GetConnection();
        let retVal = { success:false };
        try{        
            const result:any = await conn.query("UPDATE user SET battle_coin = battle_coin - 1 WHERE id = (?) AND battle_coin >= 1;", [user_id] );

            if( result[0].affectedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    };

    // overflow 체크 필요
    async addUserMoney( user_id:number, money:number ){
        const conn = await GetConnection();
        let retVal = { success:false };
        try{        
        
            const result:any = await conn.query("UPDATE user SET money = money + ? WHERE id = ?;", [money, user_id] );

            if( result[0].affectedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    };
}


//module.exports = UserStorage;


