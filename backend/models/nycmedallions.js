const mongoose = require('mongoose')
const moment =  require('moment')

const NycLicMedals = ()=>{
    const NycGeoDataModel = mongoose.model('nyc_lic_medals',{
        collection_name : {
            type:String,
            unique:true
        },
        medallions:{
            type:Array
        },
        hack_license:{
            type:Array
        }
    })
    return NycGeoDataModel
}

module.exports = NycLicMedals