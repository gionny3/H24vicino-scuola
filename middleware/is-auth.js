const User = require("../models/user")

exports.isAuth=(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect("/login")
    }
    next()
}

exports.isConfirmed=(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect("/login")
    }else{
        return User.findByPk(req.session.user.cf)
            .then(user => {
                if (!user.isConfirmed) {
                    throw new Error("Accesso Negato")
                } else {
                    next();
                }
            })
            .catch(err => {
                err.statusCode=403
                return next(err)
            });
    }
}


exports.isAdmin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        return User.findByPk(req.session.user.cf)
            .then(user => {
                if (!user.superUser) {
                    throw new Error("Accesso Negato")
                } else {
                    next();
                }
            })
            .catch(err => {
                err.statusCode=403
                return next(err)
            });    }
};

exports.isNotAuth=(req,res,next)=>{
    if(req.session.isLoggedIn){
        return res.redirect("/")
    }
    next()
}