require('./db/mongoose/mongoose')
const express = require('express')
const moment = require('moment')
const apiKey = require('./api-key')
const apiUrls = require('./api-url')
const request = require('request')

const NycGeoData = require('./models/nycgeodata')
const NycData = require('./models/nycdata')
const NycLicMedals = require('./modelS/nycmedallions.js')

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

app.get('/getrandomtaxirides/:date', async (req, res)=>{
    const _url = apiUrls.waypointsURL(req.params.from_long, req.params.from_lat, req.params.to_long, req.params.to_lat, apiKey.waypoints())
    const date = moment(req.params.date)
    const NycGeoDataModel = NycGeoData(date.format('YYYY'), date.format('MM'))
    const NycLicMedalsModel = NycLicMedals()
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try {
        const lic_medals = await NycLicMedalsModel.findOne({collection_name:'geo_yellow_tripdata_'+period})
        const idx = Math.floor(Math.random()*lic_medals.medallions.length)
        const rides_query = await NycGeoDataModel.find({
            medallion : "0BD7C8F5BA12B88E0B67BED28BEA73D8", 
            pickup_datetime:{$regex : ".*"+req.params.date+".*"}
        }).sort('pickup_datetime').select({medallion:1, pickup_datetime:1, dropoff_datetime:1, passenger_count:1, trip_time_in_secs:1, pickup_longitude:1,pickup_latitude:1,dropoff_longitude:1,dropoff_latitude:1, _id:false}).exec((error, response)=>{
            if(error){
                res.send({
                    error:error,
                    msg:"Issue while fetching hte rides for the taxi!"
                })
            }else{
                res.send({
                    msg:"Success!",
                    data:response
                })
            }
        })
    } catch (error) {
        res.send({
            msg : 'An error occurred!',
            error:error
        })
    }
})

app.get('/store_medals_lic/:date', async (req, res)=>{
    date = moment(req.params.date)
    model = NycGeoData(date.format('YYYY'), date.format('MM'))
    NycLicMedalsModel = NycLicMedals()
    try {
        const medals = await model.distinct('medallion', (error, responseMedals)=>{
            if(error){
                res.send({
                    msg :'An error occurred While reading the Collection!(medals)',
                    error:error
                })
            }else{
                const hack_lic = model.distinct('hack_license', async (error, responseLic)=>{
                    if(error){
                        res.send({
                            msg:"An error occurred while reading the Collection!(hack_lic)",
                            error:error
                        })
                    }else{
                        const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
                        const nyc_lic_medals = await new NycLicMedalsModel({
                            collection_name:'geo_yellow_tripdata_'+period,
                            medallions:responseMedals,
                            hack_license:responseLic
                        })
                        try{
                            await nyc_lic_medals.save()
                            res.status(201).send({
                                msg:"The aggregate was saved successfully!",
                            })
                        }catch(error){
                            res.status(500).send(error)
                        }
                    }
                })
            }
        })
    } catch (error) {
        res.send({
            msg:"An error occurred!"
        })
    }
})


