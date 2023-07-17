
export const generateRandomString = (num:number)=>{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
}
// 대소문자 구분
// todo ...arg
export const stringIncludes = (str:string, arg1:string, arg2:string)=>{
    if( str.search( arg1 ) === -1 ){
        return -1;
    }
    
    if( str.search( arg2 ) === -1 ){
        return -1;
    }
    return 1;
}


// dbms err message 및 index 이름에 종속적이다.
// db-util에 옮겨야지;
export const isNameDuplicated = ( sqlMessage:string ) =>
{
    if( stringIncludes( sqlMessage , 'Duplicate entry', 'user_name_idx') === 1 )
        return true;
    return false;
}
