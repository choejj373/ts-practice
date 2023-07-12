import { cmdDamage, cmdHeal, cmdDamageWide, cmdHealWide } from "./command.js";

export default class Object{
    constructor( name, hp, damage, attackSpeed ){
        this.skillList = [];
        this.name = name;
        this.hp = hp ;
        this.damage = damage ;
        this.attackSpeed = attackSpeed;
        this.prevAttackTime = -1;
    }
    
    addSkill( skill ){
        this.skillList.push( skill );
    }
    getName(){
        return this.name;
    }

    getHp(){
        return this.hp;
    }

    updateFrame( nowTime, cmdQ,  enemy, ourTeam ){
        if( this.isDead() ){
            return;
        }

        if( this.prevAttackTime === -1 )
        {
            this.prevAttackTime = nowTime;
            // enemy.damaged( this.damage );
            cmdQ.push( [ this.prevAttackTime, new cmdDamage( this, this.damage, enemy ) ])
        }
        else
        {
            while( nowTime >= this.prevAttackTime + this.attackSpeed )
            {
                // enemy.damaged( this.damage );
                this.prevAttackTime += this.attackSpeed;
                cmdQ.push( [ this.prevAttackTime, new cmdDamage( this, this.damage, enemy ) ]);
                
            }
        }
        
        // 스킬 공격
        this.skillList.forEach((skill)=>{
            skill.updateFrame( nowTime, cmdQ, enemy, ourTeam, this );
        })
        // 단일 공격,전체 공격, 일부 공격
    }

    damaged( damage, logger, from ){

        if( this.isDead()){
            return false;
        }

        this.hp -= damage;


        let messageItem = document.createElement('li');
        messageItem.textContent = this.getName() + "(hp:" + this.hp + ")" + "is Attacked" + "(damage:" + damage + ")" + " from " + from
        logger.appendChild(messageItem);
        

        if( this.isDead())
        {
            let messageItem = document.createElement('li');
            messageItem.textContent = this.getName() + " is Dead";
            logger.appendChild(messageItem);
        }

        logger.scrollTo( 0 , logger.scrollHeight );

        return true;
    }

    heal( _hp, logger, from ){
        if( this.isDead() ){
            return false;
        }

        this.hp += _hp;

        let messageItem = document.createElement('li');
        messageItem.textContent = this.getName() + "(hp:" + this.hp + ")" + "is Healed"+ "(hp:" + _hp + ")" + " from " + from
        logger.appendChild(messageItem);
        
        logger.scrollTo( 0 , logger.scrollHeight );

        return true;
    }

    isDead(){
        return ( this.hp <= 0 )?true:false;
    }
}