const express=require("express")
const MainController=require("../controllers/main")

const router=express.Router()




router.post("/",MainController.postMain)
router.get("/",MainController.getIndex)

exports.MainRoutes=router