import React from 'react';

const NavBar = props =>
  <nav className="navbar fixed-top bg-dark" style={{ borderBottom: "2px solid #4c84ff", backgroundColor: '#1D2531'}}>
    <div className="w-100" style={{ padding: '0px 80px'}}>
      <h3 className="float-left" style={{ color: "#E8E9EB" }}>Détection d'objets par 
          <a href="https://www.linkedin.com/in/georges-cosson/"> Georges Cosson</a>
      </h3>
      <h3 className="float-right" style={{ color: "#E8E9EB" }}>
        UQAC - Machine Learning
      </h3>
    </div>
  </nav>;

export default NavBar;