import React from 'react';
import Main from '../../components/main';
import NavBar from '../../components/navbar';

import './App.css';
import './index.css';

const MainPage = props =>
  <div className="container py-4">
    <NavBar />
    <Main />
  </div>;

export default MainPage;
