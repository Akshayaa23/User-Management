const jwt = require('jsonwebtoken');

const isAdmin = async (req, res, next) => {
    try {
        const token = await req.header('x-access-token')
        const decode = await jwt.verify(token, process.env.secret)
        req.user = decode
        if(decode.role === "admin"){
            next()
        }else{
            res.status(403).json({
                status : 403,
                message: 'Authorization failed ....'
            })
        }
    }
    catch (error) {
        res.json({
            message:error
        })
    }
}
const authJwt = {
    isAdmin
  };
  
module.exports = authJwt;