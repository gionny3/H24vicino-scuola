const express=require("express")
const MainController=require("../controllers/main")
const {isAuth, isConfirmed}=require("../middleware/is-auth")
const { doubleCsrfProtection } = require("..")
const cors=require("cors")

const router=express.Router()




router.post("/",MainController.postMain)
router.get("/",MainController.getIndex)
// router.get("/test",isConfirmed,MainController.getTest);

exports.MainRoutes=router