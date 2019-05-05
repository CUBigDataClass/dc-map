/// app.js
import React from 'react';
import MapMain from './components/MapMain'
import Sidebar from './components/Sidebar'
import {
  Overlay,
  Classes,
  Card, Button
} from "@blueprintjs/core";

import './App.css'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      trackerFormisOpen: false,
      mapData: []
    }

    this.showTrackerFormCallback = this.showTrackerFormCallback.bind(this)
    this.handleTrackerFormClose = this.handleTrackerFormClose.bind(this)
    this.updateMapData = this.updateMapData.bind(this)

  }

  showTrackerFormCallback() {
    var _trackerFormisOpen = this.state.trackerFormisOpen
    this.setState({
      trackerFormisOpen: !_trackerFormisOpen
    })
  }

  handleTrackerFormClose() {
    this.setState({
      trackerFormisOpen: false
    })
  }

  updateMapData(type, query){
    console.log(query)

    var parent = this

    fetch('https://dc-map-5214.appspot.com/getridestats', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: query,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      parent.setState({mapData: responseJson.results})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {

    return (
      <div style={{clear: "both"}}>

        <div className="firstColumn" >
          <Sidebar
            showTrackerFormCallback={this.showTrackerFormCallback}
            updateMapDataCallback={(type, query) => this.updateMapData(type, query)}
          />
        </div>

        <div className="secondColumn">
          <MapMain mapData={this.state.mapData} />
        </div>

        <Overlay
          isOpen={this.state.trackerFormisOpen}
          className={Classes.OVERLAY_SCROLL_CONTAINER}
          canOutsideClickClose={true}
          usePortal={true}
          onClose={this.handleTrackerFormClose}
        >
          <Card
            elevation={4}
            interactive={true}
            className="centerOverlay bp3-dark"
          >
            <h5><a href="http://google.com">Card heading</a></h5>
            <p>Card content</p>
            <Button>Submit</Button>
          </Card>
        </Overlay>
      </div>
    );
  }
}

export default App;
