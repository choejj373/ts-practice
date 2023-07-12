import Party from './Party.js';
import Object from './Object.js'
import { SkillDamage, SkillDamageWide, SkillHeal, SkillHealWide } from './Skill.js'

let p1 = null;
let p2 = null;

let startTime = 0;
let g_cmdQ = [];

export function MakeNewGame(){
    p1 = new Party("a");
    p2 = new Party("b");

    startTime = 0;
    g_cmdQ = [];

    startTime = Date.now();
    
    let a1 = new Object("a1", 50000, 500, 1000 ); 
    a1.addSkill( new SkillDamage("0", 500));            
    a1.addSkill( new SkillDamage("1", 500));            
    a1.addSkill( new SkillDamage("2",1000));
    a1.addSkill( new SkillHeal("3",1500));
    p1.addMember( a1 );


    let a2 = new Object("a2", 20000, 500, 1000 );
    a2.addSkill( new SkillDamageWide("4",1000));
    a2.addSkill( new SkillDamage("5",1500));            
    a2.addSkill( new SkillDamage("6",2000));                        
    a2.addSkill( new SkillHealWide("7",2500));                        
    p1.addMember( a2 );

    let a3 = new Object("a3", 20000, 500, 1000 );
    a3.addSkill( new SkillDamage("8",1000));                        
    a3.addSkill( new SkillDamage("9",2500));                        
    a3.addSkill( new SkillDamage("10",3000));                                    
    a3.addSkill( new SkillDamage("11",2000));                                    
    p1.addMember( a3 );
    
    let a4 = new Object("a4", 10000, 500, 1000);
    a4.addSkill( new SkillDamage("12",4000));                        
    a4.addSkill( new SkillDamage("13",4500));                        
    a4.addSkill( new SkillDamage("14",5000));                                    
    a4.addSkill( new SkillDamage("15",5000));                                    
    p1.addMember( a4 );
    
    let a5 = new Object("a5", 50000, 500, 1000 );
    a5.addSkill( new SkillDamage("16",4000));                        
    a5.addSkill( new SkillDamage("17",4500));                        
    a5.addSkill( new SkillDamage("18",5000));                                    
    a5.addSkill( new SkillDamage("19",5000));                                    
    p1.addMember( a5 );
    
    

    let b1 = new Object("b1", 50000, 500, 1000 ); 
    b1.addSkill( new SkillDamage("0", 500));            
    b1.addSkill( new SkillDamage("1", 500));            
    b1.addSkill( new SkillDamage("2",1000));
    b1.addSkill( new SkillHeal("3",1500));
    p2.addMember( b1 );

    let b2 = new Object("b2", 20000, 500, 1000 );
    b2.addSkill( new SkillDamageWide("4",1000));
    b2.addSkill( new SkillDamage("5",1500));            
    b2.addSkill( new SkillDamage("6",2000));                        
    b2.addSkill( new SkillHealWide("7",2500));                        
    p2.addMember( b2 );

    let b3 = new Object("b3", 20000, 500, 1000);
    b3.addSkill( new SkillDamage("8",1000));                        
    b3.addSkill( new SkillDamage("9",2500));                        
    b3.addSkill( new SkillDamage("10",3000));                                    
    b3.addSkill( new SkillDamage("11",2000));                                    
    p2.addMember( b3 );
    
    let b4 = new Object("b4", 20000, 500, 1000 );
    b4.addSkill( new SkillDamage("12",4000));                        
    b4.addSkill( new SkillDamage("13",4500));                        
    b4.addSkill( new SkillDamage("14",5000));                                    
    b4.addSkill( new SkillDamage("15",5000));                                    
    p2.addMember( b4 );
    
    let b5 = new Object("b5", 50000, 500, 1000 );
    b5.addSkill( new SkillDamage("16",4000));                        
    b5.addSkill( new SkillDamage("17",4500));                        
    b5.addSkill( new SkillDamage("18",5000));                                    
    b5.addSkill( new SkillDamage("19",5000));                                    
    p2.addMember( b5 );


}
     
// TODO updateFrame에서 발생하는 attack및 heal을 Command Q에 시간 순서대로 넣고
// 마지막에 순서대로 처리해준다.;;;한번에 소트하던가 처음부터 map에 넣어두던가;
// map이 소트된순서대로 돌지는 않네;
export function updateFrame(singlegameList){

    let nowTime = Date.now();

    p1.updateFrame( nowTime, g_cmdQ, p2 );
    p2.updateFrame( nowTime, g_cmdQ, p1 );

    g_cmdQ.sort(function(a, b){ 
        if( a[0] >= b[0] ){
            return 1;
        }
        return -1;
    });

   
    for( const [key, val] of g_cmdQ ) {
       
        val.exec( singlegameList );

        if( p1.isDead() || p2.isDead() ){

            let messageItem = document.createElement('li');
            messageItem.textContent = "Elapsed Time " + ( nowTime - startTime ) + " P1:" + p1.getHp() + ", P2:" + p2.getHp();
            singlegameList.appendChild(messageItem);
    
            singlegameList.scrollTo( 0 , singlegameList.scrollHeight );
    
            return false;
        }
    }

    g_cmdQ = [];

    return true;
}
   
export function clearGame(){

    p1 = null;
    p2 = null;

    g_cmdQ = null;
}
