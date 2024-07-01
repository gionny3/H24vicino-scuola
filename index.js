const bodyParser = require("body-parser")
const User=require("./models/user")
const express=require("express")
const https=require("https")
const flash=require("connect-flash")
const {fn,col}=require("sequelize")
const session=require("express-session")
const myDB=require("./databases/database")
const MySqlStore=require("express-mysql-session")(session)
const AuthRoute=require("./routes/auth")
const MainRoute=require("./routes/main")
const compression=require("compression")
const path=require("path")
const Comune=require("./models/comune")
const Request=require("./models/request")
const Macchinette = require("./models/macchinette")
const fs=require("fs")
const helmet=require("helmet")
const cors=require("cors")
const morgan=require("morgan")


const fileName=path.join(__dirname,"nodemon.json")
const file=fs.readFileSync(fileName,"utf-8")

const stripe=require("stripe")(process.env.STRIPE_KEY)
const app=express()
app.set("view engine","ejs");
app.set("views", "src/views")


const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME
};
const privateKey= fs.readFileSync("server.key")
const certificate =fs.readFileSync("-server.cert")
const accessLogFile=fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})
const listSite=["https://localhost:3002",`https://${process.env.IP_ADDRESS}:49200`,"https://js.stripe.com/v3","https://m.stripe.com/6"]


const sessionStore=new MySqlStore(options);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SECRET_KEY,
  resave:false,
  saveUninitialized:false,
  store:sessionStore
}))

app.use((req,res,next)=>{
  if(!req.session.user){
    return next()
  }
  User.findByPk(req.session.user.cf)
  .then(user=>{
    req.user=user
    next()
  })
  .catch(err=>console.log(err))
})


app.use((req,res,next)=>{
  res.locals.isAuth=req.session.isLoggedIn
  next()
})

const corseOption={
    origin: (origin,callback)=>{
        if(listSite.indexOf(origin)!==-1 || !origin){
          callback(null,true)
        }else{
          callback(new Error("Not allowed"))
        }
      },
      methods: '*',
      optionsSuccessStatus: 204
  
}
app.use(cors({
  origin: '*',
  methods: '*'
}))


app.use(flash())
Comune.hasMany(Macchinette)
Macchinette.belongsTo(Comune)
User.hasOne(Request)
Request.belongsTo(User)




app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(compression())
app.use(morgan("combined",{stream:accessLogFile}))


app.use(MainRoute.MainRoutes)
app.use(AuthRoute.AuthRoutes)

app.use((req,res,next)=>{
  const status=404
  const message="Pagina non trovata"
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
  res.status(status).render("errorPage",{
    PageTitle:status,
    pageContent:{
      title:`Errore ${status}`,
      paragraph:message
    },
    sessionId:session.id
  })
})
.catch(err=>console.log(err))
  
})

app.use((error,req,res,next)=>{
  console.log(error)
  const status=error.statusCode||500
  const message=error.message
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
  res.status(status).render("errorPage",{
    PageTitle:status,
    pageContent:{
      title:`Errore ${status}`,
      paragraph:message
    },
    sessionId:session.id
  })
})
.catch(err=>console.log(err))
  
})


sessionStore.onReady()
.then(()=>{
  return myDB.sync()
})
.then(result=>{
    return Comune.findByPk(1)
})
.then(comune=>{
    return Macchinette.findByPk(1)
})
.then(macchinette=>{
    
        https.createServer({cert:certificate,key:privateKey},app).listen(process.env.PORT,()=>{
            console.log("in ascolto");
        });
        console.log("riuscito")
    
})
.then(macchinette=>{
    return Macchinette.findAll({
        attributes:[
            [fn('ST_AsText', col('posizione')), 'posizione_text'],
        ]
    })
})
.then(macchinette=>{
})
.catch(err=>console.log(err))

