import React from 'react';
import './index.css';

const CarouselItem = props =>
  <div className="card card-mini mb-4 card-clickable" onClick={props.onClickEvent}>
    <div className="card-body" style={{ padding: '0.3rem'}}>
      <img 
        src={props.source} 
        className="img-fluid rounded"
        alt="carousel item"
      />  
    </div>
  </div>

export default CarouselItem;