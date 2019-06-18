import React, { Component } from 'react';
import './App.css';
import Main from './main';
import A from './components/a';
import Carousel from './components/carousel';
import NavBar from './components/navbar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromFile : true,
    };
    this.onInputTypeChange = this.onInputTypeChange.bind(this);
  }

  onInputTypeChange(bool) {
    console.log(bool)
    this.setState({
      fromFile: bool,
    });
  }

  render() {
    return (
        <div className="container py-4">
          <NavBar />
          {/* <A onInputTypeChange={this.onInputTypeChange} fromFile={this.state.fromFile}/> */}
          <Main />
          <Carousel />
        </div>
    );
  }
}

export default App;
