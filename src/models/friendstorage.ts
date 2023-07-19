import { GetConnection, ReleaseConnection, Format } from "../config/db.js";

export const FriendStorage ={
    getFriendList :async ( userId:number)=>{
        const conn = await GetConnection();

        let retVal = { success: false, friends:[] };

        try{
            const [row] : any = await conn.query("SELECT f.friend_user_id, u.name as friend_user_name FROM user_friend f INNER JOIN user u ON f.friend_user_id = u.id WHERE f.owner = ?;", 
                    [userId] );

            retVal.success = true;
            retVal.friends = row;

            console.log( row );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;        
    }, 
    deleteFriend : async ( userId:number, name:string)=>{
        const conn = await GetConnection();

        let retVal = { success:false, msg:name };

        try{
            const result : any = await conn.query("DELETE FROM user_friend WHERE owner = ? AND friend_user_id = ( SELECT id FROM user WHERE name=? );", 
                    [userId, name] );

            retVal.success = true;
            console.log( result );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;        
    },
    getFriendRequestedList:async ( userId:number)=>{
        const conn = await GetConnection();

        let retVal = { success: false, requests:[] };

        try{
            const [row] : any = await conn.query("SELECT u.name FROM friend_request f INNER JOIN user u ON f.request_user_id = u.id WHERE f.requested_user_id = ?;", 
                    [userId] );

            retVal.success = true;
            retVal.requests = row;

            console.log( row );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;        
    }, 
    getFriendRequestList:async ( userId:number)=>{
        const conn = await GetConnection();

        let retVal = { success: false, requests:[] };

        try{
            const [row] : any = await conn.query("SELECT u.name FROM friend_request f INNER JOIN user u ON f.requested_user_id = u.id WHERE f.request_user_id = ?;", 
                    [userId] );

            retVal.success = true;
            retVal.requests = row;

            console.log( row );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;        
    }, 
       
    requestFriend:async ( userId:number, name:string)=>{
        const conn = await GetConnection();

        let retVal = { success:false, msg:name };

        try{
            const result : any = await conn.query("INSERT INTO friend_request(request_user_id, requested_user_id ) ( SELECT ?, id FROM user WHERE name = ? AND id != ?);", 
                    [userId, name, userId] );

            retVal.success = true;
            console.log( result );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;   
    },

    acceptFriendRequest:async ( userId:number, name:string)=>{
        const conn = await GetConnection();

        let retVal = { success:false, msg:name };

        try{
            const sql1 = "INSERT INTO user_friend( owner, friend_user_id ) ( SELECT ?, id FROM user WHERE name=?);";
            const sql1a = [ userId, name ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "INSERT INTO user_friend(owner, friend_user_id )( SELECT id, ? FROM user WHERE name=?);";
            const sql2a = [ userId, name ];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            const sql3 = "DELETE FROM friend_request WHERE requested_user_id = ? AND request_user_id = ( SELECT id FROM user WHERE name=?);";
            const sql3a = [userId,name];
            const sql3s = Format( sql3, sql3a );
            console.log( sql3 );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s + sql3s);

            console.log( result );

            //check 3차원 배열?????
            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 && result[0][2].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                retVal = {success:false, msg:""};
                console.log( "rollback");                            
                await conn.rollback();
            }

        }catch( err:any ){
            console.log( err );
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};
        }finally{
            await ReleaseConnection( conn );;
        }        

        // INSERT 2 개( 내 친구 목록과 요청한 사람의 친구 목록에 등록)
        // try{
        //     const result : any = await conn.query("INSERT INTO friend_request(request_user_id, requested_user_id ) ( SELECT ?, id FROM user WHERE name = ? );", 
        //             [userId, name] );

        //     retVal.success = true;
        //     console.log( result );
        // }catch(err)
        // {
        //     console.log(err);
        // }finally{
        //     ReleaseConnection( conn );
        // }
        return retVal;   
    },

    refuseFriendRequest:async ( userId:number, name:string)=>{
        const conn = await GetConnection();

        let retVal = { success:false, msg:name };

        try{
            const result : any = await conn.query("DELETE FROM friend_request WHERE requested_user_id = ? AND request_user_id = ( SELECT id FROM user WHERE name = ? );", 
                    [userId, name] );

            retVal.success = true;
            console.log( result );
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;   
    },
}


