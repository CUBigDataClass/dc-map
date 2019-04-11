const  waypointsURL = (from_long, from_lat, to_long, to_lat, api_key)=>{
    return 'https://api.mapbox.com/directions/v5/mapbox/driving/'+from_long+'%2C'+from_lat+'%3B'+to_long+'%2C'+to_lat+'.json?access_token='+api_key+'&overview=full&geometries=geojson'
}

module.exports = {
    waypointsURL:waypointsURL
}