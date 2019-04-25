const mongoose = require('mongoose')
const periods  = require('./periods')['periodsNycGeo']

var geoDataSchema = {
    medallion:{
        type:String
    },
    hack_license:{
        type:String
    },
    vendor_id:{
        type:String
    },
    rate_code:{
        type:Number
    },
    store_and_fwd_flag:{
        type:String
    },
    pickup_datetime:{
        type:String
    },
    dropoff_datetime:{
        type:String
    },
    passenger_count:{
        type:Number
    },
    trip_time_in_secs:{
        type:Number
    },
    trip_distance:{
        type:Number
    },
    pickup_longitude:{
        type:Number
    },
    pickup_latitude:{
        type:Number
    },
    dropoff_longitude:{
        type:Number
    },
    dropoff_latitude:{
        type:Number
    },
    ride_date:{
        type:String
    }
}

NycGeoData = {}
periods.forEach(period => {
    NycGeoData[period] = mongoose.model('geo_yellow_tripdata_'+period, geoDataSchema)
})

module.exports = NycGeoData