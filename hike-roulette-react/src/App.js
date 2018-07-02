import React, { Component } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Hike Roulette"/>
        <Footer small="Created By Coleman Imhoff"/>
      </div>
    )
  }
}

export default App
