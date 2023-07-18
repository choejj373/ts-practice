import { GetConnection, ReleaseConnection, Format } from "../config/db.js";

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
    }
}