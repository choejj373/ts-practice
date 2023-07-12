export default class Party
{
    constructor(name){
        this.memberList = [];
        this.name = name;
    }

    getName(){
        return this.name;
    }

    addMember( member ){
        this.memberList.push( member );
    }

    updateFrame( nowTime, cmdQ, enemy ){
        this.memberList.forEach( (member)=>{
            member.updateFrame( nowTime, cmdQ, enemy, this );
        })
    }
    
    damagedAll( _damage, logger, from ){
        this.memberList.forEach( (member)=>{
            member.damaged( _damage, logger, from );
        })
        return this.getName();
    }
    damaged( damage, logger, from ){
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( this.memberList[i].damaged(damage, logger, from) ){
                return this.memberList[i].getName();
            }
        }
        return "";
    }

    heal( hp, logger, from )
    {
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( this.memberList[i].heal(hp, logger, from) ){
                return this.memberList[i].getName();
            }
        }
        return "";
    }

    healAll( _hp, logger, from )
    {
        this.memberList.forEach((member)=>{
            member.heal( _hp, logger, from );
        })       
        return this.getName() ;
    }

    isDead(){
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( !this.memberList[i].isDead() ){
                return false;
            }
        }
        return true;
    }

    getHp(){
        let hp = 0;
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( !this.memberList[i].isDead() ){
                hp += this.memberList[i].getHp();
            }
        }
        return hp;
    }

}

// module.exports = Party;