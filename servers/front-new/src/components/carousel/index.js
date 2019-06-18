import React, { Component } from 'react';

import chicken from '../../pictures/chicken.PNG';
import karting from '../../pictures/karting.PNG'
import trump from '../../pictures/trump.jpg';
import beer from '../../pictures/beer.jpg';
import notredame from '../../pictures/notredame.jpg';
import kimono from '../../pictures/kimono.jpg';

import './index.css';

import CarouselItem from '../carouselItem';

const Container = props =>
  <div className="container">
    {props.children}
  </div>

const Footer = props =>
  <footer className="footer fixed-bottom pt-4" style={{ borderTop: "2px solid #4c84ff", backgroundColor: '#1D2531'}}>
    {props.children}
  </footer>

const Row = props =>
  <div className="row align-items-center">{props.children}</div>;

const Col = props => 
  <div className={`col-md-${props.size}`}>{props.children}</div>

export default class Carousel extends Component {
  render() {
    return (
      <Footer>
        <Container>
          {this.props.isRunning && <div className="overlay" /> }
          <Row>
            <h3 className="mb-4" style={{ color: "#E8E9EB" }}>ou depuis la librairie...</h3>
          </Row>
          <Row>
            <Col size="2">
              <CarouselItem source={chicken}  onClickEvent={(e) => this.props.onCarouselClick(chicken)} />
            </Col>
            <Col size="2">
              <CarouselItem source={karting} onClickEvent={(e) => this.props.onCarouselClick(karting)} />
            </Col>
            <Col size="2">
              <CarouselItem source={trump}  onClickEvent={(e) => this.props.onCarouselClick(trump)} />
            </Col>
            <Col size="2">
              <CarouselItem source={beer}  onClickEvent={(e) => this.props.onCarouselClick(beer)} />
            </Col>
            <Col size="2">
              <CarouselItem source={notredame}  onClickEvent={(e) => this.props.onCarouselClick(notredame)} />
            </Col>
            <Col size="2">
              <CarouselItem source={kimono}  onClickEvent={(e) => this.props.onCarouselClick(kimono)} />
            </Col>
          </Row>
        </Container>
      </Footer>
    );
  }
}