import React from 'react'

import {
  ButtonGroup,
  Button,
  Divider,
  Popover,
  Card,
  Elevation,
  Menu,
  Tag,
  Position,
  MenuItem,
  RangeSlider

} from "@blueprintjs/core"

import {requests} from '../../requests.js'

import './Sidebar.css'

class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      layersIsVisible: !true,
      filtersIsVisible: !false,
      addTrackerIsVisible: false,
      filters: []
    }


    this.availableFilters = [
      {text:"pickup-time",
        min:0, max:24,
        range: true, value:[0, 24],
        lstep:6,
        step:1
      },
      {text:"dropoff-time",
        min:0, max:24,
        range: true, value:[0, 24],
        lstep:6,
        step:1
      },
      {text:"trip-distance",
        min:0, max:1,
        range: true, value:[0, 1],
        lstep:1,
        step:0.1
      },
      {text:"passenger-count",
        min:0, max:6,
        range: true, value:[0, 6],
        lstep:2,
        step:1
      },
      {text:"pickup-lat",
        min:77, max:79,
        range: true, value:[77, 79],
        lstep:1,
        step:0.01
      },
      {text:"pickup-lon",
        min:77, max:79,
        range: true, value:[77, 79],
        lstep:1,
        step:0.01
      },
      {text:"dropoff-lat",
        min:77, max:79,
        range: true, value:[77, 79],
        lstep:1,
        step:0.01
      },
      {text:"dropoff-lon",
        min:77, max:79,
        range: true, value:[77, 79],
        lstep:1,
        step:0.01
      },
      {text:"fare-amt",
        min:0, max:500,
        range: true, value:[0, 500],
        lstep:100,
        step:10
      },
      {text:"tip-amt",
        min:0, max:500,
        range: true, value:[0, 500],
        lstep:100,
        step:10
      },
      {text:"total-amt",
        min:0, max:500,
        range: true, value:[0, 500],
        lstep:100,
        step:10
      }
    ];

    this.toggleLayers = this.toggleLayers.bind(this)
    this.handleTrackerAdd = this.handleTrackerAdd.bind(this)
    this.handleFilterItemClick = this.handleFilterItemClick.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleFilterRemove = this.handleFilterRemove.bind(this)
  }


  onUpdate = update => {
    this.setState({ update })
  }

  onChange = values => {
    this.setState({ values })
  }

  componentDidMount(){
    requests.getWaypoints(-73.989, 40.733, -74, 40.733)
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

  handleFilterItemClick(item) {
    let filters = this.state.filters;
    filters.push(this.availableFilters[item]);
    this.setState({filters: filters})
  }

  handleValueChange(idx, value) {
    let filters = this.state.filters;
    filters[idx].value = value;
    this.setState({filters: filters})
  };

  handleFilterRemove(idx) {
    let filters = this.state.filters;
    filters.splice(idx);
    this.setState({filters: filters})
  }
  render() {
    const filters = this.state.filters;
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
          className={
            this.state.layersIsVisible ? "tabContainer" : "tabContainer  tabVisible"
          }
        >

          <h3 className="bp3-dark bp3-heading">Layers</h3>
          <Button
            onClick={this.props.showTrackerFormCallback}
            intent="primary" className="rect" icon="plus"
            text="Add Tracker"
            />
          <Divider className="dividerBorder"/>

        </div>

        {
          // filters tab
        }
        <div
          className={this.state.layersIsVisible ? "tabContainer tabVisible" : "tabContainer "}
        >
          <h3 className="bp3-dark bp3-heading">Filters</h3>
          <Popover content={
            <Menu>
            {
              this.availableFilters.map((filter, idx) =>{
                return <MenuItem
                  icon="graph" text={filter.text}
                  onClick={()=>this.handleFilterItemClick(idx)}
                />
              })
            }
          </Menu>
          } position={Position.RIGHT_TOP}>
            <Button intent="primary" className="rect" icon="plus"  text="Add Filter"/>
          </Popover>
          <Divider className="dividerBorder"/>
          <div className="filter-item-contanier">
            {
              filters.map((filter, idx) => {
                  return(
                    <Card className="bp3-dark margin-top" interactive={true} elevation={Elevation.TWO}>
                      <Tag
                        className="float-left-top"
                        key={idx}
                        fill={true}
                        onRemove={()=>this.handleFilterRemove(idx)}
                        >
                        {filter.text}
                      </Tag>
                      <RangeSlider
                        className="range-slider-style"
                        min={filter.min}
                        max={filter.max}
                        stepSize={filter.step}
                        labelStepSize={filter.lstep}
                        value={filter.value}
                        vertical={false}
                        onChange={(value)=>this.handleValueChange(idx, value)}
                      />
                    </Card>
                  )

              })
            }
          </div>
        </div>

      </div>
    )
  }
}

export default Sidebar
