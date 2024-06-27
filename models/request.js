const {DataTypes,literal,fn}=require("sequelize")
const mysqlDB=require("../databases/database")

const Request=mysqlDB.define("request",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,

    },
    viewed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false,
    },
    motivazione:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    dataRichiesta:{
        type:DataTypes.DATEONLY,
        allowNull:false
    }
},{
    timestamps:false,
    engine:"InnoDB"

})

module.exports=Request