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
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.listen(port, ()=>{
    console.log('Server is up on Port '+port)
})


app.get('/getcountday/:fromdatetime/:todatetime', async (req, res, next)=>{
    const fromdatetime = req.params.fromdatetime
    const todatetime = req.params.todatetime
    const date = moment(req.params.fromdatetime)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    const ride_date = date.format('YYYY-MM-DD')
    try {
        NycData[period].aggregate([
            {$match:{ride_date:ride_date, tpep_pickup_datetime:{$gte:fromdatetime,$lt:todatetime}}},
            {$group :{_id : "$PULocationID", rides:{$sum:1}}},
            {$sort:{"_id":1}}
        ]).then((result)=>{
            res.status(201).send({
                msg:'Success!',
                results:result
            })
        }).catch((error)=>{
            res.status(500).send({
                msg:'An error occured!',
                error:error
            })
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post('/getrides', async (req, res) => {
    const agg_pipelines = helpers.buildAggregationQuery(req.body)
    const date = moment(req.body.date)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try{
        NycData[period].aggregate([
            {$match:agg_pipelines},
            // {$match:{$expr:{$ne : ["$PULocationID", "$DOLocationID"]}}},
            {$project:{
                _id:0,
                PULocationID : 1,
                DOLocationID : 1
            }}
        ]).then((result)=>{

            res.status(201).send({
                msg:'Success!',
                results:result
            })
        }).catch((error)=>{
            res.status(500).send({
                msg:'An error occured!',
                error:error
            })
        })
    }catch(error){
        res.status(500).send({
            error:error,
            msg:"An error has occurred!"
        })
    }
})

app.get('/getrideshistogram/:date', async (req, res)=>{
    const date = moment(req.body.date)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try{
        NycData[period].aggregate([
            {$match:{ride_date:req.params.date}},
            {$group:{_id:"$tpep_pickup_datetime_bin", count:{$sum:1}}},
            {$project:{_id:0, pickupdatetimebin:"$_id", count:1}}
        ]).then((results)=>{
            res.status(201).json({
                msg:"Success!",
                result:results
            })
        }).catch((error)=>{
            res.status(500).json({
                msg:"An Error occurred!",
                error:error
            })
        })
    }catch(error){
        res.send(500).json({
            msg:"An error occurred!",
            error:error
        })
    }
})

// app.get('/getallrides/:date/:hour', async (req, res)=>{
//     try {
//         NycGeoData.aggregate([
//             {$match:{
//                 ride_date:req.param.date, 
//                 tpep_pickup_datetime_bin:req.param.date+' '+req.param.hour,
//                 tpep_dropoff_datetime_bin:req.param.date+' '+req.param.hour
//             }},
//             {
//                 $project:{
//                     PULocationID_lat: 1, 
//                     PULocationID_lon: 1, 
//                     DOLocationID_lat:1, 
//                     DOLocationID_lon:1,
//                     tpep_pickup_datetime_bin:1,
//                     tpep_dropoff_datetime_bin:1,
                    
//                 }
//             }
//         ])

//     } catch (error) {
//         res.json({
//             msg : 'An error occurred!',
//             error:error
//         })
//     }
// })

app.get('/getzonepickups/:date/:pu_id/:du_id', async (req, res, next)=>{
    date = moment(req.params.date)
    const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
    try {
        const count = await NycData[period].countDocuments({tpep_pickup_datetime:{$regex : ".*"+req.params.date+".*"}, PULocationID:req.params.pu_id, DOLocationID:req.params.du_id},(error, result)=>{
            if(!error){
                res.status(201).json({
                    count:result,
                    date:date
                })
            }else{
                res.status(404).json({
                    error:error,
                    message:"Data doesn't exist!"
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            error:'An Error occured!'
        })
    }
})


app.get('/getwaypoints/:from_long/:from_lat/:to_long/:to_lat', async (req, res, next)=>{
    const _url = apiUrls.waypointsURL(req.params.from_long, req.params.from_lat, req.params.to_long, req.params.to_lat, apiKey.waypoints())
    try {
        request({url:_url, json:true}, (error, response)=>{
            if(error){
                res.status(500).json({
                    message:'Service Unavailable'
                })
            }else if(response.body.code==400){
                res.status(400).json({
                    message:'Invalid Arguments provided!'
                })
            }else{
                res.status(201).json({
                    route:response.body
                })
            }
        })
    } catch (e) {
        res.status(500).json({
            error: 'An error occuered while fetching waypoints!'
        })
    }
})

app.get('/getrandomtaxirides/:date', async (req, res, next)=>{
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
                        res.status(statusCode).json({
                            error:error,
                            msg:"An error occurred while Calling the API"
                        })
                    }else{
                        res.status(statusCode).json({
                            rides:data
                        })
                    }
                })
            }).catch((error)=>{
                res.status(500).json({
                    msg:'An error occurred while fetching ride information!',
                    error:error
                })
            })
        }).catch((error)=>{
            res.status(500).json({
                error:error,
                msg:"An error occured while fetching the rides for the day!"
            })
        })
    } catch (error) {
        res.json({
            msg : 'An error occurred!',
            error:error
        })
    }
})


app.get('/operationalcabs/:date', async(req, res, next)=>{
    try{
      date = moment(req.params.date)
      const period = moment({year:date.format('YYYY'), month:date.format('MM')-1}).format('YYYY-MM')
      NycLicMedals.find({date:{
          $regex : ".*"+period+".*"
      }}).select({
          operational_licenses:1,
          operational_medals:1,
          date:1,
          _id:false
      }).sort('date').lean().then((results)=>{
          res.status(201).json({
              msg:'Success!',
              period:period,
              results:results
          })
      }).catch((error)=>{
          res.status(500).json({
              msg:"The request failed! Cannot read hte database!",
              error:error
          })
      })
    }catch(error){
      res.status(500).json({
          msg:'The request failed! Cannot read the database',
          error:error
      })
    }
})
