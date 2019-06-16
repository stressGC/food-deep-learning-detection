import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
    };
    this.onFileChange = this.onFileChange.bind(this);
  }

  onFileChange({ target }) {
    this.setState({
      file: target.files[0],
    });
  };


  render() {
    return (
      <div className="App App-header">
        <h1 className="title">TensorflowJS client side prediction</h1>
        <main className="file-form">
            <input type="file" onChange={this.onFileChange}/>
            <button type="submit" id="predict">Predict</button>
            <button type="submit" id="clear">Clear</button>
            <span className="file-form__files" id="number-of-files"></span>
        </main>
        <div id="preview"></div>
      </div>
    );
  }
};
