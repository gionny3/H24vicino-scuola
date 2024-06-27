const stripe=require("stripe")("sk_test_51PCNWJ04Be2YLbccJufR5x1yY6LdFFvyyYFtRyX01kn0jtBcUqJAuEmsIll9NuTWqjiiq4gLU0WP2E5KyzS7SgjH00vYFXBKJ9")

exports.get404=(req,res,next)=>{
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
        res.render("errorPage",{
            pageContent:{
                title:"Error 404",
                paragraph:"Pagina non trovata assicurarsi di aver inserito la route giusta, rivolgersi nel caso ai profili instagram"
            },
            PageTitle:"404",
            sessionId:session.id
        })
    })
    .catch(err=>console.log(err))
    
}

exports.get500=(req,res,next)=>{
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
        res.render("errorPage",{
            pageContent:{
                title:"Error 500",
                paragraph:"Errore Nostro! Ci dispiace per il disagio, non esitare a contattarci"
            },
            PageTitle:"500",
            sessionId:session.id
        })
    })
    .catch(err=>console.log(err))

}

