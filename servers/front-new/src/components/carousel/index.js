import React, { Component } from 'react';

import cat from '../../pictures/cat.jpg'
import sloth from '../../pictures/sloth.jpg';
import datacenter from '../../pictures/datacenter.jpg';
import coast from '../../pictures/coast.jpg';

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
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Footer>
        <Container>
          <Row>
            <Col size="3">
              <h3 style={{ color: "#E8E9EB" }}>ou depuis la librairie...</h3>
            </Col>
            <Col size="2">
              <CarouselItem source={cat} />
            </Col>
            <Col size="2">
              <CarouselItem source={datacenter} />
            </Col>
            <Col size="2">
              <CarouselItem source={sloth} />
            </Col>
            <Col size="2">
              <CarouselItem source={coast} />
            </Col>
          </Row>
        </Container>
      </Footer>
    );
  }
}