const mongoose = require('mongoose')
const moment =  require('moment')

const NycGeoData = (year, month)=>{
    const period = moment({year:year, month:month-1}).format('YYYY-MM')
    const NycGeoDataModel = mongoose.model('geo_yellow_tripdata_'+period,{
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
            type:String
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
            type:String
        },
        trip_time_in_secs:{
            type:String
        },
        trip_distance:{
            type:String
        },
        pickup_longitude:{
            type:String
        },
        pickup_latitude:{
            type:String
        },
        dropoff_longitude:{
            type:String
        },
        dropoff_latitude:{
            type:String
        }
    })
    return NycGeoDataModel
}

module.exports = NycGeoData