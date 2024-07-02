const User = require("../models/user");
const bcrytp=require("bcrypt")
const {validationResult}=require("express-validator");
const Request = require("../models/request");
const moment = require('moment');
const Macchinette = require("../models/macchinette");
const Comune = require("../models/comune");
const { literal } = require("sequelize");
const stripe=require("stripe")(process.env.STRIPE_KEY)


exports.getLogin=(req,res,next)=>{
    let message=req.flash("error")
    if(message.length>0){
        message=message[0]
    }else{
        message=null
    }
    stripe.prices.create({
        currency:"eur",
        unit_amount:200,
        product_data:{
            name:"Donazione"
        }
    })
    .then(price=>{
        return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items:[{
                price:price.id,
                quantity:1
            }],
            success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
            cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",

        })
    })
    .then((session)=>{
        res.render("login-signup",{PageTitle:"Login",LoginMode:true,errorMessage:message,pageContent:{
            title:"Ben Tornato",
            paragraph:"Grazie per la tua collaborazione"
        },
        oldValue:null,
        sessionId:session.id
        })
    })
    .catch(err=>{
        const error= new Error("Errore nell' Autenticazione")
        error.statusCode=500
        return next(error)
    })
    
}

exports.getSingUp=(req,res,next)=>{
    
    let message=req.flash("error")
    if(message.length>0){
        message=message[0]
    }else{
        message=null
    }
    stripe.prices.create({
        currency:"eur",
        unit_amount:200,
        product_data:{
            name:"Donazione"
        }
    })
    .then(price=>{
        return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items:[{
                price:price.id,
                quantity:1
            }],
            success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
            cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",

        })
    })
    .then((session)=>{
        res.render("login-signup",{
            PageTitle:"Sign Up",
            LoginMode:false,
            errorMessage:message,
            pageContent:{
                title:"Entra nel Team!",
                paragraph:"Il Team ha bisogno del tuo aiuto, ti aspettiamo! Per entrare bisogna essere accettati, all'invio del modulo verranno inviate le informazioni da te inserite e la tua richiesta sarà lavorata"
            },
            oldValue:null,
            sessionId:session.id
        })
    })
    .catch(err=>{
        const error= new Error("Errore nell' Autenticazione")
        error.statusCode=500
        return next(error)
    })
    
}

exports.postLogin=(req,res,next)=>{
    const{password,email}=req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        stripe.prices.create({
            currency:"eur",
            unit_amount:200,
            product_data:{
                name:"Donazione"
            }
        })
        .then(price=>{
            return stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: 'payment',
                line_items:[{
                    price:price.id,
                    quantity:1
                }],
                success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
                cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",
        
            })
        })
        .then(session=>{
            return res.render("login-signup",{PageTitle:"Login",LoginMode:true,errorMessage:errors.array(),pageContent:{
                title:"Ben Tornato",
                paragraph:"Grazie per la tua collaborazione"
            },
            sessionId:session.id,
            oldValue:{
                email,
                password
            }
        })
        })
        
    }
    User.findOne({where:{email:email}})
    .then(user=>{
        if(!user){
            const error=new Error("Utente inesistente")
            error.statusCode=404
            throw error
        }
        bcrytp.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn=true
                req.session.user=user
                return req.session.save(err=>{
                    console.log(err)
                    res.redirect("/")
                })
            }
            req.flash("error","qualcosa e andato storto")
            res.redirect("/login")
        })
        .catch(err=>{throw err})
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        return next(err)
    })
}

exports.postSignUp = (req, res, next) => {
    const {password,email,name,surname,address,citta,motivation:motivazione,provincia,cf:CF}=req.body
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        stripe.prices.create({
            currency:"eur",
            unit_amount:200,
            product_data:{
                name:"Donazione"
            }
        })
        .then(price=>{
            return stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: 'payment',
                line_items:[{
                    price:price.id,
                    quantity:1
                }],
                success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
                cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",
        
            })
        })
        .then(session=>{
            return res.render("login-signup", {
                PageTitle: "Sign Up",
                LoginMode: false,
                errorMessage: errors.array(),
                pageContent: {
                    title: "Entra nel Team!",
                    paragraph: "Il Team ha bisogno del tuo aiuto, ti aspettiamo!. Per entrare bisogna essere accettati, all'invio del modulo verranno inviate le informazioni da te inserite e la tua richiesta sarà lavorata"
                },
                sessionId:session.id,
                oldValue:{
                    password,
                    email,
                    name,
                    surname,
                    address,
                    citta,
                    motivazione,
                    provincia,
                    CF
                }
            });
        })
        
    }

    bcrytp.hash(password, 12)
    .then(hashedPassword => {
        return User.create({
            email,
            password: hashedPassword,
            name,
            surname,
            indirizzo: address,
            citta,
            cf: CF,
            superUser: false,
            provincia
        });
    })
    .then((user) => {
        req.session.isLoggedIn = true;
        req.session.user = user;

        return Request.create({
            viewed: false,
            motivazione,
            dataRichiesta: new Date(),
            userCf: user.cf
        });
    })
    .then(() => {
        res.locals.isAuth=req.session.isLoggedIn
        setTimeout(() => {
            res.redirect("/");
        }, 1000);
    })
    .catch(err => {
        const error= new Error("Errore nel Sistema")
        error.statusCode=500
        return next(error);
    });
}


exports.Logout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err)
        res.redirect("/")
    })
}

