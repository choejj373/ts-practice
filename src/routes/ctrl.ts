"use strict";

import url from 'url';

import { Request, Response } from 'express';
import { CustomRequest } from '../customType/express.d';

import { token  } from '../modules/jwt.js';
import { User } from "../services/user.js";
import { UserStorage } from "../models/userstorage.js";
// import UserStorageCache from "../models/userstoragecache.js";
import { Quest } from "../services/quest.js";
import { PublicKey, getValueDecodedByPrivateKey } from "../modules/secret.js";
import { oauth2Api , OAUTH_URL } from "../modules/google-login.js"

import { generateRandomString, isNameDuplicated } from "../util/string-util.js"


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
    // getSymmetricKey : ( req:Request, res:Response ) => {
    //     const key = Secret.getInstance().getSymmetricKeyEncodedByPrivateKey();
    //     return res.json( { success:true, symmeticKey: `${key}` } );
    // },
    getPublicKey : ( req:Request, res:Response ) => {
         return res.json( { success:true, publicKey: `${PublicKey}` } );
    },
    changeNickName : async ( req:CustomRequest, res:Response ) => {
        let response = await User.changeNickName( req.userId ?? 0, req.body.nickname );
        console.log( response );
        return res.json( response );
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
        
        req.body.id = getValueDecodedByPrivateKey( req.body.id );
        req.body.psword = getValueDecodedByPrivateKey( req.body.psword );

        //const user = new User( req.body );
        const response = await User.login( req.body.id, req.body.psword );

        if( response.success )
        {
            // console.log( response.accountInfo );
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
        let response;
        try{
            response = await User.guestRegister();
            console.log( response );
            if( response.success ){
                Quest.getInstance().createUserQuestAll( response.userId );
            }
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)
    },
    guestLogin : async( req:CustomRequest, res:Response ) => {
        console.log( "process.guestLogin" );

        const response = await User.guestLogin( req.body.guestId );

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
        let response;
        try{
            response = await User.register( req.body.id, req.body.name, req.body.psword );

            if( response.success){
                Quest.getInstance().createUserQuestAll( response.userId );
            }
    
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)},
    startsinglegame : async( req:CustomRequest, res:Response)=>{
            console.log( "process.startsinglegame : ", req.userId );
            const response = await UserStorage.getInstance().startSingleGame( req.userId??0 );
            // todo : session -> jwt 로 세션에 저장하던 임시 정보를 별도로 처리 필요 => redis
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
        

                let result = await UserStorage.getInstance().save( userInfo.id, userInfo.name, password, salt );
                let name:string;
                // nickname 중복 실패면 랜덤 문자열을 붙혀서 다시 시도
                // 현재(2023,7,17) nickname의 최대 길이는 30자, 구글의 이름 최대 길이가 28이 넘으면 
                // 무한 루프 위험
                while( result.success === false && isNameDuplicated( result.msg ))
                {
                    if( userInfo.name.length < 25 )
                    {
                        break;
                    }

                    name = userInfo.name + "#" + generateRandomString(30 - (userInfo.name.length + 1));
                    result = await UserStorage.getInstance().save( userInfo.id, name, password, salt );
                }

                console.log( result );

                if( result.success ){
                    Quest.getInstance().createUserQuestAll( result.userId );

                    accountInfo = await UserStorage.getInstance().getAccountInfo( userInfo.id );
                }
            }
            //2. token을 새로 만들어서 클라이언트에게 알려줌..
            if( accountInfo )
            {
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
    
                //3. res.redirect
                res.redirect("/");
            }
        }


    }

}