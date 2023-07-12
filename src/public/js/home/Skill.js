import { cmdDamage, cmdHeal, cmdDamageWide, cmdHealWide } from "./command.js";

class Skill{
    constructor( name, coolTimeTick )
    {
        this.name = name;
        this.coolTimeTick = coolTimeTick;
        this.prevProcessTime = 0;
    }

    updateFrame( nowTime, cmdQ, enemy, ourTeam, owner ){

        if( this.prevProcessTime == 0 )
        {
            this.prevProcessTime = nowTime;
            this.process( this.prevProcessTime, cmdQ, enemy, ourTeam, owner );
        }
        else 
        {
            while( nowTime >= this.prevProcessTime + this.coolTimeTick )
            {
                this.prevProcessTime += this.coolTimeTick;
                this.process( this.prevProcessTime, cmdQ, enemy, ourTeam, owner );
            }
        }
    }

    // 스킬마다 다르게 처리
    process( processTime, cmdQ, enemy, ourTeam, owner ) {}
}

export class SkillDamage extends Skill{
    constructor( name, coolTimeTick )
    {
        super( name, coolTimeTick );
    }

    process ( processTime, cmdQ, enemy, ourTeam, owner ){
        // console.log( "skill damage");
        // enemy.damaged( 1 );
        cmdQ.push( [ processTime, new cmdDamage( owner, 500, enemy ) ] );
    }
}

export class SkillDamageWide extends Skill{
    constructor( name, coolTimeTick )
    {
        super( name, coolTimeTick );
    }

    process ( processTime, cmdQ, enemy, ourTeam, owner ){
        // console.log( "skill damage wide");
        // enemy.damagedAll( 1 );
        cmdQ.push( [ processTime, new cmdDamageWide( owner, 100, enemy )] )
    }
}

export class SkillHeal extends Skill{
    constructor( name, coolTimeTick )
    {
        super( name, coolTimeTick );
    }

    process ( processTime, cmdQ, enemy, ourTeam, owner ){
        // console.log( "skill heal");
        // owner.heal( 1 );
        cmdQ.push( [ processTime, new cmdHeal( owner, 300, ourTeam )])
    }
}

export class SkillHealWide extends Skill{
    constructor( name, coolTimeTick )
    {
        super( name, coolTimeTick );
    }

    process ( processTime, cmdQ, enemy, ourTeam, owner ){
        // console.log( "skill heal wide");
        // owner.healAll( 1 );
        cmdQ.push( [ processTime, new cmdHealWide( owner, 100, ourTeam ) ] )
    }
}

// module.exports = {
//     SkillDamage,
//     SkillDamageWide,
//     SkillHeal,
//     SkillHealWide,
// }