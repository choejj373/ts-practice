import { Request, Response } from 'express';
import { CustomRequest } from '../customType/express.d';
import { Guild } from '../services/guild.js'

export const guild = {

    createGuild : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().createGuild( req.userId ?? 0, req.body.name );
        return res.json( response );
    },

    deleteGuild : async ( req:CustomRequest,res:Response )=>{

        const response = await Guild.getInstance().deleteGuild( req.userId ?? 0, req.body.guildId );
        return res.json( response );
    },

    getMyGuildInfo :async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getMyGuildInfo( req.userId ?? 0);
        return res.json( response );
    }, 

    getGuildInfo :async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getGuildInfo( req.body.name );
        return res.json( response );
    }, 

    getGuildList: async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getGuildList();
        return res.json( response );
    }, 
    getGuildMemberList: async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getGuildMemberList( req.userId??0);
        return res.json( response );
    }, 
    depotGuildMember : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().deportGuildMember( req.userId??0, req.body.memberId );
        return res.json( response );
    },

    leaveGuildMember : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().leaveGuildMember( req.userId??0 );
        return res.json( response );
    },

    requestGuildJoin : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().requestGuildJoin( req.userId??0, req.body.name );
        return res.json( response );
    },

    getGuildJoinRequestList : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getGuidJoinRequestList( req.userId??0 );
        return res.json( response );
    },

    inviteGuildJoin : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().inviteGuildJoin( req.userId??0, req.body.name );
        return res.json( response );
    },

    getGuildJoinInviteList : async ( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().getGuildJoinInviteList( req.userId??0 );
        return res.json( response );
    },

    acceptGuildJoinRequest : async( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().acceptGuildJoinRequest( req.userId??0 , req.body.requestId );
        return res.json( response );
    },

    refuseGuildJoinRequest : async( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().refuseGuildJoinRequest( req.userId??0 , req.body.requestId );
        return res.json( response );
    },

    acceptGuildJoinInvite : async( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().acceptGuildJoinInvite( req.userId??0 , req.body.inviteId );
        return res.json( response );
    },

    refuseGuildJoinInvite : async( req:CustomRequest,res:Response )=>{
        const response = await Guild.getInstance().refuseGuildJoinInvite( req.userId??0 , req.body.inviteId );
        return res.json( response );
    },
}