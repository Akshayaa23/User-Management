const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')

mongoose.connect('mongodb+srv://Akshaya:Akshaya.123@cluster0.14huv.mongodb.net/testdb?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Database Connection Established!')
})

const app = express();
//app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 7000

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
app.use('/api', userRoute)