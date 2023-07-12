import randToken from 'rand-token';
import jwt from 'jsonwebtoken';
import { secretKey, options } from '../config/secretkey.js'


const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

export const token = {
    sign: async (accountInfo:any) =>{
        const payload  = {
            userId : accountInfo.user_id,
            accountId : accountInfo.id,
        };
        const result = {
            token: jwt.sign( payload, secretKey, options),
            refreshToken: randToken.uid(256)
        }
        return result;
    },
    verify:async( token:any) => {
        let decoded;
        try {
            decoded = jwt.verify( token, secretKey );
        }catch( err:any ){
            if( err.message === 'jwt expired' ){
                console.log('expired token');
                return TOKEN_EXPIRED;
            }else if( err.message === 'invalid token'){
                console.log('invalid token');
                console.log( TOKEN_INVALID);
                return TOKEN_INVALID;
            }else{
                console.log('invalide token');
                return TOKEN_INVALID
            }
        }
        return decoded;
    }
}