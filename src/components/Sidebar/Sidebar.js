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
  Spinner
} from "@blueprintjs/core"

import {
  DatePicker,
} from "@blueprintjs/datetime";

import { css } from '@emotion/core'
import { BarLoader } from 'react-spinners'

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
      selectedDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      currentDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      disableDatePicker:false,
      activeHistogramIndex: 0,
      histogramData: this.props.histogramData,
    }

    this._toggleLayers = this._toggleLayers.bind(this)

    this._incrementHour = this._incrementHour.bind(this)
    this._decrementHour = this._decrementHour.bind(this)

    this._visualizeHeatmapByHour = this._visualizeHeatmapByHour.bind(this)
    this._startHeatmapVisualization = this._startHeatmapVisualization.bind(this)

    this._handleHistogramBarClick = this._handleHistogramBarClick.bind(this)
  }

  componentDidMount(){
    this.props.updateHistogramCallback(this.state.currentDate)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.histogramData != this.state.histogramData){
      this.setState({histogramData: newProps.histogramData})
    }
  }

  _handleHistogramBarClick(data, index) {
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

  _startHeatmapVisualization(){
    if (this.state.disableDatePicker){
      window.alert("wait for current one to finish")
      return
    }
    var latency = 5 // seconds
    let newDate = this.state.currentDate.setHours(0)
    this.setState({
      disableDatePicker:true,
      currentDate: new Date(newDate),
      activeHistogramIndex: 0
    })
    this.vizInterval = setInterval(this._visualizeHeatmapByHour, 1000 * latency)
  }

  _visualizeHeatmapByHour(){

    if( this.state.currentDate.getHours() - this.state.selectedDate.getHours() === 24 ){
      clearInterval(this.vizInterval)
      this.setState({disableDatePicker:false})
      return
    }


    this.props.updateHeatmapCallback(this.state.currentDate)

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
    this.props.updateHistogramCallback(date)
    this.setState({ selectedDate: date, currentDate: date})
  }

  _incrementHour(){

    let newDate = this.state.currentDate.setHours(
      this.state.currentDate.getHours() + 1
    )

    newDate = new Date(newDate)
    this.setState({currentDate: new Date(newDate)}, ()=>{
      this.props.updateHeatmapCallback(newDate)
    })
  }

  _decrementHour(){
    let newDate = this.state.currentDate.setHours(
      this.state.currentDate.getHours() - 1
    )
    newDate = new Date(newDate)
    this.props.updateHeatmapCallback(newDate)
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
                  onClick={()=>this._startHeatmapVisualization()}
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
              data={this.state.histogramData}>
              <Bar onClick={()=>this._handleHistogramBarClick()} dataKey="count">
                {
                  this.state.histogramData.map((entry, index) => (
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
                  this.state.histogramData[this.state.activeHistogramIndex].pickupdatetimebin
                }: ${
                  this.state.histogramData[this.state.activeHistogramIndex].count
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
          <Button
            onClick={() => this.props.getDayInLifeCallback(this.state.currentDate)}
            intent="primary" className="rect" icon="play"  text="Start"
          />
        </div>

      </div>
    )
  }
}

export default Sidebar
