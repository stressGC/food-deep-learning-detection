import * as tf from '@tensorflow/tfjs';
import { MobileNet } from './model';
import React, { Component } from 'react';

import './index.css';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.resultRef = React.createRef();

    this.state = {
      image: null,
    }
  }

  onChange({ target }) {
    const image = URL.createObjectURL(target.files[0]);
    this.setState({
      image,
    })
  }

  predict = async () => {
    const imageElement = this.imageRef.current;

    this.resultRef.current.innerText = 'Loading MobileNet...';
    const mobileNet = new MobileNet();
    await mobileNet.load();

    const pixels = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]);
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 5);
  
    this.resultRef.current.innerText = '';
    topK.forEach(x => {
      this.resultRef.current.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });
    mobileNet.dispose();
  }

  render() {
    return (
      <div className="row" style={{ paddingTop: "73px" }}>
        <div className="col-md-6">
          <h3>Chargez une image</h3>
          <div class="file-input-wrapper mb-3">
            <button class="btn btn-primary">DEPUIS VOTRE PC</button>
            <input type="file" onChange={this.onChange.bind(this)}/>
          </div>
          {this.state.image && <img src={this.state.image} className="img-fluid" alt="predict" ref={this.imageRef} onLoad={this.predict} />}
        </div>
        <div className="col-md-6">
          <div ref={this.resultRef}></div>
        </div>
      </div>
    );
  }
}
