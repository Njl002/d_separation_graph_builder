import React, {Component} from 'react';
import { Arrow } from 'react-konva';

export default class Edge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xStart: this.props.xStart,
      yStart: this.props.yStart,
      xEnd: this.props.xEnd,
      yEnd: this.props.yEnd
    }

    this.handleClick=this.handleClick.bind(this);
  }

  handleClick() {
    console.log("Edge clicked");
    this.props.onClick(this.props.edge);
  }

  render() {
    return (
      <Arrow
        points= {[
          this.props.xStart, this.props.yStart, this.props.xEnd, this.props.yEnd
        ]}
        pointerLength={7}
        pointerWidth={7}
        stroke="black"
        strokeWidth={5}
        onClick={this.handleClick}
      />
    );
  }
}