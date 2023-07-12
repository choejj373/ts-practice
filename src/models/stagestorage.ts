


export class StageStorage{
    #stageData = {
        id : 1,
        mob1 : {
                    hp : 100,
                    damage : 10,
                    attackSpeed : 1000,
                    skill1:{
                                type :1,
                                cooltime : 1000,
                            },
                    skill2:{
                            type :2,
                                cooltime : 1000,
                            },
                    skill3:{
                                type :3,
                                cooltime : 1000,
                            },
                    skill4:{
                            type :4,
                            cooltime : 1000,
                            },
                
            },
        mob2 : {
                hp : 100,
                damage : 10,
                attackSpeed : 1000,
                skill1:{
                        type :1,
                        cooltime : 1000,
                    },
                skill2:{
                        type :2,
                        cooltime : 1000,
                    },
                skill3:{
                        type :3,
                        cooltime : 1000,
                    },
                skill4:{
                        type :4,
                        cooltime : 1000,
                    },
                
            },
        mob3:{
                hp : 100,
                damage : 10,
                attackSpeed : 1000,
                
                skill1:{
                        type :1,
                        cooltime : 1000,
                    },
                skill2:{
                        type :2,
                        cooltime : 1000,
                    },
                skill3:{
                        type :3,
                        cooltime : 1000,
                    },
                skill4:{
                        type :4,
                        cooltime : 1000,
                    },
                
            },
        mob4:{
                hp : 100,
                damage : 10,
                attackSpeed : 1000,
                skill1:{
                        type :1,
                        cooltime : 1000,
                    },
                skill2:{
                        type :2,
                        cooltime : 1000,
                    },
                skill3:
                    {
                        type :3,
                        cooltime : 1000,
                    },
                skill4:
                    {
                        type :4,
                        cooltime : 1000,
                    },
                
            },
        mob5:{
                hp : 100,
                damage : 10,
                attackSpeed : 1000,
                
                skill1:{
                        type :1,
                        cooltime : 1000,
                    },
                skill2:{
                        type :2,
                        cooltime : 1000,
                    },
                skill3:{
                        type :3,
                        cooltime : 1000,
                    },
                skill4:{
                        type :4,
                        cooltime : 1000,
                    },
                
            }
    }

    constructor(){
        console.log( this.#stageData);
    }

    public getStageData( stageId ) 
    {
        const response = { success:true, stageData:this.#stageData }
        return response;
    }

}

