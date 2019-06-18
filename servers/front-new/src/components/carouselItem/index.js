import React from 'react';
import './index.css';

const CarouselItem = props =>
  <div className="card card-mini mb-4 card-clickable">
    <div className="card-body" style={{ padding: '0.3rem'}}>
      <img 
        src={props.source} 
        className="img-fluid rounded"
      />  
    </div>
  </div>

export default CarouselItem;