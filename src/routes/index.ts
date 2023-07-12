"use strict";

import express from "express";

import { output, process } from "./ctrl.js";
import authUtil from '../middlewares/auth.js';

export const router = express.Router();

router.get("/", output.home);

//처음 시작시나 브라우저 리로드시 토큰으로 인증 체크
router.put("/", authUtil.checkToken, process.checkToken );
router.get("/crypto/publickey", process.getPublicKey );
//router.get("/crypto/symmetrickey", ctrl.process.getSimmetricKey );

router.post("/user/guest", process.guestRegister );
router.put("/user/guest", process.guestLogin );

router.post("/user", process.register );
router.put("/user", process.login );

router.get("/user", authUtil.checkToken,process.getuserinfo);
router.delete("/user", authUtil.checkToken,process.logout);


router.get("/store", authUtil.checkToken, process.getTradeDailyStore);
router.post("/store/daily", authUtil.checkToken, process.dailystore);
router.post("/store/diamond", authUtil.checkToken, process.diamondstore);


router.get("/equipment", authUtil.checkToken,process.getItemAll );
router.put("/equipment/inventory", authUtil.checkToken,process.equipItem );
router.delete("/equipment/inventory", authUtil.checkToken,process.sellItem );
router.put("/equipment/equip", authUtil.checkToken,process.unEquipItem );


router.get("/quest/daily", authUtil.checkToken, process.getUserDailyQuestInfo );
router.get("/quest/weekly", authUtil.checkToken,process.getUserWeeklyQuestInfo );
router.get("/quest/normal", authUtil.checkToken,process.getUserNormalQuestInfo );
router.put("/quest/reward", authUtil.checkToken,process.requireQuestReward );

router.get('/auth/google', process.googleLogin );
router.get('/auth/google/callback', process.googleRedirect );
