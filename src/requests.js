import {dcMapConfig} from './config'
import axios from 'axios'

class Request {
  // https://dc-map-5214.appspot.com/getwaypoints/-73.989/40.733/-74/40.733
  getWaypoints(from_lon, from_lat, to_lon, to_lat) {
    axios.get(
      dcMapConfig.getApi() +
      'getwaypoints/' + from_lon + '/' + from_lat + '/' + to_lon + '/' + to_lat
    ).then( (response) => {
      console.log(response)
      })
      .catch( (error) => {
        console.log(error)
      })
  }

}

export const requests = new Request()
