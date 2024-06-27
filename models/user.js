const {DataTypes}=require("sequelize")
const mysqlDB=require("../databases/database")

const User=mysqlDB.define("user",{
    cf:{
        type:DataTypes.CHAR(16),
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    email:{
        type:DataTypes.STRING(64),
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    surname:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    
    provincia:{
        type:DataTypes.CHAR(16),
        allowNull:false
    },
    indirizzo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    citta:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    isConfirmed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    superUser:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false,
        validate:{
            checkUniqueSuperUser(value){
                return new Promise((resolve,reject)=>{
                    if(value===true){
                        User.findOne({where:{superUser:true}})
                        .then(user=>{
                            if(user){
                                reject(new Error("Only one SuperUser admit"))
                            }else{
                                resolve()
                            }
                        })
                        .catch(err=>{
                            console.log(err)
                            reject(err)
                        })
                    }else{
                        resolve()
                    }
                })
            }
        }

    }
},{
    timestamps:false,
    engine:"InnoDB"

})



module.exports=User