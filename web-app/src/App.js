/// app.js
import React from 'react';
import DeckGL, {LineLayer} from 'deck.gl';
import {StaticMap} from 'react-map-gl';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2F1bmlsLWRocnV2IiwiYSI6ImNqdHA3djZhYTAxdmw0YXJ2Nm9nZWZpdTMifQ.i2khisdjFR-fPCZ421loYg';

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

class App extends React.Component {
  render() {
    const layers = [
      new LineLayer({id: 'line-layer', data})
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={
          MAPBOX_ACCESS_TOKEN
        } />
      </DeckGL>
    );
  }
}

export default App;
