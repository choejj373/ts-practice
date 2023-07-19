import { GetConnection, ReleaseConnection, Format } from "../config/db.js";

export const GuildStorage = {

    isGuildMember: async (userId:number)=>{
        const conn = await GetConnection();
        let retVal = false;

        try{
            const [row]:any = await conn.query("SELECT guild_id FROM user WHERE id=?;",[userId] );
            console.log( row );
            if( Array.isArray(row) && row.length > 0 ){
                if( row[0].guild_id !== 0 )
                {
                    console.log( row[0].guild_id );
                    retVal = true;
                }
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    isGuildMemberByName: async (userName:string)=>{
        const conn = await GetConnection();
        let retVal = { result:false, userId:0, guildId:0 };

        try{
            const [row]:any = await conn.query("SELECT guild_id, id FROM user WHERE name=?;",[userName] );

            console.log( row );
            console.log(Array.isArray(row));
            console.log( row.length);

            if( Array.isArray(row) && row.length > 0 ){
                if( row[0].guild_id !== 0 )
                {
                    console.log( row[0] );
                    retVal.result   = true;
                    retVal.guildId  = row[0].guild_id; 
                }
                retVal.userId   = row[0].id;                
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    deleteAllInviteNRequestJoin : async (userId:number)=>{
        const conn = await GetConnection();
        try{
            const sql1 = "DELETE FROM guild_invite WHERE invited_user_id = ?;";
            const sql1a = [ userId ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "DELETE FROM guild_request WHERE request_user_id = ?;";
            const sql2a = [ userId ];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            const result:any = await conn.query( sql1s + sql2s);

        }catch( err:any ){
            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }               
    },
    getGuildList : async ()=>{
        const conn = await GetConnection();
        let retVal = { success: false, guilds:[] };

        try{
            const [row]:any = await conn.query("SELECT * FROM guild;" );
            retVal.success = true;
            retVal.guilds = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    // 0. LAST_INSERT_ID() 두번 호출해도 같은 값일까?
    // 1. 이름 중복, 소모 재화 보유 체크
    // 2. insert into guild( name ) values( name );
    // 3. update from user set guild_id = LAST_INSERT_ID(), grade = 1, money = money - price where id=userId and money >= price and guild_id = 0; 
    // 4. insert into guild_member ( guild_id, grade, user_id ) values ( LAST_INSERT_ID(), 1, userId );


    // TODO 이전 guild_invite, guild_request 모두 삭제
    createGuild : async( userId:number, name:string, price:number) => {
        const conn = await GetConnection();
        let retVal = { success:true, msg:""};
        try{
            const sql1 = "INSERT INTO guild( name ) values (?);";
            const sql1a = [ name ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "UPDATE user SET guild_id = LAST_INSERT_ID(), money = money - ? WHERE id=? AND money >= ? AND guild_id = 0;";
            const sql2a = [ price, userId, price ];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            const sql3 = "INSERT INTO guild_member ( guild_id, grade, user_id ) VALUES ( LAST_INSERT_ID(), 1, ? );";
            const sql3a = [userId];
            const sql3s = Format( sql3, sql3a );
            console.log( sql3s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s + sql3s);

            // console.log( result );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 && result[0][2].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                retVal = {success:false, msg:""};
                console.log( "rollback");                            
                await conn.rollback();

                if( result[0][0].affectedRows === 0 ){
                    retVal.msg = sql1s;
                }
                if( result[0][1].affectedRows === 0 ){
                    retVal.msg = sql2s;
                }
                if( result[0][2].affectedRows === 0 ){

                    retVal.msg = sql3s;
                }
                console.log( retVal );                
            }

        }catch( err:any ){
            console.log( err );
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};
        }finally{
            ReleaseConnection( conn );;
        }                
        return retVal;
    },
    // TODO : 권한 체크, 멤버수 체크 등 추가 작업 필요
    deleteGuild : async( userId:number, guildId:number) => {
        const conn = await GetConnection();
        let retVal = { success:true, msg:""};
        try{
            const sql1 = "DELETE FROM guild WHERE id = ?;";
            const sql1a = [ guildId ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "UPDATE user SET guild_id = 0 WHERE id=? AND guild_id = ?;";
            const sql2a = [ userId, guildId ];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            const sql3 = "DELETE FROM guild_member WHERE guild_id = ?;";
            const sql3a = [guildId];
            const sql3s = Format( sql3, sql3a );
            console.log( sql3s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s + sql3s);

            // console.log( result );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 && result[0][2].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true, msg:""};
            }else{
                retVal = {success:false, msg:""};
                console.log( "rollback");                            
                await conn.rollback();

                if( result[0][0].affectedRows === 0 ){
                    retVal.msg = sql1s;
                }
                if( result[0][1].affectedRows === 0 ){
                    retVal.msg = sql2s;
                }
                if( result[0][2].affectedRows === 0 ){
                    retVal.msg = sql3s;
                }
                console.log( retVal );                
            }

        }catch( err:any ){
            console.log( err );
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};
        }finally{
            ReleaseConnection( conn );;
        }                
        return retVal;
    },
    getGuildMemberList : async ( userId : number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, members:[], msg:"" };

        try{
            const [row]:any = await conn.query("SELECT g.id, u.name, g.point FROM guild_member g INNER JOIN user u ON g.user_id = u.id WHERE g.guild_id = (SELECT guild_id FROM user WHERE id=?);", [userId] );
            console.log( row );
            retVal.success = true;
            retVal.members = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    getMyGuildInfo : async ( userId : number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, id:0, name:"", point:0, msg:"" };

        try{
            const [row]:any = await conn.query("SELECT id, name, point FROM guild WHERE id = (SELECT guild_id FROM user WHERE id=?);", [userId] );
            console.log( row );
            if( Array.isArray(row) && row.length > 0 )
            {
                retVal.success = true;
                console.log( row[0] );
                retVal.id = row[0].id;
                retVal.name = row[0].name;
                retVal.point = row[0].point;
            }
            else{
                retVal.msg = "not found guild"
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    getGuildInfo : async ( guildName : string) =>{
        const conn = await GetConnection();
        let retVal = { success: false, name:"", point:0 };

        try{
            const row:any = await conn.query("SELECT name, point FROM guild WHERE name=?);", [guildName] );
            if( Array.isArray(row) && row.length > 0 )
            {
                retVal.success = true;
                retVal.name = row[0].name;
                retVal.point = row[0].point;
            }
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },    

    // 자기 자신 삭제 체크/같은 길드인지 체크/권한 체크
    deportGuildMember : async ( userId : number, memberId : number) => {
        const conn = await GetConnection();
        let retVal = { success: false, msg:"", memberId:memberId };

        try{
            const [result]:any = await conn.query("DELETE FROM guild_member WHERE id = ? AND user_id != ? AND guild_id = ( SELECT temp.guild_id FROM ( select guild_id from guild_member WHERE user_id = ? AND grade = 1) temp );",
                            [memberId, userId, userId] );
            
            console.log( result );
            if( Array.isArray( result ) && result.length > 0 ){
                if( result[0].affectedRows === 0 ){                            
                    retVal.success = true;
                }
            }

        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    // 등급이 마스터일 경우는 탈퇴 금지( 마스터를 넘기고 탈퇴하거나 길드 삭제만 가능)
    leaveGuildMember : async ( userId : number ) => {
        const conn = await GetConnection();
        let retVal = { success: false, msg:"" };

        try{
            const sql1 = "DELETE FROM guild_member WHERE user_id = ? AND grade != 1;";
            const sql1a = [ userId ];
            const sql1s = Format( sql1, sql1a);
            console.log( sql1s );

            const sql2 = "UPDATE user SET guild_id = 0 WHERE id=?;";
            const sql2a = [ userId ];
            const sql2s = Format( sql2, sql2a );
            console.log( sql2s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                await conn.commit();
                retVal = {success:true, msg:""};

                console.log( "commit");
                
            }else{
                await conn.rollback();

                retVal = {success:false, msg:""};
                console.log( "rollback");                            

                if( result[0][0].affectedRows === 0 ){
                    retVal.msg = sql1s;
                }
                if( result[0][1].affectedRows === 0 ){
                    retVal.msg = sql2s;
                }

                console.log( retVal );                
            }

        }catch( err:any ){
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};

            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;
    },
    getGuidJoinRequestList : async (userId:number)=>{
        const conn = await GetConnection();
        let retVal = { success: false, requests:[],msg:"" };

        try{
            const [row]:any = await conn.query("SELECT g.*, u.name FROM guild_request g INNER JOIN user u ON g.request_user_id = u.id;" );
            retVal.success = true;
            retVal.requests = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    //길드 가입중에는 다른 길드에 요청을 보낼수 없다.
    // user.guild_id 체크
    // guild_member.user_id 체크
    requestGuildJoin : async ( userId:number, guildName:string )=>{
        const conn = await GetConnection();
        let retVal = { success: false };

        try{
            const [row]:any = await conn.query("INSERT INTO guild_request( guild_id, request_user_id ) ( SELECT id,? FROM guild WHERE name=?);",[userId, guildName] );
            retVal.success = true;
            
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },

    inviteGuildJoin : async ( userId:number, invitedUserId:number ) =>{
        const conn = await GetConnection();
        let retVal = { success: false };

        try{
            const [result]:any = await conn.query("INSERT INTO guild_invite( guild_id, invite_user_id, invited_user_id ) ( SELECT guild_id,?,? FROM user WHERE id=? AND guild_id != 0);",
                    [userId, invitedUserId, userId] );

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

    getGuildJoinInviteList : async ( userId:number ) =>{
        const conn = await GetConnection();
        let retVal = { success: false, invites:[],msg:"" };

        try{
            const [row]:any = await conn.query("SELECT gi.*, g.name FROM guild_invite gi INNER JOIN guild g ON gi.guild_id = g.id WHERE gi.invited_user_id = ?;",
                [userId] );

            retVal.success = true;
            retVal.invites = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            ReleaseConnection( conn );
        }
        return retVal;
    },
    acceptGuildJoinInvite : async ( userId:number ,inviteId:number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, msg:"" };

        try{

            const sql1 = "INSERT INTO guild_member(guild_id, user_id, grade ) ( SELECT guild_id, invited_user_id, ? FROM guild_invite WHERE id = ?);";
            const sql1a = [10, inviteId];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2 = "UPDATE user SET guild_id = ( SELECT guild_id FROM guild_invite WHERE id = ?) WHERE id = ?;";
            const sql2a = [inviteId, userId] ;
            const sql2s = Format( sql2, sql2a);
            console.log( sql2s );

            const sql3 = "DELETE FROM guild_invite WHERE id=? AND invited_user_id=?;";
            const sql3a = [inviteId, userId] ;
            const sql3s = Format( sql3, sql3a);
            console.log( sql3s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s + sql3s);

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                await conn.commit();
                retVal = {success:true, msg:""};

                console.log( "commit");
                
            }else{
                await conn.rollback();

                retVal = {success:false, msg:""};
                console.log( "rollback");                            

                if( result[0][0].affectedRows === 0 ){
                    retVal.msg = sql1s;
                }
                if( result[0][1].affectedRows === 0 ){
                    retVal.msg = sql2s;
                }

                console.log( retVal );                
            }

        }catch( err:any ){
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};

            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;    
    },
    refuseGuildJoinInvite : async ( userId:number ,inviteId:number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, msg:"" };

        try{
            const [result]:any = await conn.query("DELETE FROM guild_invite WHERE id=? AND invited_user_id=?;",
                [inviteId, userId] );

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
    acceptGuildJoinRequest : async ( userId:number ,requestId:number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, msg:"" };

        try{

            const sql1 = "INSERT INTO guild_member(guild_id, user_id, grade ) ( SELECT guild_id, request_user_id, ? FROM guild_request WHERE id = ?);";
            const sql1a = [10, requestId];
            const sql1s = Format( sql1, sql1a );
            console.log( sql1s );

            const sql2 = "UPDATE user u INNER JOIN guild_request gr SET u.id = gr.request_user_id WHERE gr.id = ?;";
//            const sql2 = "UPDATE user SET guild_id = ( SELECT guild_id FROM guild_request WHERE id = ?) WHERE id = ( SELECT request_user_id FROM guild_request WHERE id = ?);";
            const sql2a = [requestId] ;
            const sql2s = Format( sql2, sql2a);
            console.log( sql2s );

            const sql3 = "DELETE FROM guild_request WHERE id = ? AND guild_id = ( SELECT guild_id FROM guild_member WHERE user_id = ? AND grade < 5 );";
            const sql3a = [requestId, userId] ;
            const sql3s = Format( sql3, sql3a);
            console.log( sql3s );

            await conn.beginTransaction();

            const result:any = await conn.query( sql1s + sql2s + sql3s);

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                await conn.commit();
                retVal = {success:true, msg:""};

                console.log( "commit");
                
            }else{
                await conn.rollback();

                retVal = {success:false, msg:""};
                console.log( "rollback");                            

                if( result[0][0].affectedRows === 0 ){
                    retVal.msg = sql1s;
                }
                if( result[0][1].affectedRows === 0 ){
                    retVal.msg = sql2s;
                }

                console.log( retVal );                
            }

        }catch( err:any ){
            await conn.rollback();
            retVal = {success:false,msg:err.sqlMessage};

            console.log( err );
        }finally{
            ReleaseConnection( conn );;
        }   
        return retVal;       
    },    
    refuseGuildJoinRequest : async ( userId:number ,requestId:number) =>{
        const conn = await GetConnection();
        let retVal = { success: false, msg:"" };

        try{
            const [result]:any = await conn.query("DELETE FROM guild_request WHERE id = ? AND guild_id = ( SELECT guild_id FROM guild_member WHERE user_id = ? AND grade < 5 );",
                [requestId, userId] );

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

}
