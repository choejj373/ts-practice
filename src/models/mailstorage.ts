import { GetConnection, ReleaseConnection, Format } from "../config/db.js";
import { SendMailItem } from "../services/mail.js"


interface MailItem{
    id:number,          //mail_item.id
    item_id:number,     //user_item.id
    item_index:number   //item_list.id
}

export const MailStorage = {

    getMailList: async (userId:number)=>{
        const conn = await GetConnection();
        let retVal = { success:false, mails:{} };

        try{
            const [rows]:any = await conn.query("SELECT * FROM mail WHERE receiver_user_id=?;",[userId] );
            console.log( rows );

            retVal.success = true;
            retVal.mails = rows;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    readMail : async ( userId:number, mailId:number)=>{
        const conn = await GetConnection();
        let retVal = { success:false, mailId: mailId, msg:"" };

        try{
            const [result]:any = await conn.query("UPDATE mail SET checked = 1 WHERE id = ? AND receiver_user_id=?;",
                            [mailId, userId] );

            console.log( result );
            if( result.affectedRows > 0 ){
                retVal.success = true;
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    deleteMail : async ( userId:number, mailId:number)=>{
        const conn = await GetConnection();
        let retVal = { success:false, mailId: mailId, msg:"" };

        try{
            let [result]:any = await conn.query("DELETE FROM mail WHERE id = ? AND receiver_user_id=?;",
                            [mailId, userId] );

            console.log( result );
            if( result.affectedRows > 0 ){
                retVal.success = true;
                [result] = await conn.query("DELETE FROM mail_item WHERE mail_id=?;",[mailId]);
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    sendMailFromUser : async(userId:number, receiverUserName:string, title:string , msg:string, gold:number )=>{
        const conn = await GetConnection();
        let retVal = { success:false, msg:"" };
        try{

            await conn.beginTransaction();

            let query = "INSERT INTO mail(sender_user_id, gold, msg, title, receiver_user_id, type) (SELECT ?,?,?,?,id, 3 FROM user WHERE name =?);";
            let [result]:any = await conn.query( query, [userId, gold, msg, title, receiverUserName] );

            if( result.affectedRows == 0 ){
                retVal.msg = query;
                throw query;
            }

            if( gold > 0 ){
                query = "UPDATE user SET money = money - ? WHERE id=? AND money>=?;";
                [result] = await conn.query( query, [ gold, userId, gold] );

                if( result.affectedRows == 0 ){
                    retVal.msg = query;
                    throw query;
                }
            }
            retVal.success = true;
            await conn.commit();

        }catch( err:any ){
            await conn.rollback();
            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;
    },
    sendMailFromSystem : async( title:string, msg:string, gold:number, receiverUserName:string,items:SendMailItem[])=>{
        const conn = await GetConnection();
        let retVal = { success:false, msg:"" };
        try{

            await conn.beginTransaction();

            let query = "INSERT INTO mail(sender_user_id, gold, title, msg, receiver_user_id, type) (SELECT 0,?,?,?,id,2 FROM user WHERE name =?);";
            let [result]:any = await conn.query( query, [ gold, title, msg, receiverUserName] );

            console.log( result );
            const mailId = result.insertId;

            if( result.affectedRows == 0 ){
                retVal.msg = query;
                throw query;
            }

            for( const item of items){
                query = "INSERT INTO mail_item(mail_id, item_id, item_index, owner) VALUES ( ?, 0, ?, 0 );";
                [result] = await conn.query( query, [ mailId, item.index] );

                console.log( result );
                if( result.affectedRows == 0 ){
                    retVal.msg = query;
                    throw query;
                }
            }
            await conn.commit();
            
        }catch( err:any ){
            await conn.rollback();
            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;
    },
    //서비스 단에서 골드 및 아이템 가져와서 detach를 시켜주자
    getAllAttachedItem : async( userId:number, mailId:number )=>{
        
        console.log( userId);
        console.log( mailId);

        const conn = await GetConnection();

        const retVal = { success:false, gold:0, mailItems:[] }
        try{

            let [rows]:any = await conn.query("SELECT gold FROM mail WHERE id = ? AND receiver_user_id =?;",
                            [ mailId, userId] );

            console.log( rows );

            if( Array.isArray( rows ) && rows.length > 0 ){
                retVal.success = true;
                retVal.gold = rows[0].gold;
            }else{
                throw "not found mail";
            }

            [rows] = await conn.query("SELECT * FROM mail_item WHERE mail_id = ?;",
                            [ mailId] );

            console.log( rows );

            //// 제대로 변환이 되었는지 체크 필요
            retVal.mailItems = rows;
            
        }catch( err:any ){
            retVal.success = false;
            console.log( err );
        }finally{
            ReleaseConnection( conn );
        }   
        return retVal;
    },

    detachAllAttachedItem : async( userId:number, mailId:number, gold:number, mailItems:MailItem[] )=>{
        const conn = await GetConnection();
        
        let retVal = { success:false, msg:"" };

        try{

            await conn.beginTransaction();

            let query = "UPDATE mail SET gold = 0 WHERE id=? AND receiver_user_id = ? AND gold=?;";
            let [result]:any = await conn.query( query, [ mailId, userId, gold] );

            console.log( result );
            if( result.affectedRows == 0 ){
                retVal.msg = query;
                throw query;
            }

            query = "UPDATE user SET money = money + ? WHERE id=?;";
            [result] = await conn.query( query, [ gold, userId] );

            console.log( result );
            if( result.affectedRows == 0 ){
                retVal.msg = query;
                throw query;
            }

            for( const mailItem of mailItems){
                query = "DELETE FROM mail_item WHERE id=? AND mail_id=?;";
                [result] = await conn.query( query,[ mailItem.id, mailId] );

                console.log( result );
                if( result.affectedRows == 0 ){
                    retVal.msg = query;
                    throw query;
                }

                if( mailItem.item_id === 0){
                    query = "INSERT INTO user_item ( item_id, owner ) VALUES ( ?, ? );";
                    [result] = await conn.query( query,[ mailItem.item_index, userId] );
                }else{
                    query = "INSERT INTO usr_item( id, item_id, owner ) VALUES ( ?,?,?)";
                    [result] = await conn.query( query,[ mailItem.item_id, mailItem.item_index, userId] );
                }

                console.log( result );
                if( result.affectedRows == 0 ){
                    retVal.msg = query;
                    throw query;
                }
            }
            retVal.success = true;
            await conn.commit();
            
        }catch( err:any ){
            await conn.rollback();
            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;
    }
}
