const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const sendregisterMail = async (name,email,password,token) => {
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        service:'gmail',
        // secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    //point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };
    transporter.use('compile', hbs(handlebarOptions))

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to:email,
        subject:'Welcome User',
        template: 'email',//name of email handlebars
        context: {
            name:name,
            email:email,
            password:password
        }
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            console.log("Mail has been sent..",info.response)
        }
    })
}

const signup = async(req, res) => {
    try {
        let  email  = req.body.email;
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(200).json({ message: "User details already exists" })
        } else {
            //const hashedPass = await bcrypt.hash(req.body.password, 10)
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone, 
                password: req.body.password,
                status: req.body.status,
                role: req.body.role
            })
            const userDetails = await user.save()
            sendregisterMail(userDetails.name, userDetails.email, userDetails.password)

            let userData = {
                name:userDetails.name, email: userDetails.email, phone: userDetails.phone, status:userDetails.status,role:userDetails.role
            }
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
                let token = jwt.sign({ _id :user._id, name: user.name, email: user.email, role: user.role },process.env.secret, { expiresIn: '10min' })
                const data = { name: user.name, email: user.email, token: token, role:user.role }

                res.status(200).json({ message: "Login successfully", data: data })
            } else {
                res.json({ errorMessage: " Incorrect Password !!" })
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
        const decode = await jwt.verify(token, process.env.secret)
        req.user = decode
        let result = await User.findOne({_id: req.user})
        return res.header('x-access-token', token).status(200).json({ user: result })
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message || error })
    }
}

module.exports = { signup, signin, getUser}