import React, {Component} from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Graph from './Graph';
import {modes} from "./constants";


export default class Canvas extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const {NORMAL, ADD_EDGE, DELETE} = modes;

    if (this.props.mode === NORMAL) {
      var clickNodeFunc = this.props.onMarkNode;
    }
    else if(this.props.mode === ADD_EDGE) {
      var clickNodeFunc = this.props.onSelectNode;
    }
    else if(this.props.mode === DELETE) {
      var clickNodeFunc = this.props.onDeleteNode;
    }


    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}

        onClick={this.props.onClick}
      >

        <Graph 
          mode={this.props.mode}
          nodes={this.props.nodes}
          edges={this.props.edges}

          onClickNode={clickNodeFunc}
          onMoveNode={this.props.onUpdateNodeLoc}
          onClickEdge={this.props.onDeleteEdge}
        />


      </Stage>
    );
  }
}