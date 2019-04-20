const process = require('process')

const waypoints = ()=>{
    return process.env.API_KEY_MAPBOX
}

module.exports = {
    waypoints:waypoints
}