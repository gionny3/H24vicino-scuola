const {DataTypes,fn}=require("sequelize")
const mysqlDB=require("../databases/database")

const Macchinette=mysqlDB.define("Macchinetta",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    nome:{
        type:DataTypes.STRING(70),
        allowNull:false,
    },
    tipo:{
        type:DataTypes.STRING(15),
        allowNull:false,
        validate:{
            isIn:{
                args:["H24","Preworkout"],
                msg:"sei gay"
            }
        }
    },
    luogo:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    posizione:{
        type:DataTypes.GEOMETRY("POINT",3857),
        allowNull:false,
    }

},{
    timestamps:false,
    engine:"InnoDB"

})

module.exports=Macchinette;