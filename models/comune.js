const {DataTypes}=require("sequelize")
const mysqlDB=require("../databases/database")

const Comune=mysqlDB.define("Comunes",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    nome:{
        type:DataTypes.STRING(100),
        allowNull:false,
    }
}
,{
    tableName:"Comune",
    timestamps:false,
    engine:"InnoDB"
})

module.exports=Comune;