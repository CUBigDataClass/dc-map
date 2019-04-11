import React from 'react'
import {
  ButtonGroup,
  Button,
  Divider
} from "@blueprintjs/core";

import { DateInput } from "@blueprintjs/datetime";
import './Sidebar.css'
class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      layersIsVisible: true,
      filtersIsVisible: false,
      addTrackerIsVisible: false
    }

    this.toggleLayers = this.toggleLayers.bind(this)
    this.handleTrackerAdd = this.handleTrackerAdd.bind(this)
  }

  toggleLayers() {
    var layersIsVisible = !this.state.layersIsVisible
    this.setState({
      layersIsVisible: layersIsVisible,
      filtersIsVisible: !layersIsVisible,

    })
  }

  handleTrackerAdd() {
    var addTrackerVisibility = this.state.addTrackerIsVisible
    this.setState({
      addTrackerIsVisible: !addTrackerVisibility
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
        {
        // tracker tab
        }
        <div
          className={this.state.layersIsVisible ? "tabContainer" : "tabContainer  tabVisible"}
        >

          <h3 className="bp3-dark bp3-heading">Layers</h3>
          <Button onClick={this.props.showTrackerFormCallback} intent="primary" className="rect" icon="plus"  text="Add Tracker"/>
          <Divider className="dividerBorder"/>

        </div>

        {
          // filters tab
        }
        <div
          className={this.state.layersIsVisible ? "tabContainer tabVisible" : "tabContainer "}
        >
          <h3 className="bp3-dark bp3-heading">Filters</h3>

          <DateInput
              className="bp3-dark"
              formatDate={date => date.toLocaleString()}
              onChange={this.handleDateChange}
              parseDate={str => new Date(str)}
              placeholder={"M/D/YYYY"}
              value={this.state.date}
          />
          <DateInput
              className="bp3-dark"
              formatDate={date => date.toLocaleString()}
              onChange={this.handleDateChange}
              parseDate={str => new Date(str)}
              placeholder={"M/D/YYYY"}
              value={this.state.date}
          />
        </div>

      </div>
    )
  }
}

export default Sidebar
