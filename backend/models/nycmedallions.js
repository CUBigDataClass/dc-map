const mongoose = require('mongoose')
const moment =  require('moment')

const NycLicMedals = mongoose.model('nyc_lic_medals',{
    date : {
        type:String,
        unique:true,
        required:true
    },
    medallions:{
        type:Array,
        required:true
    },
    hack_license:{
        type:Array,
        required:true
    },
    operational_medals:{
        type:Number,
        required:true
    },
    operational_licenses:{
        type:Number,
        required:true
    }
})

module.exports = NycLicMedals