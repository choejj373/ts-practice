import { GuildStorage } from '../models/guildstorage.js';



// grade : 1 - master, 4 : 관리자, 10 : 신규 가입 멤버
//
export class Guild {
    private static _instance:Guild;

    private constructor(){
    }
    public static getInstance():Guild
    {
        if( this._instance == null )
            this._instance  = new Guild();

        return this._instance;
    }

    public async getGuildList(){
        const response = await GuildStorage.getGuildList();
        return response;
    }

    // 길드 생성에 성공하면 길드 가입 요청 목록과 초청 목록을 지워준다.
    // 가입 요청 & 초청 수락시에도 처리 필요하다
    // 길드 가입중인데 요청과 초청이 처리 될경우 버그 발생할 수 있어 미리 지워준다.
    public async createGuild( userId:number, name:string ){
        const price : number = 100;

        let response  = await GuildStorage.createGuild( userId, name, price );

        if( response.success ){
            GuildStorage.deleteAllInviteNRequestJoin( userId );
        }
    
        return response;
    }

    // 자신의 길드/권한/남은 멤버수 체크
    public async deleteGuild( userId:number, guildId:number ){
        const response = await GuildStorage.deleteGuild( userId, guildId );
        return response;
    }
 
    public async getMyGuildInfo( userId:number){
        const response = await GuildStorage.getMyGuildInfo( userId );
        return response;
    }
 
    public async getGuildInfo( name:string){
        const response = await GuildStorage.getGuildInfo( name );
        return response;
    }

    public async getGuildMemberList( userId:number){
        const response = await GuildStorage.getGuildMemberList( userId );
        return response;
    }

    public async deportGuildMember(userId:number, memberId:number){
        const response = await GuildStorage.deportGuildMember( userId, memberId );
        return response;
    }

    public async leaveGuildMember(userId:number){
        const response = await GuildStorage.leaveGuildMember( userId );
        return response;
    }
 
    public async requestGuildJoin( userId:number, guildName:string ){
        let result = await GuildStorage.isGuildMember( userId );
        if( result ){
            return { success:false, msg:"invalid request:already guild member"}
        }

        const response = await GuildStorage.requestGuildJoin( userId, guildName );
        return response;
    }


    public async getGuidJoinRequestList( userId:number ){
        const response = await GuildStorage.getGuidJoinRequestList( userId );
        return response;
    }

    public async inviteGuildJoin ( userId:number, userName:string ){
        let result = await GuildStorage.isGuildMemberByName( userName );
        
        console.log( result );

        if( result.result ){
            return { success:false, msg:"invalid request:already guild member"}
        }



        const response = await GuildStorage.inviteGuildJoin( userId, result.userId );
        return response;
    }

    public async getGuildJoinInviteList( userId:number ){
        const response = await GuildStorage.getGuildJoinInviteList( userId );
        return response;
    }

    // TODO acceptGuildJoinRequest안에서 deleteAllInviteNRequestJoin 처리 해 버려?
    public async acceptGuildJoinRequest( userId:number, requestId:number ){
        const response = await GuildStorage.acceptGuildJoinRequest( userId, requestId );

        if( response.success){
//         GuildStorage.deleteAllInviteNRequestJoin( requestUserID );
        }
        return response;
    }

    public async refuseGuildJoinRequest( userId:number, requestId:number ){
        const response = await GuildStorage.refuseGuildJoinRequest( userId, requestId );
        return response;
    }

    public async acceptGuildJoinInvite( userId:number, inviteId:number ){
        const response = await GuildStorage.acceptGuildJoinInvite( userId, inviteId );
        if( response.success){
               GuildStorage.deleteAllInviteNRequestJoin( userId );
        }
            
        return response;
    }

    public async refuseGuildJoinInvite( userId:number, inviteId:number ){
        const response = await GuildStorage.refuseGuildJoinInvite( userId, inviteId );
        return response;
    }

}