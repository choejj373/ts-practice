//const crypto = require("crypto");
// import JSEncrypt from 'node-jsencrypt';
export class Secret{

    private static _instance:Secret;

    private PrivateKey: string;
    private PublicKey: string;
    private SymmetricKey: string;

    private constructor(){
        this.PrivateKey    = process.env.PRIVATEKEY ?? "";
        this.PublicKey     = process.env.PUBLICKEY ?? "";
        this.SymmetricKey  = "";//crypto.randomBytes(32);
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

    public getSymmetricKey()
    {
        return this.SymmetricKey;
    }

    public getSymmetricKeyEncodedByPrivateKey()
    {
        // const keyp = crypto.createPrivateKey({
        //             key: this.PrivateKey,
        //             passphrase: "",
        //             padding: crypto.constants.RSA_PKCS1_PADDING
        //         });    
            
        // const dec = crypto.privateEncrypt(keyp, Buffer.from( SymmetricKey));
        // return dec.toString("base64");
    }
    public getValueDecodedByPrivateKey( encodedText:string)
    {
        // const jsEncrypt = new JSEncrypt();

        // console.log( this.PrivateKey ) ;
        // jsEncrypt.setPrivateKey( this.PrivateKey );

        // return jsEncrypt.decrypt( encodedText );
        
        // const key = crypto.createPrivateKey({
        //     key: this.PrivateKey,
        //     passphrase: '',
        //     padding: crypto.constants.RSA_PKCS1_PADDING
        // });

        // const dec = crypto.privateDecrypt(key, Buffer.from(encodedText, "base64"));
        //const dec = crypto.privateDecrypt(key, Buffer.from(encodedText));
    
        // return dec.toString("utf8");
    }

}