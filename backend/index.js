require('./db/mongoose/mongoose')
const express = require('express')
const NycData = require('./models/nycdata')

const app = express()

const model = NycData('2018','6')
model.countDocuments({PULocationID:'230'}, (err, count)=> {
    console.log('there are %d jungle adventures', count);
});
