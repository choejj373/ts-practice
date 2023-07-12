class command{
    constructor(){}
    exec(){}
}

export class cmdDamage extends command{
    constructor( attacker, damage, target )
    {
        super();
        this.attacker = attacker;
        this.damage = damage;
        this.target = target;//party
    }
    exec(logger){

        if( this.attacker.isDead())
        {
            return this.attacker.getName() + "is Dead"
        }
        let targetName = this.target.damaged( this.damage, logger, this.attacker.getName() );
    }
}

export class cmdHeal extends command{
    constructor( healer, hp, target )
    {
        super();
        this.healer = healer;
        this.hp = hp;
        this.target = target;//object
    }
    exec(logger){
        if( this.healer.isDead())
        {
            return this.healer.getName() + " is Dead";
        }

        let targetName = this.target.heal( this.hp, logger, this.healer.getName() );
    }
}

export class cmdDamageWide extends command{
    constructor( attacker, damage, target )
    {
        super();
        this.attacker = attacker;
        this.damage = damage;
        this.target = target;// Party
    }
    exec(logger){
        if( this.attacker.isDead())
        {
            return this.attacker.getName() + " is Dead";
        }

        let targetName = this.target.damagedAll( this.damage, logger, this.attacker.getName() );
    }
}

export class cmdHealWide extends command{
    constructor( healer, hp, target )
    {
        super();
        this.healer = healer;
        this.hp = hp;
        this.target = target; // Party
    }
    exec(logger){

        if( this.healer.isDead())
        {
            return this.healer.getName() + " is Dead";
        }

        let targetName = this.target.healAll( this.hp, logger, this.healer.getName() );
    }
}