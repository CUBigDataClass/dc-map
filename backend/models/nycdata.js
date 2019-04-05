const mongoose = require('mongoose')
const moment = require('moment')

const NycData = (year, month)=>{
    const period = moment({year:year, month:month-1}).format('YYYY-MM')
    const NycDataModel = mongoose.model('yellow_tripdata_'+period,{
        tpep_pickup_datetime:{
            type:String
        },
        tpep_dropoff_datetime:{
            type:String
        },
        passenger_count:{
            type:Number
        },
        trip_distance:{
            type:Number
        },
        RatecodeID:{
            type:Number
        },
        store_and_fwd_flag:{
            type:String
        },
        PULocationID:{
            type:Number
        },
        DOLocationID:{
            type:Number
        },
        payment_type:{
            type:Number
        },
        fare_amount:{
            type:Number
        },
        extra:{
            type:Number
        },
        mta_tax:{
            type:Number
        },
        tip_amount:{
            type:Number
        },
        tolls_amount:{
            type:Number
        },
        improvement_surcharge:{
            type:Number
        },
        total_amount:{
            type:Number
        }
    })
    return NycDataModel
}

module.exports = NycData