import { Request, Response } from 'express';
import { CustomRequest } from '../customType/express.d';
import { Store } from "../services/store.js"
import { UserStorage } from "../models/userstorage.js";
import { Quest } from "../services/quest.js";

export const store = {
    getNormalTradeList : ( req:Request,res:Response )=>{

        const response = Store.getInstance().getNormalTradeList();
        return res.json( response );
    },
    
    getDailyTradeList : ( req:Request,res:Response )=>{

        const response = Store.getInstance().getDailyTradeList();
        return res.json( response );
    },

    buyNormalItem : async ( req:CustomRequest,res:Response )=>{
        const response = await Store.getInstance().buyNormalItem( req.userId??0, req.body.tradeId );
        return res.json( response );
    },

    buyDailyItem : async ( req:CustomRequest,res:Response )=>{
        const response = await Store.getInstance().buyDailyItem( req.userId??0, req.body.tradeId );
        return res.json( response );
    },

    getTradeDailyStore : async ( req:CustomRequest, res:Response )=>{
        console.log("get process.home userId:", req.userId);

        const tradeInfo = await UserStorage.getInstance().getTradeDailyStore( req.userId??0 );

        console.log( tradeInfo );

        const nowTime = new Date().getTime();

        let response = { success:true, tradeList:<any>[] }

        if( Array.isArray( tradeInfo ) && tradeInfo.length > 0 ){
            tradeInfo.forEach( (trade:any)=>{
                let expireTime = new Date( trade.expire_time ).getTime();
                
                console.log( nowTime," ", trade.expire_time );

                if( expireTime > nowTime )
                {
                    response.tradeList.push( trade );
                }else{
                    UserStorage.getInstance().deleteTradeDailyStore( req.userId??0, trade.id );
                }

            })
        }
        return res.json( response );
    },    
    dailystore: async(req:CustomRequest,res:Response)=>{
        console.log( 'process.dailystore : ', req.userId );
        console.log( req.body )        ;

        let response = { success:false, msg:"" };

        const result = await UserStorage.getInstance().isSoldOutDailyStore( req.userId??0, req.body.type )
        console.log( result );

        if( result.success ){
            response.msg = result.msg;
            return res.json(response);
        }

        switch( req.body.type )
        {
        case 1://무료 다이아
            response = await UserStorage.getInstance().getFreeDiamond( req.userId??0 );
            break;
        case 2://골드 구입 아이템
            break;
        default://기타
            break;
        }

        return res.json(response);
    },
    diamondstore: async( req:CustomRequest, res:Response)=>{
        console.log( 'process.diamondstore : ', req.userId );
        console.log( req.body )        ;

        const price = 10;
        let response = await UserStorage.getInstance().buyItemByDia( req.userId??0, req.body.itemType, price );

        Quest.getInstance().processUseDiamond( req.userId??0, price );

        return res.json(response);
    },        
}