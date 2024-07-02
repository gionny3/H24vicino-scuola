const { Sequelize,fn ,col,literal} = require("sequelize")
const Comune = require("../models/comune")
const Macchinette = require("../models/macchinette")
const puntoInAreaCircolare = require("../util/distance_fn")
const stripe=require("stripe")(process.env.STRIPE_KEY)



exports.getIndex=(req,res,next)=>{
    const successMessage=req.flash("success")
    const failedMessage=req.flash("fail")
    Macchinette.findAll({
        limit:5,
        include:[{
            model:Comune,
            attributes:["nome"]
        }]
    })
    .then(result=>{
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
            res.render("index",{
                pageContent:{
                    title:"Distributori H24 vicino a te!",
                    paragraph:"Siamo due ragazzi che hanno iniziato questo progetto per tutte le persone che stanno cercando Distributori H24 intorno a loro, perfavore aiutateci a migliorare lasciando feedback o riportando i bug"
                },
                PageTitle:"H24",
                successMessage,
                failedMessage,
                error:null,
                data:result,
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


exports.postMain=(req,res,next)=>{
    const latPos=req.body.latitude
    const lonPos=req.body.longitude
    const Nresult=+req.body.Nresult
    const range=+req.body.range
    Macchinette.findAll({
        limit:Nresult,
        attributes:{
            include:[fn("ST_AsText",col("posizione"))]
        },
        include:[{
            model:Comune,
            attributes:["nome"]
        }],
        order:[
            [fn("ST_Distance",literal(`ST_GeomFromText("POINT(${latPos} ${lonPos})", 3857)`),col("posizione")),"ASC"]
        ]
    })
    .then(result=>{
        const goodResult=result.map(row=>{
            const lat1=row.posizione.coordinates[0]
            const lon1=row.posizione.coordinates[1]
            let isIn=puntoInAreaCircolare([lat1,lon1],[latPos,lonPos],range)
            if(isIn){
                return row
            }
            
        })
        res.json(goodResult)
    })
    .catch(err=>{
        const error= new Error("Errore nell' aggiornare i dati")
        error.httpStatusCode=500
        return next(error)
    })
    

}

// exports.getTest=(req,res,next)=>{
//     res.render("test",{
//         PageTitle:"Sign Up",
//         LoginMode:false,
//         errorMessage:null,
//         pageContent:{
//             title:"Entra nel Team!",
//             paragraph:"Il Team ha bisogno del tuo aiuto, ti aspettiamo! Per entrare bisogna essere accettati, all'invio del modulo verranno inviate le informazioni da te inserite e la tua richiesta sarà lavorata"
//         }
//     })
    
// }

