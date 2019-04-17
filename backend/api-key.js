const process = require('process')

const waypoints = ()=>{
    console.log(process.env)
    return process.env.API_KEY_MAPBOX
}

module.exports = {
    waypoints:waypoints
}