import { Request, Response } from 'express';

import { FriendStorage } from '../models/friendstorage.js'
import { CustomRequest } from '../customType/express.d';

export const friend = {
    // 전체 친구 리스트 
    getFriendList : async ( req:CustomRequest,res:Response )=>{

        const response = await FriendStorage.getFriendList( req.userId ?? 0);
        return res.json( response );
    },
    // 친구 삭제
    deleteFriend :async ( req:CustomRequest,res:Response )=>{
        const response = await FriendStorage.deleteFriend( req.userId ?? 0, req.body.name );
        return res.json(response);
    },
    // 친구 요청 들어온 리스트
    getFriendRequestedList:async ( req:CustomRequest, res:Response )=>{
        const response = await FriendStorage.getFriendRequestedList( req.userId ?? 0 );
        return res.json(response);
    },
    // 친구 요청
    requestFriend:async ( req:CustomRequest,res:Response )=>{
        const response = await FriendStorage.requestFriend( req.userId??0, req.body.name);
        return res.json(response);
    },
    // 친구 요청 수락
    acceptFriendRequest:async( req:CustomRequest, res:Response )=>{
        const response = await FriendStorage.acceptFriendRequest( req.userId??0, req.body.name);
        return res.json(response);
    },
    // 친구 요청 거부
    refuseFriendRequest:async(req:CustomRequest, res:Response )=>{
        const response = await FriendStorage.refuseFriendRequest( req.userId??0, req.body.name);
        return res.json(response);
    }, 
}

