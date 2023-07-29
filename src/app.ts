import express from "express";
import cookieParser from 'cookie-parser';
import path from "path";
import config from './config/index.js'
import { router } from "./routes/index.js";

//__dirname 선언

// const minute = 1000 * 60;
// const hour = minute * 60;

export const createApp =() =>{
    const app = express();


    const __dirname = path.resolve();

    app.set("views", path.join(__dirname,"./src/views" ) );
    app.set("view engine", "ejs");

    app.use(cookieParser( config.cookie.secret));
    app.use(express.static(path.join(__dirname, '/src/public')));
    app.use(express.json());
    app.use(express.urlencoded( { extended:true } ));
    app.use('/', router);

    return app;
}
