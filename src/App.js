/// app.js
import React from 'react';
import MapMain from './components/MapMain'
import Sidebar from './components/Sidebar'

import './App.css'
class App extends React.Component {
  render() {

    return (
      <div style={{clear: "both"}}>
        <div className="firstColumn" >
          <Sidebar />
        </div>
        <div className="secondColumn">
          <MapMain />
        </div>
      </div>
    );
  }
}

export default App;
