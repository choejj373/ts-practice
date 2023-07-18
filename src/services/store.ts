
import { StoreStorage } from '../models/storestorage.js';

export class Store {
    private static _instance:Store;
    private normalTradeList;
    private dailyTradeList;
    private itemList;

    private constructor(){
        this.normalTradeList = new Map();
        this.dailyTradeList = new Map();
        this.itemList = new Map();
    }
    public static getInstance():Store
    {
        if( this._instance == null )
            this._instance  = new Store();

        return this._instance;
    }

    public loadData(){
        console.log("Store::loadData")
        
        StoreStorage.getItemList()
        .then(( result:any)=>{
            result.items.forEach((item:any)=>{
                this.itemList.set( item.id, item );
            })

            console.log( this.itemList );
        })
        .catch( console.log);

        
        StoreStorage.getTradeItemList()
        .then(( result:any)=>{
            result.tradeItems.forEach((item:any)=>{
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
        })
        .catch( console.log);
    }
    
    public getDailyTradeList()
    {
        let response  = { success:true, tradeItems:Array.from( this.dailyTradeList.values() ) };
        return response;
    }

    public getNormalTradeList()
    {
        let response  = { success:true, tradeItems:Array.from( this.normalTradeList.values() ) };
        return response;
    }

}