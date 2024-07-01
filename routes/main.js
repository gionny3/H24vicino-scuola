const express=require("express")
const MainController=require("../controllers/main")
const {isAuth, isConfirmed}=require("../middleware/is-auth")
const { doubleCsrfProtection } = require("..")
const cors=require("cors")

const router=express.Router()




router.post("/",MainController.postMain)
router.get("/",MainController.getIndex)

exports.MainRoutes=router