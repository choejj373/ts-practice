import crypto from "crypto";

export class Secret{

    private static _instance:Secret;

    private PrivateKey: string;
    private PublicKey: string;
    // private SymmetricKey: string;

    private constructor(){
        this.PrivateKey    = process.env.PRIVATEKEY ?? "";
        this.PublicKey     = process.env.PUBLICKEY ?? "";
        // this.SymmetricKey  = crypto.randomBytes(32);
    }


    public static getInstance():Secret
    {
        if( this._instance == null )
            this._instance  = new Secret();

        return this._instance;
    }

    public getPrivateKey()
    {
        return this.PrivateKey;
    }
    public getPublicKey()
    {
        return this.PublicKey;
    }

    // public getSymmetricKey()
    // {
    //     return this.SymmetricKey;
    // }

    public getSymmetricKeyEncodedByPrivateKey()
    {
        // const dec = crypto.privateEncrypt({
        //     key: this.PrivateKey,
        //     padding: crypto.constants.RSA_PKCS1_PADDING
        // }, Buffer.from( this.SymmetricKey));

        // return dec.toString("base64");
    }


    // https://gist.github.com/btd/915985269cd2c98a17144a4660f45a09 thx
    public getValueDecodedByPrivateKey( encodedText:string)
    {
        const dec = crypto.privateDecrypt({
            key: this.PrivateKey,
            padding:  crypto.constants.RSA_PKCS1_PADDING// For JSEncrypt
        }, Buffer.from(encodedText, "base64"));
    
        return dec.toString("utf8");
    }

}