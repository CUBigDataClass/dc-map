const mongoose = require('mongoose')
const moment = require('moment')

const NycData = (year, month)=>{
    const period = moment({year:year, month:month-1}).format('YYYY-MM')
    const NycDataModel = mongoose.model('yellow_tripdata_'+period,{

    })
    return NycDataModel
}

module.exports = NycData