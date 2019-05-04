const moment = require('moment')
const apiUrls = require('./api-url')
const apiKey = require('./api-key')
const request = require('request')

const getDatesFortheMonth = (period) =>{
    var dates = [period.format('YYYY-MM-DD')]
    var i = 0
    var currentMonth = period.format('MM')
    var newDate = period.add(1, 'days')
    while (newDate.format('MM') == currentMonth) {
        dates.push(newDate.format('YYYY-MM-DD'))
        newData = period.add(1, 'days')
    }
    return dates
}

const getPeriod = (year, month) => {
    const period = moment({year:year, month:month-1}).format('YYYY-MM')
    return period
}


const getAllRides = (rides, idx, callback)=>{
    const _url = apiUrls.waypointsURL(rides[idx].pickup_longitude, rides[idx].pickup_latitude, rides[idx].dropoff_longitude, rides[idx].dropoff_latitude, apiKey.waypoints())
    request({url:_url, json:true}, (error, response)=>{
        if(error){
            callback(error, undefined, 500)
        }else if(idx==rides.length-1){
            rides[idx].route = response.body
            callback(undefined, rides, 201)            
        }else{
            rides[idx].route = response.body
            getAllRides(rides, idx+1, callback)
        }
    })
}

const buildAggregationQuery = (params)=>{
        // "pickup-time"
        // "dropoff-time"
        // "trip-distance"
        // "passenger-count"
        // "fare-amt"
        // "tip-amt"
        // "total-amt"

        // { "_id" : ObjectId("5ccc809e7d715d7d915a959a"), "" : 0, "VendorID" : 1, "tpep_pickup_datetime
        // " : "2018-01-01 00:21:05", "tpep_dropoff_datetime" : "2018-01-01 00:24:23", "passenger_count"
        // : 1, "trip_distance" : 0.5, "RatecodeID" : 1, "store_and_fwd_flag" : "N", "PULocationID" : 4
        // 1, "DOLocationID" : 24, "payment_type" : 2, "fare_amount" : 4.5, "extra" : 0.5, "mta_tax" : 0
        // .5, "tip_amount" : 0, "tolls_amount" : 0, "improvement_surcharge" : 0.3, "total_amount" : 5.8
        // , "PULocationID_lat" : 40.804334, "PULocationID_lon" : -73.95129200000002, "DOLocationID_lat"
        // : 40.80197, "DOLocationID_lon" : -73.96548, "tpep_pickup_datetime_bin" : "2018-01-01 0", "tp
        // ep_dropoff_datetime_bin" : "2018-01-01 0", "trip_distance_bin" : 1, "fare_amount_bin" : 5, "t
        // ip_amount_bin" : 1, "total_amount_bin" : 7 }

        // {$match:{ride_date:ride_date, tpep_pickup_datetime:{$gte:fromdatetime,$lt:todatetime}}}
    var queries = {}
    const keys = Object.keys(params)
    if(keys.includes("pickup-time")){
        queries["tpep_pickup_datetime_bin"] = {$gte:params.date+' '+params["pickup-time"].from,$lt:params.date+' '+params["pickup-time"].to}
    }
    if(keys.includes("dropoff-time")){
        queries["tpep_dropoff_datetime_bin"] = {$gte:params.date+' '+params["dropoff-time"].from,$lt:params.date+' '+params["dropoff-time"].to}
    }
    if(keys.includes("trip-distance")){
        queries["trip_distance_bin"] = {$gte:params["trip-distance"].from, $lt:params["trip-distance"].to}
    }
    if(keys.includes("passenger-count")){
        queries["passenger_count"] = {$gte:params["passenger-count"].from, $lt:params["passenger-count"].to}
    }
    if(keys.includes("fare-amt")){
        queries["fare_amount_bin"] = {$gte:params["fare-amt"].from, $lt:params["fare-amt"].to}
    }
    if(keys.includes("tip-amt")){
        queries["tip_amount_bin"] = {$gte:params["tip-amt"].from, $lt:params["tip-amt"].to}
    }
    if(keys.includes("total-amt")){
        queries["total_amount_bin"] = {$gte:params["total-amt"].from, $lt:params["total-amt"].to}
    }
    if(keys.includes("date")){
        queries["ride_date"] = params["date"]
    }
    
    return queries
}


module.exports = {
    getDatesFortheMonth:getDatesFortheMonth,
    getPeriod:getPeriod,
    getAllRides:getAllRides,
    buildAggregationQuery:buildAggregationQuery
}