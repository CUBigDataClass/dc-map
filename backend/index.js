require('./db/mongoose/mongoose')
const express = require('express')
const moment = require('moment')
const NycData = require('./models/nycdata')

const app = express()
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server is up on Port '+port)
})


app.get('/getcountday/:date', async (req, res)=>{
    date = moment(req.params.date)
    model = NycData(date.format('YYYY'), date.format('MM'))
    try {
        const count = await model.countDocuments({tpep_pickup_datetime:{$regex : ".*"+req.params.date+".*"}}, (error, result)=>{
            if(result){
                res.status(201).send({
                    count:result,
                    date:date
                })
            }else{
                res.status(404).send({
                    error:"Data doesn't exist! "
                })
            }
        })
    } catch (error) {
        console.log('error occured')
        res.status(500).send(error)
    }
})

app.get('/getzonepickups/:date/:pu_id/:du_id', async (req, res)=>{
    date = moment(req.params.date)
    model = NycData(date.format('YYYY'), date.format('MM'))
    try {
        const count = await model.countDocuments({tpep_pickup_datetime:{$regex : ".*"+req.params.date+".*"}, PULocationID:req.params.pu_id, DOLocationID:req.params.du_id},(error, result)=>{
            if(!error){
                res.status(201).send({
                    count:result,
                    date:date
                })
            }else{
                res.status(404).send({
                    error:error,
                    message:"Data doesn't exist!"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error:'An Error occured!'
        })
    }
})