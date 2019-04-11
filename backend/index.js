require('./db/mongoose/mongoose')
const express = require('express')
const moment = require('moment')
const NycData = require('./models/nycdata')
const apiKey = require('./api-key')
const apiUrls = require('./api-url')
const request = require('request')

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


app.get('/getwaypoints/:from_long/:from_lat/:to_long/:to_lat', async (req, res)=>{
    const _url = apiUrls.waypointsURL(req.params.from_long, req.params.from_lat, req.params.to_long, req.params.to_lat, apiKey.waypoints())
    try {
        request({url:_url, json:true}, (error, response)=>{
            if(error){
                res.status(500).send({
                    message:'Service Unavailable'
                })
            }else if(response.body.code==400){
                res.status(400).send({
                    message:'Invalid Arguments provided!'
                })
            }else{
                res.status(400).send({
                    route:response.body
                })
            }
        })    
    } catch (error) {
        res.status(500).send({
            error: 'An error occuered!'
        })
    }
})