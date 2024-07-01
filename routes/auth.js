const express=require("express")
const AuthController=require("../controllers/auth")
const router=express.Router()
const User = require("../models/user");
const {body}=require("express-validator")
const bcrytp=require("bcrypt");
const { isAuth, isAdmin, isNotAuth, isConfirmed } = require("../middleware/is-auth");
const isValid = require("../util/valid-cf");
const has3Decimal = require("../util/has-three-decimal");


router.get("/login",isNotAuth,AuthController.getLogin)
router.get("/signup",isNotAuth,AuthController.getSingUp)

router.post("/login",[
    body("email")
    .isEmail()
    .trim()
    .withMessage("Email inserita non valida"),

    body("password").isAlphanumeric()
    .custom((value,{req})=>{
        return User.findOne({where:{email:req.body.email}})
        .then(user=>{
            if(!user){
                throw new Error("Email inesistente")
            }
            bcrytp.compare(value,user.password)
            .then(doMatch=>{
                if(!doMatch){
                throw new Error("credenziali errate")
                    
                }
            })
        })
    })

], AuthController.postLogin)

router.post("/signup",[
    body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .withMessage("Email inserita non valida"),

    body("email").custom((value,{req})=>{
        return User.findOne({ where: { email: value } })
        .then(existingUser => {
            if (existingUser) {
                throw new Error("Email già esistente");
            }
            return true;
        })
        
    }),
    body("password","la Password deve avere minimo 5 caratteri").isAlphanumeric().isLength({min:5,max:12}).custom((value,{req})=>{
        if(req.body.confirm!==value){
            console.log("ci arrivo")
            throw new Error("non corrispondono")
        }
        
        return true
    }).withMessage("le password non corrispondono"),
    body("nome")
    .not().isAlpha()
    .withMessage("il nome non puo contenere caratteri numerici"),
    body("cognome")
    .not().isAlpha()
    .withMessage("il cognome non puo contenere caratteri numerici"),
    body("cf")
    .isAlphanumeric()
    // .custom((value,{req})=>{
    //     const isOK=isValid(value)
    //     if(!isOK){
    //         throw new Error("Codice Fiscale non valido")
    //     }
    //     return true
    // })


],AuthController.postSignUp)


router.post("/logout",isAuth,AuthController.Logout)
router.get("/request",isConfirmed,isAdmin,AuthController.getRequestPage)
router.get("/request-details/:requestId",isConfirmed,isAdmin,AuthController.getDetail)
router.post("/confirm-access",isConfirmed,isAdmin,AuthController.postAccept)
router.post("/denied-access",isConfirmed,isAdmin,AuthController.postDenied)
router.get("/add-macchinetta",isConfirmed,AuthController.getAddMacchinetta)
router.post("/add-macchinetta",isConfirmed,[
    body("longitudine")
    .isNumeric()
    .custom((value,{req})=>{
        if(value>180 || value<-180){
            throw new Error("longitudine non valida")
        }
        if(has3Decimal(value)){
            throw new Error("longitudine inprecisa, almeno 3 decimali")

        }
        return true

    }),
    body("latitudine")
    .isNumeric()
    .custom((value,{req})=>{
        if(value>90 || value<-90){
            throw new Error("Latitudine non valida")
        }
        if(has3Decimal(value)){
            throw new Error("Latitudine inprecisa, almeno 3 decimali")

        }
        return true

    })
],AuthController.postAddMacchinetta)


// router.get("/donazione",isAuth,AuthController.Donazione)


exports.AuthRoutes=router