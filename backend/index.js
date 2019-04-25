require('./db/mongoose/mongoose')

const NycGeoData = require('./models/nycgeodata')
const NycData = require('./models/nycdata')
const NycLicMedals = require('./models/nycmedallions')

const apiKey = require('./utils/api-key')
const apiUrls = require('./utils/api-url')
const helpers = require('./utils/helpers')

const express = require('express')
const moment = require('moment')
const request = require('request')
const random = require('random')

const app = express()
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server is up on Port '+port)
})


app.get('/getcountday/:date', async (req, res)=>{
    date = moment(req.params.date)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try {
        const count = await NycData[period].countDocuments({tpep_pickup_datetime:{$regex : ".*"+req.params.date+".*"}}, (error, result)=>{
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
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try {
        const count = await NycData[period].countDocuments({tpep_pickup_datetime:{$regex : ".*"+req.params.date+".*"}, PULocationID:req.params.pu_id, DOLocationID:req.params.du_id},(error, result)=>{
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

app.get('/getrandomtaxirides/:date', async (req, res)=>{
    const date = moment(req.params.date)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    const NycGeoDataModel = NycGeoData[period]
    try {
        NycLicMedals.find({date:req.params.date}).then((response)=>{
            const idx = random.int(min=0, max=response[0].operational_medals-1)
            const numPlate = response[0].medallions[idx]
            NycGeoData[period].find({
                ride_date:req.params.date,
                medallion: numPlate
            }).select({
                pickup_datetime: 1,
                dropoff_datetime: 1,
                passenger_count: 1,
                trip_time_in_secs: 1,
                pickup_longitude: 1,
                pickup_latitude: 1,
                dropoff_longitude: 1,
                dropoff_latitude: 1,
                _id:false
            }).sort('pickup_datetime').lean().then((rides)=>{
                helpers.getAllRides(rides, 0, (error, data, statusCode)=>{
                    if(error){
                        res.status(statusCode).send({
                            error:error,
                            msg:"An error occurred while Calling the API"
                        })
                    }else{
                        res.status(statusCode).send({
                            rides:data
                        })
                    }
                })
            }).catch((error)=>{
                res.status(500).send({
                    msg:'An error occurred while fetching ride information!',
                    error:error
                })
            })
        }).catch((error)=>{
            res.status(500).send({
                error:error,
                msg:"An error occured while fetching the rides for the day!"
            })
        })
    } catch (error) {
        res.send({
            msg : 'An error occurred!',
            error:error
        })
    }
})