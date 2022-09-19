const express = require('express')
const router = express.Router()

const userController = require('../controllers/usercontroller')
const validateUser = require('../validation/valid')

router.post('/register', validateUser.userSignUp,userController.signup)
router.post('/login',validateUser.userSignin,userController.signin)
router.get('/getUser', userController.getUser)

module.exports = router;