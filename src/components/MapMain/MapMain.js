import React from 'react'
import DeckGL, { HexagonLayer, TripsLayer} from 'deck.gl'
import {StaticMap} from 'react-map-gl'
import GL from '@luma.gl/constants';
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2F1bmlsLWRocnV2IiwiYSI6ImNqdHA3djZhYTAxdmw0YXJ2Nm9nZWZpdTMifQ.i2khisdjFR-fPCZ421loYg';
// Initial viewport settings
// location_lookup : 263 = 262 in array
const initialViewState = {
  longitude: -74.00712,
  latitude: 40.71455,
  zoom: 10,
  maxZoom: 16,
  pitch: 40.5,
  bearing: -27.396674584323023
};
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
        location_lookup: ll,
        mapData: [],
        elevationScale: elevationScale.min
      }

      this._reset = this._reset.bind(this)


      this.startAnimationTimer = null;
      this.intervalTimer = null;

      this._startAnimate = this._startAnimate.bind(this);
      this._animateHeight = this._animateHeight.bind(this);
  }


  componentDidMount() {
    this._animate();
  }


  componentWillReceiveProps (newProps){

    var ll = newProps.mapData.map((item) => {
      var start = item.PULocationID
      var end = item.DOLocationID
      return location_lookup[start-1].lon_lat
    })

    location_lookup.map((item) => {
      ll.push(item.lon_lat)
    })

    this.setState({
      location_lookup: ll,
      mapData: newProps.mapData,
      elevationScale: elevationScale.min
    })

    this._animate();
  }


  componentWillUnmount() {
    this._stopAnimate();
  }


  _reset(location_lookup){
    var ll = location_lookup

    for(var i = 0; i < ll.length; i++){
      ll[i].count = 0;
    }
    return ll;
  }


  _animate(){
    this._stopAnimate();
    // wait 3 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 100);
  }


  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }


  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
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
    ]
  }

  render(){
    return(

      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={this._renderLayers()}
        parameters={{
          blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
          blendEquation: GL.FUNC_ADD
        }}
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
