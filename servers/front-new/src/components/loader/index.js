import React from 'react';
import Loader from 'react-loader-spinner';

const CustomLoader = props =>
  <div className="w-100 h-100 d-flex p-1" style={{ verticalAlign: "middle", justifyContent: "center"}}>
    <Loader 
      type="Triangle"
      color="#4C84FF"
      height="150"	
      width="150"
    />  
  </div>

export default CustomLoader;