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


module.exports = {
    getDatesFortheMonth:getDatesFortheMonth,
    getPeriod:getPeriod,
    getAllRides:getAllRides
}