import React, {Component} from 'react';
import { Circle } from 'react-konva';
import {sets} from '../../constants'

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.handleClick=this.handleClick.bind(this);
    this.handleDragStart=this.handleDragStart.bind(this);
    this.handleDragMove=this.handleDragMove.bind(this);
  }

  handleClick = () => {
    this.props.onClick(this.props.node);
  };

  handleDragStart = e => {
    e.target.setAttrs({
      scaleX: 1.2,
      scaleY: 1.2
    });
  };

  handleDragMove = e => {
    e.target.to({
      duration: 0.1,
      scaleX: 1,
      scaleY: 1,
    });
    var stage = e.target.getStage();
    let mousePos = stage.getPointerPosition();
    let xMousePos = mousePos.x;
    let yMousePos = mousePos.y;
    this.props.onUpdateLocation(this.props.node, xMousePos, yMousePos)
  };



  render() {
    const {NONE, X, Y, E} = sets;
    let color;
    if (this.props.set === NONE) {
      color='white';
    }
    else if (this.props.set === X) {
      color='lightblue';
    }
    else if (this.props.set === Y) {
      color='lightgreen';
    }
    else if (this.props.set === E) {
      color='lightgrey';
    }
    let strokeColor = this.props.isHighlighted ? 'red' : 'black';
    strokeColor = this.props.isSelected ? 'orange' : strokeColor;
    return (
      <Circle
        draggable
        x={this.props.xLoc}
        y={this.props.yLoc}
        radius={25}
        stroke={strokeColor}
        strokeWidth={5}
        fill={color}
        onClick={this.handleClick}
        onDragStart={this.handleDragStart}
        onDragMove={this.handleDragMove}
      />

    );
  }
}