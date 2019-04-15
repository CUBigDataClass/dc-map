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
      trackerFormisOpen: false
    }

    this.showTrackerFormCallback = this.showTrackerFormCallback.bind(this)
    this.handleTrackerFormClose = this.handleTrackerFormClose.bind(this)
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

  render() {

    return (
      <div style={{clear: "both"}}>

        <div className="firstColumn" >
          <Sidebar showTrackerFormCallback={this.showTrackerFormCallback} />
        </div>

        <div className="secondColumn">
          <MapMain />
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
