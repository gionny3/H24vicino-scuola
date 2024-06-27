function has3Decimal(number){
    const numberString=number.toString()
    const decimalPart=numberString.split(".")[1]
    if(!decimalPart){
        return false
    }
    if(decimalPart.length<3){
        return false
    }
    return true
}

module.exports=has3Decimal
