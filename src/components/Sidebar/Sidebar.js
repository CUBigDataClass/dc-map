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
  Tag,
  Classes,
  Intent,

} from "@blueprintjs/core"
import {
  DatePicker,
} from "@blueprintjs/datetime";
import moment from "moment";
import './Sidebar.css'

import {requests} from '../../requests'
import {utils} from '../../utils'

const FORMAT_TIME = "dddd, LL LT";

class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      layersIsVisible: false,
      filtersIsVisible: true,
      selectedDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      currentDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      disableDatePicker:false,
      activeHistogramIndex: 0,
      hourlyStats: [{pickupdatetimebin:"2018-01-01 00", count:"0"}]
    }

    this._toggleLayers = this._toggleLayers.bind(this)

    this._incrementHour = this._incrementHour.bind(this)
    this._decrementHour = this._decrementHour.bind(this)
    this._visualizePathsByHour = this._visualizePathsByHour.bind(this)
    this._startVisualization = this._startVisualization.bind(this)
    this._handleBarClick = this._handleBarClick.bind(this)
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
          <h3 className="bp3-dark bp3-heading">A day in life</h3>
          <Button onClick={() => this.props.updateMapDataCallback(2, {})} intent="primary" className="rect" icon="play"  text="Start"/>
        </div>

      </div>
    )
  }
}

export default Sidebar
