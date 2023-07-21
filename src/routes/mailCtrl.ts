import { Request, Response } from 'express';

import { Mail } from '../services/mail.js'
import { CustomRequest } from '../customType/express.js';

export const mail = {
    // 전체 메일 리스트 
    getMailList : async ( req:CustomRequest,res:Response )=>{

        const response = await Mail.getInstance().getMailList( req.userId??0 );
        return res.json( response );
    },


    // TODO : 아이템 첨부 추가
    sendMail : async ( req:CustomRequest,res:Response )=>{

        console.log( req.body.receiver_user_name );
        console.log( req.body.title );
        console.log( req.body.msg );
        console.log( req.body.gold );
        const response = await Mail.getInstance().sendMailFromUser( req.userId??0, req.body.receiver_user_name, req.body.title, req.body.msg, parseInt(req.body.gold) );
        return res.json( response );
    },

    readMail : async ( req:CustomRequest,res:Response )=>{
        const response = await Mail.getInstance().readMail( req.userId??0, req.body.mailId );
        return res.json( response );
    },
    deleteMail : async ( req:CustomRequest,res:Response )=>{
        const response = await Mail.getInstance().deleteMail( req.userId??0, req.body.mailId );
        return res.json( response );
    },

    getAttachedItemAll : async ( req:CustomRequest,res:Response )=>{
        const response = await Mail.getInstance().getAttachedItemAll( req.userId??0, req.body.mailId );
        return res.json( response );
    },
}