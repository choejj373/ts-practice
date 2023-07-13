import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();


const PrivateKey = process.env.PRIVATEKEY??"";
export const PublicKey = process.env.PUBLICKEY??"";

    // https://gist.github.com/btd/915985269cd2c98a17144a4660f45a09 thx
export const getValueDecodedByPrivateKey = ( encodedText:string) =>{
    const dec = crypto.privateDecrypt({
        key: PrivateKey,
        padding:  crypto.constants.RSA_PKCS1_PADDING// For JSEncrypt
    }, Buffer.from(encodedText, "base64"));

    return dec.toString("utf8");
}

