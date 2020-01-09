import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import "uikit/dist/css/uikit.css"
import '../assets/css/App.css'


import React, { Component } from 'react'
import Header from "./Header"
import Sidebar from "./Sidebar"
import Query from "./Query"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {connected: false}
  }

  render() {
    return (
      <div style={{height: "100%", overflowX: "hidden"}}>
        <Header 
          connected={() => {
            this.setState({connected: true}, () => {
              this.content.loadData() 
            })
          }}
          disconnect={() => this.setState({connected: false})}
        />
        {this.state.connected
          ?
            <div>
              <Sidebar ref={instance => this.content = instance }/>
              <Query />
            </div>
          : 
            <div style={{display: "flex", height: "calc(100vh - 100px)", justifyContent: "center", alignItems: "center" }}>
              <h1>Not Connected</h1>
            </div>
        }

      </div>
    )
  }
}

export default App
