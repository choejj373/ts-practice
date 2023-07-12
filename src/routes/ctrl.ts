"use strict";

import url from 'url';
import axios from 'axios';
import { Request, Response } from 'express';
import { CustomRequest } from '../customType/express.d';

import { token  } from '../modules/jwt.js';
import { User } from "../models/user.js";
import { UserStorage } from "../models/userstorage.js";
// import UserStorageCache from "../models/userstoragecache.js";
import { Quest } from "../services/quest.js";
import { Secret } from "../services/secret.js";


const CLIENT_ID = "145681489601-h711k94pqvn4d5i1kod2u8aqa5fauo4s.apps.googleusercontent.com";
const CLIENT_SECRET = "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"
const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URL = "http://localhost:3000/auth/google/callback";
const RESPONSE_TYPE = "code";
const SCOPE = "openid%20profile%20email";
const ACCESS_TYPE = "offline";
const OAUTH_URL = `${AUTHORIZE_URI}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URL}&scope=${SCOPE}&access_type=${ACCESS_TYPE}`;

const getToken = async ( code:any ) => {
    try{
        const tokenApi = await axios.post(
            `https://oauth2.googleapis.com/token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&grant_type=authorization_code`
        );

        const accessToken = tokenApi.data.access_token;

        return accessToken;
    }catch(err){
        return err;
    }
};