exports.getRequestPage=(req,res,next)=>{
    const successMessage = req.flash('success')
    const failedMessage = req.flash("fail")

    Request.findAll({
        where:{viewed:false},
        include:[{
            model:User,
            attributes:["email","citta"]
        }]
    })
    .then(requests=>{
        stripe.prices.create({
            currency:"eur",
            unit_amount:200,
            product_data:{
                name:"Donazione"
            }
        })
        .then(price=>{
            return stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: 'payment',
                line_items:[{
                    price:price.id,
                    quantity:1
                }],
                success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
                cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",
    
            })
        })
        .then(session=>{
            res.render("only-admin",{
                PageTitle:"Request",
                pageContent:{
                    title:"Richieste",
                    paragraph:"Bentornato Capo ecco qui le richieste"
                },
                requests,
                successMessage,
                failedMessage,
                sessionId:session.id
                })
        })
        .catch(err=>{
            err.statusCode=500
            throw err
        })
        
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        return next(err)
    })
    
}


exports.getDetail=(req,res,next)=>{
    
    const requestId=req.params.requestId

    Request.findByPk(requestId,{include:[{
        model:User,
        attributes:["email","citta","indirizzo","name","surname","cf"]
    }]})
    .then(request=>{
        stripe.prices.create({
            currency:"eur",
            unit_amount:200,
            product_data:{
                name:"Donazione"
            }
        })
        .then(price=>{
            return stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: 'payment',
                line_items:[{
                    price:price.id,
                    quantity:1
                }],
                success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
                cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",
    
            })
        })
        .then(session=>{
            res.render("detail-page",{
                PageTitle:"DetailsPage",
                    pageContent:{
                        title:"Dettagli richiesta",
                        paragraph:"Bentornato Capo ecco qui le richieste"
                    },
                    request,
                    sessionId:session.id
            })
        }).
        catch(err=>{
            err.statusCode=500
            throw err
        })
        
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        return next(err)
    })
    
}

exports.postAccept=(req,res,next)=>{
    const {requestId,userId:userCf}=req.body
    Request.findByPk(requestId)
    .then(request=>{
        if(!request){
           return res.redirect("/")
        }
        request.viewed=true
        return request.save()
    })
    .then(()=>{
        return User.findByPk(userCf)
    })
    .then(user=>{
        if(!user){
            req.flash("fail","Errore durante la validazione")
            return res.redirect("/")
        }
        user.isConfirmed=true
        return user.save()
    })
    .then(()=>{
        req.flash("success","Validazione Confermata")
        res.redirect("/request")
    })
    .catch(err=>{
        const error= new Error("Errore nel Validare la richiesta")
        error.statusCode=500
        return next(error)
    })
}


exports.postDenied=(req,res,next)=>{
    const {requestId,userId:userCf}=req.body
    Request.findByPk(requestId)
    .then(request=>{
        if(!request){
           return res.redirect("/")
        }
        request.viewed=true
        return request.save()
    })
    .then(()=>{
        return User.findByPk(userCf)
    })
    .then(user=>{
        if(!user){
            req.flash("fail","Errore durante la validazione")
            return res.redirect("/")
        }
        user.isConfirmed=false
        return user.save()
    })
    .then(()=>{
        req.flash("success","Validazione Confermata")
        res.redirect("/request")
    })
    .catch(err=>{
        const error= new Error("Errore nel Declinare la richiesta")
        error.statusCode=500
        return next(error)
    })
}

exports.getAddMacchinetta=(req,res,next)=>{
    stripe.prices.create({
        currency:"eur",
        unit_amount:200,
        product_data:{
            name:"Donazione"
        }
    })
    .then(price=>{
        return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items:[{
                price:price.id,
                quantity:1
            }],
            success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
            cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",

        })
    })
    .then((session)=>{
        res.render("add-macchinetta",{
            PageTitle:"Add",
            pageContent:{
                title:"Nuova Macchinetta !",
                paragraph:"Grazie per il tuo contributo"
            },
            sessionId:session.id
        })
    })
    .catch(err=>{
        const error= new Error("Errore nel Declinare la richiesta")
        error.statusCode=500
        return next(error)
        })
    
}

exports.postAddMacchinetta=(req,res,next)=>{
    const {name,luogo,latitudine,longitudine,nomeComune}=req.body
    const posizione={
        type:"Point",
        coordinates:[parseFloat(latitudine),parseFloat(longitudine)]
    }

    Comune.findOne({where:{nome:nomeComune}})
    .then(comune=>{
        if(!comune){
            req.flash("fail","Errore nell'aggiungere la macchinetta")
            return res.redirect("/add-macchinetta")
        }
        return  Macchinette.create({
            nome:name,
            luogo,
            posizione:literal(`ST_GeomFromText('POINT(${posizione.coordinates[0]} ${posizione.coordinates[1]})',3857)`),
            tipo:"H24",
            ComuneId:comune.id
        }) 
    })
    .then(()=>{
        req.flash("success","Macchinetta aggiunta correttamente")
        res.redirect("/")
    })
    .catch((err)=>{
        const error= new Error("Errore nel Sistema")
        error.statusCode=500
        return next(error)
    })
}

exports.Donazione=(req,res,next)=>{
    stripe.prices.create({
        currency:"eur",
        unit_amount:200,
        product_data:{
            name:"Donazione"
        }
    })
    .then(price=>{
        return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items:[{
                price:price.id,
                quantity:1
            }],
            success_url:req.protocol+"://"+req.get("host")+"/donazione/successo",
            cancel_url:req.protocol+"://"+req.get("host")+"/donazione/fallita",

        })
    })
    .then(session=>{
        res.render()
    })
    .catch(err=>{
        const error= new Error("Errore nel Declinare la richiesta")
        error.statusCode=500
        return next(error)
        })
}