const mongoose = require('mongoose')
const process = require('process')
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useCreateIndex:true
})