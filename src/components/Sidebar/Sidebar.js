import React from 'react'
import {
  BarChart,
  Bar,
  Cell
} from 'recharts'

import {
  ButtonGroup,
  Button,
  Divider,
  Popover,
  Card,
  Elevation,
  Menu,
  Tag,
  Classes,
  Position,
  Intent,
  MenuItem,
  RangeSlider

} from "@blueprintjs/core"
import { DatePicker, DateInput } from "@blueprintjs/datetime";
import moment from "moment";
import './Sidebar.css'

import {requests} from '../../requests'
import {utils} from '../../utils'

const FORMAT_TIME = "dddd, LL LT";

class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      layersIsVisible: !false,
      filtersIsVisible: !true,
      addTrackerIsVisible: false,
      selectedDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      filters: [],
      currentDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      disableDatePicker:false,
      activeHistogramIndex: 0,
      hourlyStats: [{pickupdatetimebin:"2018-01-01 00", count:"0"}]
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
        min:0, max:50,
        range: true, value:[0, 1],
        lstep:25,
        step:1
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

    this._toggleLayers = this._toggleLayers.bind(this)
    this._handleTrackerAdd = this._handleTrackerAdd.bind(this)
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this)
    this._handleValueChange = this._handleValueChange.bind(this)
    this._handleFilterRemove = this._handleFilterRemove.bind(this)
    this._incrementHour = this._incrementHour.bind(this)
    this._decrementHour = this._decrementHour.bind(this)
    this._visualizePathsByHour = this._visualizePathsByHour.bind(this)
    this._startVisualization = this._startVisualization.bind(this)
    this._handleBarClick = this._handleBarClick.bind(this)
  }


  onUpdate = update => {
    this.setState({ update })
  }

  onChange = values => {
    this.setState({ values })
  }

  componentDidMount(){
    var parent = this

    fetch('https://dc-map-5214.appspot.com/getrideshistogram/'+ utils.getDateString(this.state.currentDate), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var data = responseJson.result
      data.sort((a, b)  => {
        var ka = Number(a.pickupdatetimebin.split(" ")[1])
        var kb = Number(b.pickupdatetimebin.split(" ")[1])
        if(ka < kb) return -1;
        if(ka > kb) return 1;
        return 0;
      })

      parent.setState({hourlyStats: data})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  _handleBarClick(data, index) {
  	this.setState({
    	activeHistogramIndex: index,
    })
  }

  _toggleLayers() {
    var layersIsVisible = !this.state.layersIsVisible
    this.setState({
      layersIsVisible: layersIsVisible,
      filtersIsVisible: !layersIsVisible,
    })
  }

  _handleTrackerAdd() {
    var addTrackerVisibility = this.state.addTrackerIsVisible
    this.setState({
      addTrackerIsVisible: !addTrackerVisibility
    })
  }

  _handleFilterItemClick(item) {
    let filters = this.state.filters
    filters.push(this.availableFilters[item])
    this.setState({filters: filters})
  }

  _handleFilterRemove(idx) {
    let filters = this.state.filters
    filters.splice(idx, 1)
    console.log(filters)
    this.setState({filters: filters})
  }

  _handleValueChange(idx, value) {
    let filters = this.state.filters
    filters[idx].value = value
    this.props.updateMapDataCallback(2, filters)

    this.setState({filters: filters})
  };

  _startVisualization(){
    if (this.state.disableDatePicker){
      window.alert("wait for current one to finish")
      return
    }
    var latency = 5 // seconds

    let newDate = this.state.currentDate.setHours(0)

    this.setState({disableDatePicker:true, currentDate: new Date(newDate), activeHistogramIndex: 0})

    this.vizInterval = setInterval(this._visualizePathsByHour, 1000 * latency)
  }

  _visualizePathsByHour(){

    if( this.state.currentDate.getHours() - this.state.selectedDate.getHours() === 24 ){
      clearInterval(this.vizInterval)
      this.setState({disableDatePicker:false})
      return
    }

    var query = JSON.stringify({
      "date":"2018-02-01",
      "pickup-time":{
        "from": this.state.currentDate.getHours(),
        "to": this.state.currentDate.getHours() + 1
      }
    })

    this.props.updateMapDataCallback(1, query)

    let newDate = this.state.currentDate.setHours(
      this.state.currentDate.getHours() + 1
    )
    newDate = new Date(newDate)
    this.setState({currentDate: newDate, activeHistogramIndex: newDate.getHours()})
  }

  _handleDateChange(date: Date) {
    if (this.state.disableDatePicker){
      window.alert("wait for current one to finish")
      return
    }
    fetch('https://dc-map-5214.appspot.com/getrideshistogram/'+ utils.getDateString(date), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.result.sort((a, b)  => {
        var ka = Number(a.pickupdatetimebin.split(" ")[1])
        var kb = Number(b.pickupdatetimebin.split(" ")[1])
        if(ka < kb) return -1;
        if(ka > kb) return 1;
        return 0;
      })
      this.setState({ selectedDate: date, currentDate: date, hourlyStats: responseJson.result })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  _incrementHour(){
    var query = JSON.stringify({
      "date":"2018-02-01",
      "pickup-time":{
        "from": this.state.currentDate.getHours(),
        "to": this.state.currentDate.getHours()+1
      }
    })

    let newDate = this.state.currentDate.setHours(
      this.state.currentDate.getHours() + 1
    )

    this.props.updateMapDataCallback(1, query)

    this.setState({currentDate: new Date(newDate)})

  }

  _decrementHour(){
    var query = JSON.stringify({
      "date":"2018-02-01",
      "pickup-time":{
        "from": this.state.currentDate.getHours(),
        "to": this.state.currentDate.getHours() - 1
      }
    })


    let newDate = this.state.currentDate.setHours(
      this.state.currentDate.getHours() - 1
    )

    this.props.updateMapDataCallback(1, query)

    this.setState({currentDate: new Date(newDate)})
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
          <ButtonGroup className="bp3-dark" minimal fill>
            <Button onClick={this._toggleLayers} icon="presentation"/>
            <Button onClick={this._toggleLayers} icon="filter" />
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

          <h3 className="bp3-dark bp3-heading">Visualization</h3>

          <Divider className="dividerBorder"/>
          <br/>
          <div>
            <DatePicker
              className={Classes.ELEVATION_1}
              onChange={(newDate) => this._handleDateChange(newDate)}
              value={this.state.currentDate}
              />
            <br/>
            <Tag
              className="current-time-tag"
              large={true}
              fill={true}
            >
              {
                moment(this.state.currentDate).format(FORMAT_TIME)
              }
            </Tag>
            <br/>
            <ButtonGroup fill={true}>
                <Button
                  disabled={this.state.disableDatePicker}
                  onClick={()=>this._decrementHour()}
                  icon="chevron-backward"
                />
                <Button
                  disabled={this.state.disableDatePicker}
                  onClick={()=>this._startVisualization()}
                  icon="play"
                />
                <Button
                  disabled={this.state.disableDatePicker}
                  onClick={()=>this._incrementHour()}
                  icon="chevron-forward"
                />
            </ButtonGroup>
            <br/>
            <Divider className="dividerBorder"/>
            <BarChart
              width={230} height={100}
              data={this.state.hourlyStats}>
              <Bar onClick={this._handleBarClick} dataKey="count">
                {
                  this.state.hourlyStats.map((entry, index) => (
                    <Cell
                      cursor="pointer"
                      fill={
                        index === this.state.activeHistogramIndex ? '#1fbad6' : '#6a7485'
                      }
                      key={`cell-${index}`}
                    />
                  ))

                }
              </Bar>
            </BarChart>
            <br/>
            <Tag
              className="current-time-tag"
              large={true}
              intent={Intent.PRIMARY}
              fill={true}
              >
              {
                `${
                  this.state.hourlyStats[this.state.activeHistogramIndex].pickupdatetimebin
                }: ${
                  this.state.hourlyStats[this.state.activeHistogramIndex].count
                }`
              }
            </Tag>
          </div>
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
                  key={"menu"+idx}
                  icon="graph" text={filter.text}
                  onClick={()=>this._handleFilterItemClick(idx)}
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
                    <Card key={idx} className="bp3-dark margin-top" interactive={true} elevation={Elevation.TWO}>
                      <Tag
                        className="float-left-top"
                        key={idx}
                        fill={true}
                        onRemove={()=>this._handleFilterRemove(idx)}
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
                        onChange={(value)=>this._handleValueChange(idx, value)}
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
