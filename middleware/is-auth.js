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
                    return res.status(403).render("errorPage", {
                        PageTitle: "Denied",
                        pageContent: {
                            title: "Accesso Negato (403)",
                            paragraph: "Spiacenti, La tua richiesta deve essere ancora convalidata."
                        }
                    });
                } else {
                    next();
                }
            })
            .catch(err => console.log(err));
    }
}


exports.isAdmin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        return User.findByPk(req.session.user.cf)
            .then(user => {
                if (!user.superUser) {
                    return res.status(403).render("errorPage", {
                        PageTitle: "Denied",
                        pageContent: {
                            title: "Accesso Negato (403)",
                            paragraph: "Spiacenti, non hai i privilegi necessari. Contatta l'amministratore di sistema per ulteriori informazioni."
                        }
                    });
                } else {
                    next();
                }
            })
            .catch(err => console.log(err));
    }
};

exports.isNotAuth=(req,res,next)=>{
    if(req.session.isLoggedIn){
        return res.redirect("/")
    }
    next()
}