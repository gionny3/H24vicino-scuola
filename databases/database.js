const {Sequelize}=require("sequelize")

const myDB=new Sequelize({host:"localhost",database:"distr",password:process.env.DB_PWD,dialect:"mysql",username:process.env.DB_USER})

module.exports=myDB
