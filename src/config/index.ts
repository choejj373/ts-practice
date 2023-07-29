import 'dotenv/config';

export default{
    mode_env: process.env.MODE_ENV,
    port: process.env.PORT,
    database:{
        host:process.env.DB_HOST??"",
        user:process.env.DB_USER??"",
        port:process.env.DB_PORT??"",
        password:process.env.DB_PSWORD??"",
        database:process.env.DB_DATABASE??""
    },
    redis:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT,
        password:process.env.REDIS_PASSWORD
    },
    cookie:{
        secret:process.env.COOKIE_SECRET,
    },
    google:{
        id:process.env.GOOGLE_ID,
        secret:process.env.GOOGLE_SECRET
    },
    jwt:{
        secret:process.env.JWT_SECRET
    },
    rsa:{
        privateKey:process.env.PRIVATEKEY,
        publicKey:process.env.PUBLICKEY,
    }
}