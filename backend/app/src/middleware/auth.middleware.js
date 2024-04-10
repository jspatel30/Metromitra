const jwt = require("jsonwebtoken")
const {SEC_KEY} = process.env

module.exports =  function(req,res,next){
   
    jwt.verify(req.headers.token,SEC_KEY,function(err,decoder){
        if(err)
        {
            res.json({"msg":"You are not Authorised to use this",rescode:"-9",data:""})
        }
        else
        {
            next();
        }
    })
}