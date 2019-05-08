/// app.js
import React from 'react';
import MapMain from './components/MapMain'
import Sidebar from './components/Sidebar'
import {
  Overlay,
  Classes,
  Card, Button
} from "@blueprintjs/core";

import { css } from '@emotion/core'
import { BarLoader } from 'react-spinners'
import './App.css'
import {utils} from './utils'

var taxiTrips = require('./components/MapMain/day_in_lifetaxi.json')


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      heatmapData: [],
      histogramData: [{pickupdatetimebin:"2018-01-01 00", count:"0"}],
      dayInLifeData: [],
      loading: false
    }

    this.updateHeatmapHelper = this.updateHeatmapHelper.bind(this)
    this.updateHistogramHelper = this.updateHistogramHelper.bind(this)

    this.updateData = this.updateData.bind(this)
  }

  updateData(date){
    this.setState({loading: true})
  }


  updateHistogramHelper(date){
    this.setState({loading: true})
    var parent = this
    var dateString = utils.getDateString(date)
    fetch('https://dc-map-5214.appspot.com/getrideshistogram/' + dateString, {
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

      parent.setState({histogramData: data, loading: false})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  updateHeatmapHelper(date){
    this.setState({loading: true})
    var parent = this
    var query = JSON.stringify({
      "date":date.toISOString().split("T")[0],
      "pickup-time":{
        "from": date.getHours(),
        "to": date.getHours() + 1
      }
    })

    fetch('https://dc-map-5214.appspot.com/getrides', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: query,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      parent.setState({
        loading: false,
        heatmapData: responseJson.results
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  getDayInLife(date){
    var parent = this
    this.setState({loading: true})

    fetch('https://dc-map-5214.appspot.com/getrandomtaxirides/2013-01-31', {
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      parent.setState({loading: false, dayInLifeData: utils.sanitizeTrips(responseJson.rides)})
    })
    .catch((error) => {
      console.error(error)
    })
  }




  render() {
    return (
      <div style={{clear: "both" }}>

        <div className="firstColumn" >
          <Sidebar
            histogramData={this.state.histogramData}
            updateHeatmapCallback={(type, query) => this.updateHeatmapHelper(type, query)}
            updateHistogramCallback={(query) => this.updateHistogramHelper(query)}
            updateDataCallback={(date) => this.updateData(date)}
            getDayInLifeCallback={(date) => this.getDayInLife(date)}
          />
        </div>

        <div className="secondColumn">
          <BarLoader
            css={{"zIndex": 1}}
            sizeUnit={"px"}
            width={2000}
            color={'#36D7B7'}
            loading={this.state.loading}
          />
          <MapMain
            heatmapData={this.state.heatmapData}
            dayInLifeData={this.state.dayInLifeData}
          />
        </div>
      </div>
    );
  }
}


export default App;
