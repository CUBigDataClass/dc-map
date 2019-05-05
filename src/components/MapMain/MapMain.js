import React from 'react'
import DeckGL, {LineLayer, ArcLayer} from 'deck.gl'
import {StaticMap} from 'react-map-gl'
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2F1bmlsLWRocnV2IiwiYSI6ImNqdHA3djZhYTAxdmw0YXJ2Nm9nZWZpdTMifQ.i2khisdjFR-fPCZ421loYg';

// Initial viewport settings

const initialViewState = {
  longitude: -74.00712,
  latitude: 40.71455,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

class MapMain extends React.Component{

  constructor(props){
      super(props);
      this.state = {
        layers: [],
      }
  }

  componentWillReceiveProps (newProps){

    var data = newProps.mapData
    console.log(newProps)
    var layers = [
      new ArcLayer({
        id: 'arc-layer',
        data,
        getSourcePosition: d => [d.PULocationID_lon, d.PULocationID_lat],
        getTargetPosition: d => [d.DOLocationID_lon, d.DOLocationID_lat],
      })
    ]

    this.setState({layers: layers})

  }

  componentDidMount(){
    var data = [
    ]
    var layers = [
      new LineLayer({
        id: 'line-layer',
        data,
        getSourcePosition: d => [d.PULocationID_lat, d.PULocationID_lon],
        getTargetPosition: d => [d.DOLocationID_lat, d.DOLocationID_lon],
      })
    ]

    this.setState({layers: layers})
  }

  render(){
    return(

      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={this.state.layers}
      >
        <StaticMap mapboxApiAccessToken={
          MAPBOX_ACCESS_TOKEN
        } />
      </DeckGL>
    )
  }
}

export default MapMain
