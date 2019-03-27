import React from 'react'
import {
} from "@blueprintjs/core";

import './Sidebar.css'

class Sidebar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isOpen: true
    }

    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  toggleDrawer() {
    var isOpen = !this.state.isOpen
    this.setState({isOpen: isOpen})
  }
  render() {
    return (
      <div className="Sidebar">

      </div>
    )
  }
}

export default Sidebar
