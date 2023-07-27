import { GetConnection, ReleaseConnection, Format } from "./db.js";

export const StoreStorage = {
    getItemList :async ()=>{
        const conn = await GetConnection();

        let retVal = { success: false, items:[] };

        try{
            const [row]:any = await conn.query("SELECT * FROM item_list;" );
            retVal.success = true;
            retVal.items = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    getTradeItemList :async ()=>{
        const conn = await GetConnection();

        let retVal = { success: false, tradeItems:[] };

        try{
            const [row]:any = await conn.query("SELECT * FROM trade_list;" );
            retVal.success = true;
            retVal.tradeItems = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    buyItem : async( userId:number, itemIndex:number, count:number, price:number )=>{
        const conn = await GetConnection();
        let retVal = { success:false,msg:"error" };
        try{
            const sql1 = "INSERT INTO user_item (item_id, owner) values (?,?);";
            const sql1a = [itemIndex, userId]
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [price, userId, price]
            const sql2 = "UPDATE user SET diamond = diamond - ? WHERE id = ? AND diamond >= ?;";
            const sql2s = Format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                await conn.commit();
                console.log( "commit");
                retVal = {success:true,msg:""};
            }else{
                await conn.rollback();
                console.log( "rollback : ");                            
                if( result[0][0].affectedRows === 0 ){
                    retVal = {success:false, msg: sql1};
                }
                if( price !== 0 && result[0][1].affectedRows === 0 ){
                    retVal = {success:false, msg: sql2};
                }
            }
        } catch( err ){
            await conn.rollback();
            console.log( "rollback-", err );
        } finally{
            ReleaseConnection( conn );
            console.log( "finally");
        }
        return retVal;
    }
}