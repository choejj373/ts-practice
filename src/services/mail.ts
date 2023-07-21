
import { MailStorage } from '../models/mailstorage.js';
export interface SendMailItem {
    index:number
    id?:number,
}


// type : 1-gm, 2-system 3-user
export class Mail {
    private static _instance:Mail;

    private constructor(){
    }
    public static getInstance():Mail
    {
        if( this._instance == null )
            this._instance  = new Mail();

        return this._instance;
    }

    public async getMailList( userId:number){
        const response = await MailStorage.getMailList( userId );
        return response;
    }

    public async readMail( userId:number, mailId:number){
        const response = await  MailStorage.readMail( userId, mailId );
        return response;
    }

    public async deleteMail( userId:number, mailId:number){
        const response = await MailStorage.deleteMail( userId, mailId );
        return response;
    }

    public async sendMailFromUser( userId:number, receiver_user_name:string, title:string, msg:string, gold:number ){
        const response = await MailStorage.sendMailFromUser( userId, receiver_user_name, title, msg, gold);
        return response;
    }

    public async onNewUserCreated(  receiver_user_name:string ){
        const response = await MailStorage.sendMailFromSystem( "Hello", "Welcome to my Server", 10000, receiver_user_name, Mail.getInstance().getNewAccountItem() );
        return response;
    }

    public async getAttachedItemAll( userId:number, mailId:number ){

        const result = await MailStorage.getAllAttachedItem( userId, mailId );
        let response = { success:false, msg:"" }
        if( result.success ){
            response = await MailStorage.detachAllAttachedItem( userId, mailId, result.gold, result.mailItems );
        }
        return response;
    }

    public getNewAccountItem(){
        const items : SendMailItem[] = [
            {
                index:1
            },
            {
                index:2
            },
        ]

        return items;
    }

}