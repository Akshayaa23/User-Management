const express = require('express')
const router = express.Router()

const userController = require('../controllers/usercontroller')
const validateUser = require('../validation/valid')
const authJwt= require('../middleware/authJwt')

router.post('/register', validateUser.userSignUp,authJwt.isAdmin,userController.signup)
router.post('/login',validateUser.userSignin,userController.signin)
router.get('/getUser', authJwt.isAdmin,userController.getUser)

module.exports = router;