const getUserInfo = async ( accessToken:any) =>{
    try{
        const userInfoApi = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?alt=json`,
            {
                headers:{
                    authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return userInfoApi;
    }catch( err ){
        return err;
    }
}

const oauth2Api = async(code:any)=>{
    const accessToken = await getToken(code);
    const userInfo : any = await getUserInfo(accessToken) ;
    return userInfo.data;
}


export const output = {
    home : async (req:Request, res:Response) => {
        res.render("home/index.ejs")
    },
}

export const process = {

    checkToken :( req:Request,res:Response )=>{
        return res.json( { success:true } );
    }, 
    //대칭키는 항상 개인키로 암호화 하여 보낸다.
    getSymmetricKey : ( req:Request, res:Response ) => {
        const key = Secret.getInstance().getSymmetricKeyEncodedByPrivateKey();
        return res.json( { success:true, symmeticKey: `${key}` } );
    },
    getPublicKey : ( req:Request, res:Response ) => {
        const publicKey = Secret.getInstance().getPublicKey();
        return res.json( { success:true, publicKey: `${publicKey}` } );
    },
    requireQuestReward : async ( req:CustomRequest, res:Response, )=>{
        console.log( 'process.requireQuestReward : ', req.userId );
        const response = await Quest.getInstance().rewardQuestReward( req.userId ?? 0, req.body.questId, req.body.questIndex );
        return res.json( response );
    },
    getUserNormalQuestInfo : async( req:CustomRequest, res:Response)=>{
        console.log( 'process.getUserNormalQuestInfo : ', req.userId );
        const response = await Quest.getInstance().getUserNormalQuestInfo( req.userId ?? 0);
        return res.json( response );
    },
    getUserDailyQuestInfo : async( req:CustomRequest, res:Response)=>{
        console.log( 'process.getUserDailyQuestInfo : ', req.userId );
        const response = await Quest.getInstance().getUserDailyQuestInfo( req.userId ?? 0 );
        return res.json( response );
    },
    getUserWeeklyQuestInfo : async( req:CustomRequest, res:Response)=>{
        console.log( 'process.getUserWeeklyQuestInfo : ', req.userId );
        const response = await Quest.getInstance().getUserWeeklyQuestInfo( req.userId ?? 0 );
        return res.json( response );
    },
    equipItem : async( req:CustomRequest, res:Response)=>{

        console.log( 'process.equipItem : ', req.userId );
        console.log( req.body )        ;

        let response = await UserStorage.getInstance().equipItem( req.userId??0, req.body.itemUid );

        return res.json(response);
    },
    unEquipItem : async( req:CustomRequest, res:Response)=>{
        console.log( 'process.equipItem : ', req.userId );
        console.log( req.body )        ;

        let response = await UserStorage.getInstance().unEquipItem( req.userId??0, req.body.itemUid );

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
    sellItem: async(req:CustomRequest,res:Response)=>{
        console.log( 'process.sellItem : ', req.body.itemUid );
        const response = await UserStorage.getInstance().sellItem( req.userId??0, req.body.itemUid );
        // if( response.success )
        // {
        //     UserStorageCache.deleteItemAll(req.userId);
        // }
        return res.json(response);
    },
    getItemAll: async(req:CustomRequest,res:Response)=>{
        console.log( 'process.getItemAll : ', req.userId );

        let response;
        // response = await UserStorageCache.getItemAll( req.userId )
        // console.log( response.success );
        // if( response.success === true)
        // {
        //     console.log("Cache Hit");
        // }else{
            console.log("Cache no hit");
            response = await UserStorage.getInstance().getItems( req.userId??0 );
            // if( response.success )
            // {
            //     // console.log( response );
            //     UserStorageCache.saveItemAll( req.userId, response.items );
            // }
//        }
        return res.json(response);
    },
    login: async(req:CustomRequest, res:Response) => { 
        console.log( "process.login" );
        
        console.log(  req.body.id );
        console.log( req.body.psword );

        req.body.id = Secret.getInstance().getValueDecodedByPrivateKey( req.body.id );
        req.body.psword = Secret.getInstance().getValueDecodedByPrivateKey( req.body.psword );

        console.log(  req.body.id );
        console.log( req.body.psword );

        const user = new User( req.body );
        const response = await user.login();

        if( response.success )
        {
            console.log( response.accountInfo );
            const jwtToken = await token.sign( response.accountInfo );
            
            const cookieOption = {
                httpOnly: true,
                maxAge : 1000 * 60 * 60,
                secure : false,
                // 1 more
            }

            res.cookie( 'token', jwtToken.token, cookieOption );
// todo user_id를 가져온다;;;
            Quest.getInstance().processLogin( response.accountInfo.user_id );

            return res.json( { success:true, token: jwtToken.token });

        }
        return res.json(response)},
    
    guestRegister : async( req:CustomRequest, res:Response) => {
        console.log( "process.guestRegister" );
        const user = new User( req.body );
        let response;
        try{
            response = await user.guestRegister();
            console.log( response );
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)
    },
    guestLogin : async( req:CustomRequest, res:Response ) => {
        console.log( "process.guestLogin" );

        const user = new User( req.body );

        console.log( req.body.guestId );
        const response = await user.guestLogin( req.body.guestId );

        if( response.success )
        {
            console.log( response.accountInfo );
            const jwtToken = await token.sign( response.accountInfo );
            
            const cookieOption = {
                httpOnly: true,
                maxAge : 1000 * 60 * 60,
                secure : false,
                // 1 more
            }

            res.cookie( 'token', jwtToken.token, cookieOption );
// todo user_id를 가져온다;;;
            Quest.getInstance().processLogin( response.accountInfo.user_id );

            return res.json( { success:true, token: jwtToken.token });

        }
        return res.json(response)
    },
    register: async( req:CustomRequest, res:Response) => {
        console.log( "process.register" );
        const user = new User( req.body );
        let response;
        try{
            response = await user.register();
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)},
    startsinglegame : async( req:CustomRequest, res:Response)=>{
            console.log( "process.startsinglegame : ", req.userId );
            const response = await UserStorage.getInstance().startSingleGame( req.userId??0 );
            // todo : session -> jwt 로 세션에 저장하던 임시 정보를 별도로 처리 필요
            // req.session.isStartSingleGame = true;
            return res.json(response);
        },
    endsinglegame : async(req:CustomRequest,res:Response)=>{
        console.log( 'delete endsinglegame : ', req.userId );

        let response = { success:false};
        
        // console.log(req.isStartSingleGame);

        // if( req.session.isStartSingleGame ){
            response = await UserStorage.getInstance().addUserMoney( req.userId??0, 100 );
            // req.session.isStartSingGame = false;
        // }
        return res.json( response );
    },
    logout : (req:CustomRequest, res:Response) =>{
        console.log("output.logout");

        res.clearCookie('token');

        return res.json( {success:true});
    },
    getuserinfo : async ( req:CustomRequest,res:Response ) =>{
        console.log("get process.home userId:", req.userId);

        const userInfo = await UserStorage.getInstance().getUserInfo( req.userId??0 );

        if( userInfo ){
            return res.json( {success:true, 
                userName: userInfo.name,
                userMoney : userInfo.money,
                battleCoin : userInfo.battle_coin,
                diamond : userInfo.diamond,
                exp : userInfo.exp,
            });

        }else{
            return res.json( {success:false, msg:"not found user"})
        }
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
    googleLogin : async ( req:CustomRequest, res:Response )=>{
        console.log("googleLogin")
        // res.redirect(OAUTH_URL);
        return res.json({ success:true, url: OAUTH_URL });
    },
    googleRedirect : async ( req:CustomRequest, res:Response )=>{
        console.log("googleRedirect")

        const query = url.parse( req.url, true ).query;
        if( query && query.code ){
            const userInfo = await oauth2Api( query.code);
            console.log( userInfo );

            if( userInfo == undefined ){
                return;
            }

            let accountInfo = await UserStorage.getInstance().getAccountInfo( userInfo.id );

            //1. userInfo로 DB에 user를 찾아보고 없다면 새로 생성
            console.log( accountInfo );
            if( accountInfo )
            {
                console.log("login account by google id ")
            }
            else
            {
                console.log("create new account by google id ")
                const password = "";
                const salt = "";
        
                const result = await UserStorage.getInstance().save( userInfo, password, salt );

                console.log( result );

                if( result.success ){
                    Quest.getInstance().createUserQuestAll( result.userId );

                    accountInfo = await UserStorage.getInstance().getAccountInfo( userInfo.id );
                }
            }
            //2. token을 새로 만들어서 클라이언트에게 알려줌..
            if( accountInfo )
            {
                console.log( accountInfo );
                const jwtToken = await token.sign( accountInfo );
                
                const cookieOption = {
                    httpOnly: true,
                    maxAge : 1000 * 60 * 60,
                    secure : false,
                    // 1 more
                }
    
                //? 이게 되네;?
                res.cookie( 'token', jwtToken.token, cookieOption );

                Quest.getInstance().processLogin( accountInfo.user_id );
    
                //3. res.redirect에 token을 넣어서 보내준다.
                res.redirect("/");
            }
        }


    }

}