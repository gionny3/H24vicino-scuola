function isValid(cf){
    if(cf.length!==16){
        return false
    }
    if(/\d/.test(cf.substring(0,6)) || /\d/.test(cf[8]) || /\d/.test(cf[11]) ||  /\d/.test(cf[15])){
        return false
    }
    if(!/\d/.test(cf.substring(6,8)) || !/\d/.test(cf.substring(9,11)) || !/\d/.test(cf.substring(12,15))){
        return false
    }
    return true    
}

module.exports=isValid