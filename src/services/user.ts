"use strict"

import crypto from "crypto";
import { v4 } from 'uuid';

import { UserStorage } from "../models/userstorage.js";
import { Quest } from "./quest.js";




const createSalt = () => 
    new Promise(( resolve, reject) =>{
        crypto.randomBytes(64, (err,buf) => {
            if( err ) reject (err);
            resolve( buf.toString('base64'));
        });
    });


const createHashedPassword = ( plainPassword:string) =>
    new Promise( async(resolve, reject)=>{
        const salt:any = await createSalt();
        crypto.pbkdf2( plainPassword, salt, 2, 64, 'sha512', (err,key)=>{
            if ( err) reject (err);
            resolve( {password:key.toString('base64'), salt });
        });
    });

const makePasswordHashed = ( salt:any, plainPassword:string ) =>
    new Promise( async ( resolve, reject ) => {
        crypto.pbkdf2( plainPassword, salt, 2, 64, 'sha512' , ( err, key )=>{
            if( err ) reject ( err );
            resolve( key.toString('base64'));
        });
    });

export const User = {

    guestRegister : async () => {
        console.log( "User.guestRegister");

        const id = v4();
        const name = "guest";
        const password = "";
        const salt = "";

        const result:any = await UserStorage.getInstance().save( id, name , password, salt );

        console.log( result );
        if( result.success ){
            result.guestId = id;
        }
        return result;
    },
    login : async (id : string, pwd:string ) => {
        // const body = this.body;
    
        const accountInfo = await UserStorage.getInstance().getAccountInfo( id );
        // console.log( accountInfo );
    
        if( accountInfo) {
            const hashedPwd = await makePasswordHashed( accountInfo.salt, pwd );
            if( accountInfo.id === id && accountInfo.psword === hashedPwd){
    
                return { success : true, accountInfo : accountInfo };
            }
            return { success : false , msg : " 비밀번호가 틀렸습니다."}
        }
        return { success : false, msg : "존재하지 않는 아이디 입니다"}
    },       

    register : async (id:string, name:string, pwd:string) => {
        console.log( "User.register");
    
        const { password, salt } : any= await createHashedPassword( pwd );
        // console.log( password );
        // console.log( client );
        const result = await UserStorage.getInstance().save( id, name, password, salt );
    
        console.log( result );
        return result;
    },
   
    guestLogin : async( guestId:string ) => {
    
        const accountInfo = await UserStorage.getInstance().getAccountInfo( guestId );
        // console.log( accountInfo );
    
        if( accountInfo){
            return { success : true, accountInfo : accountInfo };
        }
    
        return { success : false, msg : "존재하지 않는 아이디 입니다"}
    }
}

