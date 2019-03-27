import React from 'react'
import {
  Tab,
  Tabs,
  ButtonGroup,
  Button,
  AnchorButton
} from "@blueprintjs/core";

import './Sidebar.css'

class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      layersIsVisible: true,
      filtersIsVisible: false
    }

    this.toggleLayers = this.toggleLayers.bind(this)
  }

  toggleLayers() {
    var layersIsVisible = !this.state.layersIsVisible
    this.setState({
      layersIsVisible: layersIsVisible,
      filtersIsVisible: !layersIsVisible,

    })
  }
  render() {
    return (
      <div className="Sidebar">
        <div
          style={{
            clear:"both",
            height:"50px",
            width:"100%"

          }}
          className="tabButtonContainer"
        >
          <ButtonGroup minimal fill>
            <Button onClick={this.toggleLayers} icon="layers" />
            <Button onClick={this.toggleLayers} icon="filter" />
          </ButtonGroup>
        </div>
        <div
          className={this.state.layersIsVisible ? "tabContainer" : "tabContainer  tabVisible"}
        >
          <h1 class="bp3-dark bp3-heading">Layers</h1>
        </div>


        <div
          className={this.state.layersIsVisible ? "tabContainer tabVisible" : "tabContainer "}
        >
          <h1 class="bp3-dark bp3-heading">Filters</h1>
        </div>

      </div>
    )
  }
}

export default Sidebar
