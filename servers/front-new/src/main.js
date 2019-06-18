import * as tf from '@tensorflow/tfjs';
import { MobileNet } from './model';
import React, { Component } from 'react';
import './index.css';
import CustomLoader from './components/loader';
import ListItem from './components/listItem';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.resultRef = React.createRef();

    this.state = {
      image: null, 
      isRunning: false,
      predictedClasses: [],
    }
  }

  onChange({ target }) {
    const image = URL.createObjectURL(target.files[0]);
    this.setState({
      image,
    })
  }

  predict = async () => {
    this.setState({
      isRunning: true,
    });
    const imageElement = this.imageRef.current;

    // this.resultRef.current.innerText = 'Loading MobileNet...';
    const mobileNet = new MobileNet();
    await mobileNet.load();

    const pixels = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]);
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 5);
    
    const predictedClasses = topK.map(c => {
      return { 
        label: c.label,
        probability: c.value.toFixed(3),
      };
    });

    this.setState({
      isRunning: false,
      predictedClasses,
    });
    mobileNet.dispose();

  }

  render() {
    return (
      <div className="row" style={{ paddingTop: "73px", marginBottom: "73px" }}>
        <div className="col-md-5">
          <div className="card card-default">
						<div className="card-header card-header-border-bottom">
							<h2>{!this.state.isRunning ? 'Chargez une image' : 'Prédictions en cours...'}  </h2>
						</div>
						<div className="card-body">
            {!this.state.isRunning &&
              <div className="file-input-wrapper mb-3">
                <button className="btn btn-primary">DEPUIS VOTRE PC</button>
                <input type="file" onChange={this.onChange.bind(this)}/>
              </div>
          }
          {this.state.image && <div className="text-center"><img src={this.state.image} className="img-fluid rounded mx-auto" alt="predict" ref={this.imageRef} onLoad={this.predict} /></div>}
						</div>
					</div>
        </div>
        {this.state.predictedClasses.length > 0 &&
          <div className="col-md-7">
            <div class="card card-default">
              <div class="card-header card-header-border-bottom">
                <h2> Classes détectées </h2>
              </div>
              <div class="card-body">
                <p class="mb-2">Voici les classes qui ont été détectées !</p>
                <ul class="list-group" ref={this.resultRef}>
                  {this.state.predictedClasses.map(pred => <ListItem label={pred.label} probability={pred.probability} />)}
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
