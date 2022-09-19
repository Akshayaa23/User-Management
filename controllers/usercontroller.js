const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async(req, res) => {
    try {
        let  email  = req.body.email;
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(200).json({ message: "User details already exists" })
        } else {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone, 
                password: hashedPass,
                status: req.body.status
            })
            let userData = {
                name:user.name, email: user.email, phone: user.phone, status:user.status
            }
            await user.save()
            res.status(200).json({ message: "User registered successfully", data: userData })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ errorMessage: error.message})
    }
}

const signin = async(req, res) => {
    try {
        var email = req.body.email
        var password = req.body.password
        const user = await User.findOne({ email: email })

        if (user) {
            const result = await bcrypt.compare(password, user.password)

            if (result) {
                let token = jwt.sign({ _id :user._id, name: user.name, email: user.email }, 'verySecretValue', { expiresIn: '10min' })
                const data = { name: user.name, email: user.email, token: token }

                res.status(200).json({ message: "Login successfully", data: data })
            } else {
                res.json({ errorMessage: " Password wrong !!" })
            }
        } else {
            res.json({ errorMessage: "User not found!!" })
        }
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message})
    }
}

const getUser = async(req, res) => {
    try {
        const token = await req.header('x-access-token')
        if (!token) return res.status(403).json({errorMessage: "Access Denied!! No Token Provided" })
        const decoded =  jwt.verify(token, 'verySecretValue')
        req.user = decoded
        let result = await User.findOne({_id: req.user})

        return res.header('x-access-token', token).status(200).json({ user: result })
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message || error })
    }
}

module.exports = { signup, signin, getUser}