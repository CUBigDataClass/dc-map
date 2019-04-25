const mongoose = require('mongoose')
const periods = require('./periods')['periodsNyc']

const NycDataSchema = {
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
        type:String
    },
    DOLocationID:{
        type:String
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
}

NycData = {}
periods.forEach(period => {
    NycData[period] = mongoose.model('yellow_tripdata_'+period, NycDataSchema)
})

module.exports = NycData