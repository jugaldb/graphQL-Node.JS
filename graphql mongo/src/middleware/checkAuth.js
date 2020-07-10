const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports =(req,res,next)=>
{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(' ')[1]
    if(!token||token ===''){
        req.isAuth = false
        return next()
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SeCRET)
    }catch{
        req.isAuth = false
        return next()
    }
    if(!decoded){
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.user = decoded.user
    next()
}
