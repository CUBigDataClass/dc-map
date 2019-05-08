import React from 'react'
import DeckGL from '@deck.gl/react'
import {StaticMap, FlyToInterpolator } from 'react-map-gl'
import {TripsLayer} from '@deck.gl/geo-layers'
import {HexagonLayer} from '@deck.gl/aggregation-layers'

import {PathLayer} from '@deck.gl/layers'
import {utils} from '../../utils'
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2F1bmlsLWRocnV2IiwiYSI6ImNqdHA3djZhYTAxdmw0YXJ2Nm9nZWZpdTMifQ.i2khisdjFR-fPCZ421loYg';
// Initial viewport settings
// location_lookup : 263 = 262 in array
const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];
const elevationScale = {min: 1, max: 50};

var location_lookup = require('./location_id_lookup.json')

class MapMain extends React.Component{

  constructor(props){
      super(props);
      var ll = location_lookup.map((item) => {
        return item.lon_lat
      })

      this.state = {
        viewport: {
          longitude: -74.00712,
          latitude: 40.71455,
          zoom: 10,
          maxZoom: 16,
          pitch: 40.5,
          bearing: -27.396674584323023
        },
        location_lookup: ll,
        heatmapData: this.props.heatmapData,
        dayInLifeData: this.props.dayInLifeData,
        elevationScale: elevationScale.min,
        time: 0,
        currentTime: new Date()
      }

      this.startAnimationTimer = null;
      this.intervalTimer = null;

      this._startAnimate = this._startAnimate.bind(this)
      this._animateHeight = this._animateHeight.bind(this)
      this._animateTrips = this._animateTrips.bind(this)
  }


  componentDidMount() {
    this._animate()
  }


  static getDerivedStateFromProps (nextProps, prevState){

    if(
      nextProps.heatmapData !== prevState.heatmapData &&
      nextProps.dayInLifeData !== prevState.dayInLifeData
    ){
      var ll = nextProps.heatmapData.map((item) => {
        var start = item.PULocationID
        var end = item.DOLocationID
        return location_lookup[start-1].lon_lat
      })

      location_lookup.map((item) => {
        ll.push(item.lon_lat)
      })

      var startDate = new Date('2013-01-31')
      var endDate = new Date(startDate.getTime()+60*60*24*1000)
      return {
        dayInLifeData: nextProps.dayInLifeData,
        currentTime: startDate,
        endTime: endDate,
        location_lookup: ll,
        heatmapData: nextProps.heatmapData,
        elevationScale: elevationScale.min
      }

    } else if(nextProps.heatmapData !== prevState.heatmapData){
      console.log("only heatmap")
      var ll = nextProps.heatmapData.map((item) => {
        var start = item.PULocationID
        var end = item.DOLocationID
        return location_lookup[start-1].lon_lat
      })

      location_lookup.map((item) => {
        ll.push(item.lon_lat)
      })

      return {
        location_lookup: ll,
        heatmapData: nextProps.heatmapData,
        elevationScale: elevationScale.min
      }
    } else if (nextProps.dayInLifeData !== prevState.dayInLifeData){
      var startDate = new Date('2013-01-31')
      var endDate = new Date(startDate.getTime()+60*60*24*1000)
      return {
        dayInLifeData: nextProps.dayInLifeData,
        currentTime: startDate,
        endTime: endDate,
      }

    } else {
      return {}
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.heatmapData !== this.state.heatmapData){
      this._animate();
    }

    if (prevState.dayInLifeData !== this.state.dayInLifeData){
      window.clearInterval(this.animateTrips)
      this.animateTrips = window.setInterval(this._animateTrips, 1000)
    }
  }
  componentWillUnmount() {
    this._stopAnimate()
    clearInterval(this.animateTrips)
  }

  _animate(){
    this._stopAnimate();
    // wait 3 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1000);
  }


  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }


  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _animateTrips(){
    if(
      this.state.currentTime.getTime() < this.state.endTime.getTime()
    ){

      var currentTime = new Date(this.state.currentTime.getTime()+60*60*1000)
      this.setState({currentTime: currentTime})
    }else{
      window.clearInterval(this.animateTrips)
    }
  }

  _isTimeInterval(time, sTime, eTime){
    var start = utils.getDate(sTime)
    var end = utils.getDate(eTime)

    return time.getTime() >= start.getTime() && time.getTime() <= end.getTime()
  }


  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }


  _renderLayers(){
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange: colorRange,
        data: this.state.location_lookup,
        radiusScale: 20,
        getPosition: d => d,
        radius: 100,
        opacity: 1,
        elevationRange: [0, 100],
        elevationScale: this.state.elevationScale,
        extruded: true
      }),
      new PathLayer({
        id: 'path-layer',
        data: this.state.dayInLifeData,
        getPath: d => d.route.routes[0].geometry.coordinates,
        getColor: d => this._isTimeInterval(
          this.state.currentTime, d.pickup_datetime, d.dropoff_datetime
        ) ? [253, 128, 93]: [23, 184, 190],
        getWidth: d => 20,
        updateTriggers: {
          getColor: this.state.currentTime.getTime()
        }
      })
    ]
  }

  render(){
    return(

      <DeckGL
        viewState={this.state.viewport}
        onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
        controller={true}
        layers={this._renderLayers()}

      >
        <StaticMap
          reuseMaps
          mapStyle="mapbox://styles/mapbox/dark-v9"
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    )
  }
}

export default MapMain
