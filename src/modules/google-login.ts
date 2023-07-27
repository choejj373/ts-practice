
import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

import config from '../config/index.js'

const CLIENT_ID = config.google.id;
const CLIENT_SECRET = config.google.secret;

const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URL = "http://localhost:3000/auth/google/callback";

const RESPONSE_TYPE = "code";
const SCOPE = "openid%20profile%20email";

const ACCESS_TYPE = "offline";

export const OAUTH_URL = `${AUTHORIZE_URI}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URL}&scope=${SCOPE}&access_type=${ACCESS_TYPE}`;


const getToken = async ( code:any ) => {
    try{
        const tokenApi = await axios.post(
            `https://oauth2.googleapis.com/token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&grant_type=authorization_code`
        );

        const accessToken = tokenApi.data.access_token;
        return accessToken;
    }catch(err){
        console.log( err );
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
        console.log( err );
        return err;
    }
}

export const oauth2Api = async(code:any)=>{

    const accessToken = await getToken(code);

    const userInfo : any = await getUserInfo(accessToken) ;
    
    return userInfo.data;
}
