
import { StoreStorage } from '../models/storestorage.js';
import { UserStorage } from '../models/userstorage.js';

export class Store {
    private static _instance:Store;
    private normalTradeList;
    private dailyTradeList;
    private itemList;

    private constructor(){
        this.normalTradeList    = new Map();
        this.dailyTradeList     = new Map();
        this.itemList           = new Map();
    }
    public static getInstance():Store
    {
        if( this._instance == null )
            this._instance  = new Store();

        return this._instance;
    }

    public async loadData(){
        console.log("Store::loadData")
        
        let result = await StoreStorage.getItemList()
        result.items.forEach((item:any)=>{
            this.itemList.set( item.id, item );
        })

        console.log( this.itemList );

        
        const resultTrade = await StoreStorage.getTradeItemList()
        resultTrade.tradeItems.forEach((item:any)=>{
            switch( item.store_type )
            {
            case 1:
                this.normalTradeList.set( item.id, item );
                break;
            case 2:
                this.dailyTradeList.set( item.id, item );
                break;
            default:
                console.log( "invalid trade item store type" );
                console.log( item );
                break;
            }
        })

        console.log( this.dailyTradeList.values() );
        console.log( this.normalTradeList.values() );
    }
    
    public getDailyTradeList()
    {
        const response  = { success:true, tradeItems:Array.from( this.dailyTradeList.values() ) };
        return response;
    }

    public getNormalTradeList()
    {
        const response  = { success:true, tradeItems:Array.from( this.normalTradeList.values() ) };
        return response;
    }

    public async buyNormalItem( userId:number, tradeId:number){
        const tradeItem = this.normalTradeList.get( tradeId );
        let response = { success:false, msg:""};
        if( tradeItem === null || tradeItem === undefined ){
            response.msg = "Invalid TradeID";
            return response;
        }

        switch( tradeItem.type )
        {
            case 1:
                response = await StoreStorage.buyItem( userId, tradeItem.sub_type, tradeItem.count, tradeItem.price );
                break;
            default:
                console.error("Invalid Type : " + tradeItem.type );
                break;
        }
        return response;

    }

    public async buyDailyItem( userId:number, tradeId:number){
        const tradeItem = this.dailyTradeList.get( tradeId );
        let response = { success:false, msg:""};
        if( tradeItem === null || tradeItem === undefined ){
            response.msg = "Invalid TradeID";
            return response;
        }

        if( await UserStorage.getInstance().isRestricted( userId, 2, tradeItem.id ) )
        {
            response.msg = "Request is Restricted";
            return response;
        }

        switch( tradeItem.type )
        {
            case 1:
                response = await StoreStorage.buyItem( userId, tradeItem.sub_type, tradeItem.count, tradeItem.price );
                break;
            case 2://다이아몬드
                response = await UserStorage.getInstance().addDiamond( userId, tradeItem.count );
                break;
            case 3://골드
                response = await UserStorage.getInstance().addUserMoney( userId, tradeItem.count );
                break;
            default:
                console.error("Invalid Type : " + tradeItem.type );
                break;
        }

        //TODO InsertOrUpdate UserRestriced( userId, tradeId, nowdate )
        if( response.success ){

            const nowDate = new Date();
            // 금일 자정
            const newDailyExpireDate = new Date( nowDate.setHours( 24,0,0,0) );
    
            UserStorage.getInstance().setRestricted( userId, 2, tradeItem.id, newDailyExpireDate );
        }
        return response;        
    }

}