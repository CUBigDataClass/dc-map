const mongoose = require('mongoose')
const process = require('process')

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useCreateIndex:true
})