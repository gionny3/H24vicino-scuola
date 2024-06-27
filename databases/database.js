const {Sequelize}=require("sequelize")

const myDB=new Sequelize({host:"localhost",database:"distr",password:"Gianni101005!",dialect:"mysql",username:"giovanni"})

module.exports=myDB
