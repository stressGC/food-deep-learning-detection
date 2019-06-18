import React from 'react';

const A = (props) =>
      <ul className="nav nav-pills nav-justified nav-style-fill">
				<li className="nav-item">
					<a className={props.fromFile ? "nav-link active" : "nav-link"} onClick={()=> props.onInputTypeChange(true)}>File</a>
				</li>
				<li className="nav-item">
					<a className={!props.fromFile ? "nav-link active" : "nav-link"} onClick={() => props.onInputTypeChange(false)}>Webcam</a>
				</li>
      </ul>;
      
export default A;