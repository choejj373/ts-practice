
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../customType/express.d';

import { token } from '../modules/jwt.js';


const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;


const authUtil = {
    checkToken : async ( req:CustomRequest, res:Response, next:NextFunction )=>{
        let accessToken = req.cookies.token;
        if( !token ){
            // return res.json( util.fail( CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
            console.log("not found token")
        //    return res.status(401).statusMessage = "token not found";
          return res.status(401).json( {success:false, msg:"token not found"} )
        }

        const user : any = await token.verify( accessToken );

        if( user == TOKEN_EXPIRED ){
            // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN));
            console.log("token expired")
            return res.status(401).json( {success:false, msg:"token expired"})
        }
     
        if( user == TOKEN_INVALID){
            // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            console.log("token invalid")
            // return res.status(401).send("token invalid");
            return res.status(401).json( {success:false, msg:"token invalid"})
        }

        if( user.userId === undefined ){
             // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.INVALID_TOKEN ));
             console.log("token payload invalid")
             return res.status(401).json( {success:false, msg:"token payload invalid"})
        }
            
        req.userId = user.userId;
        
        next();
    }
}

export default authUtil;